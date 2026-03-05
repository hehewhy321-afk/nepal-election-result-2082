const https = require('https');
const fs = require('fs');
const path = require('path');

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";
const rawDir = path.join(__dirname, '../public/data/raw');
const finalPath = path.join(__dirname, '../public/data/election-results-2082.json');

if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

function httpsGet(url, headers) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers, timeout: 20000 }, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Failed to fetch ${url} - Status: ${res.statusCode}`));
            }
            let data = Buffer.alloc(0);
            res.on('data', chunk => data = Buffer.concat([data, chunk]));
            res.on('end', () => resolve({ data, headers: res.headers }));
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    });
}

function cleanString(str) {
    if (!str) return '';
    return str.replace(/^\uFEFF/, '').trim();
}

async function syncRaw() {
    const isCI = process.env.CI || process.env.VERCEL;
    console.log(`Segmented Sync 2.0 - ${isCI ? 'CI Deployment' : 'Local'} Mode`);

    // 1. Session Setup
    const sessionRes = await httpsGet('https://result.election.gov.np/', { 'User-Agent': userAgent });
    const cookies = sessionRes.headers['set-cookie'] || [];
    const tokenCookie = cookies.find(c => c.startsWith('CsrfToken='));
    const token = decodeURIComponent(tokenCookie.split('=')[1].split(';')[0]);
    const headers = {
        'X-CSRF-Token': token,
        'Cookie': tokenCookie.split(';')[0],
        'Referer': 'https://result.election.gov.np/MapElectionResult2082.aspx',
        'User-Agent': userAgent,
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    };

    // 2. Fetch Lookup
    const lookupRes = await httpsGet('https://result.election.gov.np/Handlers/SecureJson.ashx?file=JSONFiles/Election2082/HOR/Lookup/constituencies.json', headers);
    const lookup = JSON.parse(cleanString(lookupRes.data.toString('utf8')));

    console.log(`Starting Download Sequence for 165 segments...`);
    let downloaded = 0;

    for (const dist of lookup) {
        const dc = dist.distId;
        const maxFc = dist.consts;

        for (let fc = 1; fc <= maxFc; fc++) {
            const fileName = `HOR-${dc}-${fc}.json`;
            const filePath = path.join(rawDir, fileName);

            if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10) {
                process.stdout.write("."); // Skip already saved
                downloaded++;
                continue;
            }

            let success = false;
            let retries = 0;
            while (!success && retries < 5) {
                retries++;
                try {
                    await new Promise(r => setTimeout(r, 1500)); // Rate limit
                    const url = `https://result.election.gov.np/Handlers/SecureJson.ashx?file=JSONFiles/Election2082/HOR/FPTP/${fileName}`;
                    const res = await httpsGet(url, headers);
                    fs.writeFileSync(filePath, res.data);
                    process.stdout.write("+");
                    success = true;
                    downloaded++;
                } catch (e) {
                    console.log(`\n[Attempt ${retries}] Error fetching ${fileName}: ${e.message}`);
                    await new Promise(r => setTimeout(r, isCI ? 5000 : 3000));
                }
            }
        }
    }

    // 3. Final Merge with Sanitization
    console.log(`\nMerging ${downloaded} segments into final database...`);
    let allCandidates = [];
    const processedKeys = new Set();
    const uniqueDistricts = new Set();

    fs.readdirSync(rawDir).forEach(file => {
        if (!file.endsWith('.json')) return;
        const rawContent = fs.readFileSync(path.join(rawDir, file), 'utf8');
        const jsonText = cleanString(rawContent);
        if (jsonText.length < 10) return;

        try {
            const data = JSON.parse(jsonText);
            if (Array.isArray(data)) {
                data.forEach(c => {
                    const cKey = `${c.DistrictCd}-${c.SCConstID}-${c.CandidateID || c.SerialNo}`;
                    if (!processedKeys.has(cKey)) {
                        allCandidates.push(c);
                        processedKeys.add(cKey);
                        uniqueDistricts.add(c.DistrictName);
                    }
                });
            }
        } catch (e) {
            console.error("Merge error:", e.message);
        }
    });

    fs.writeFileSync(finalPath, JSON.stringify(allCandidates, null, 2), 'utf8');
    console.log(`Final Database Ready:`);
    console.log(`- Districts: ${uniqueDistricts.size} (Target: 77)`);
    console.log(`- Candidates: ${allCandidates.length}`);
}

async function start() {
    const isWatch = process.argv.includes('--watch');
    do {
        await syncRaw();
        if (isWatch) {
            console.log("\nWaiting 10 minutes for next sync...");
            await new Promise(r => setTimeout(r, 10 * 60 * 1000));
        }
    } while (isWatch);
}

start().catch(err => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
});
