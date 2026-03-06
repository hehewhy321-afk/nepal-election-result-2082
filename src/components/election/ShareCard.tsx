import React from 'react';
import type { Candidate, PartyStats } from "@/types/election";
import { getCandidateImageUrl, getSymbolImageUrl, getPartyColor } from "@/lib/electionUtils";
import { Trophy, Clock, MapPin, TrendingUp, Hash } from "lucide-react";

interface ShareCardProps {
    type: 'candidate' | 'party';
    data: any; // Candidate or PartyStats
    margin?: string;
}

export const ShareCard = ({ type, data, margin }: ShareCardProps) => {
    if (type === 'candidate') {
        const candidate = data as Candidate;
        const color = getPartyColor(candidate.PoliticalPartyName, 0);
        const votes = candidate.TotalVoteReceived || 0;

        return (
            <div
                id="share-card-container"
                className="w-[1080px] h-[1080px] bg-white relative flex flex-col overflow-hidden p-16 font-sans text-slate-900"
                style={{
                    background: `linear-gradient(145deg, ${color}11, white 40%, ${color}11)`,
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-bl-full opacity-10 pointer-events-none" style={{ background: color }} />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-tr-full opacity-10 pointer-events-none" style={{ background: color }} />

                {/* Header: Nepal Election 2082 Branding */}
                <div className="flex items-center justify-between border-b-4 border-slate-100 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-24 relative">
                            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                                <path d="M10,110 L90,110 L50,10 Z" fill="#DC3545" />
                                <path d="M10,60 L90,60 L50,10 Z" fill="#0035AD" />
                                <circle cx="50" cy="45" r="10" fill="white" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">Election 2082</h1>
                            <p className="text-2xl font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">nepalelectionresult.vercel.app</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center items-center py-10 gap-10">
                    {/* Candidate Photo */}
                    <div className="relative">
                        <div
                            className="w-64 h-64 rounded-[40px] overflow-hidden border-8 shadow-2xl flex items-center justify-center text-white text-9xl font-bold relative bg-slate-100"
                            style={{
                                borderColor: color,
                                background: `linear-gradient(135deg, ${color}, ${color}99)`
                            }}
                        >
                            {/* Fallback character visible if image is filtered/missing */}
                            <span className="absolute inset-0 flex items-center justify-center -z-0">{candidate.CandidateName.charAt(0)}</span>
                            <img
                                src={getCandidateImageUrl(candidate.CandidateID)}
                                alt={candidate.CandidateName}
                                className="w-full h-full object-cover relative z-10"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                        {/* Party Symbol */}
                        {candidate.SymbolID && (
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white shadow-xl border-4 p-4 flex items-center justify-center ring-8 ring-white overflow-hidden" style={{ borderColor: color }}>
                                <img
                                    src={getSymbolImageUrl(candidate.SymbolID)}
                                    alt="Symbol"
                                    className="w-full h-full object-contain relative z-10"
                                    crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 bg-slate-50 -z-0" />
                            </div>
                        )}
                    </div>

                    {/* Candidate Info */}
                    <div className="text-center space-y-4 max-w-4xl">
                        <h2 className="text-7xl font-black text-slate-900 leading-tight">
                            {candidate.CandidateName}
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <span className="px-6 py-2 rounded-full bg-slate-100 text-slate-700 text-2xl font-bold uppercase tracking-wider">
                                {candidate.PoliticalPartyName}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-500 text-3xl font-medium mt-4">
                            <MapPin className="w-8 h-8" />
                            <span>{candidate.DistrictName} - Area {candidate.SCConstID}</span>
                        </div>
                    </div>

                    {/* Stats Big Row */}
                    <div className="w-full grid grid-cols-2 gap-10 mt-10 px-10">
                        <div className="bg-white rounded-[40px] p-10 shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="flex items-center gap-3 text-slate-400 mb-2 uppercase font-black tracking-widest text-xl">
                                <Hash className="w-6 h-6" /> Total Votes
                            </div>
                            <div className="text-7xl font-black text-slate-900 tabular-nums">
                                {votes.toLocaleString()}
                            </div>
                        </div>

                        {margin ? (
                            <div className="rounded-[40px] p-10 shadow-lg flex flex-col items-center justify-center text-center" style={{ background: color, color: 'white' }}>
                                <div className="flex items-center gap-3 opacity-80 mb-2 uppercase font-black tracking-widest text-xl">
                                    <TrendingUp className="w-6 h-6" /> Performance
                                </div>
                                <div className="text-4xl font-black text-white px-2 leading-tight">
                                    {margin}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900 rounded-[40px] p-10 shadow-lg flex flex-col items-center justify-center text-center text-white">
                                <div className="flex items-center gap-3 opacity-60 mb-2 uppercase font-black tracking-widest text-xl text-slate-200">
                                    <Trophy className="w-6 h-6" /> Current Rank
                                </div>
                                <div className="text-7xl font-black text-white tabular-nums">
                                    {candidate.Rank === "1" ? "First" : `Rank ${candidate.Rank}`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="flex justify-between items-end pt-10 border-t-4 border-slate-100 mt-auto">
                    <div className="space-y-1">
                        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest leading-none">Share On</p>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">FB / TWITTER / INSTA</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Verified Data</p>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">ELECTION COMMISSION NEPAL</p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'party') {
        const stats = data as PartyStats;
        const color = stats.color;

        return (
            <div
                id="share-card-container"
                className="w-[1080px] h-[1080px] bg-slate-900 relative flex flex-col overflow-hidden p-16 font-sans text-white"
                style={{
                    background: `linear-gradient(145deg, ${color}33, #0f172a 40%, #0f172a)`,
                }}
            >
                {/* Branding */}
                <div className="flex items-center justify-between border-b-2 border-white/10 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-24 relative">
                            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                                <path d="M10,110 L90,110 L50,10 Z" fill="#DC3545" />
                                <path d="M10,60 L90,60 L50,10 Z" fill="#0035AD" />
                                <circle cx="50" cy="45" r="10" fill="white" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tight uppercase">Election 2082</h1>
                            <p className="text-2xl font-bold text-white/50 uppercase tracking-[0.2em] mt-2">Official Party Index</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center gap-16 py-10">
                    <div className="space-y-6">
                        <div className="w-32 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <h2 className="text-8xl font-black leading-tight max-w-4xl">
                            {stats.party}
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 flex flex-col items-center justify-center text-center">
                            <Trophy className="w-12 h-12 mb-6 text-yellow-500" />
                            <div className="text-7xl font-black tabular-nums">{stats.seatsWon}</div>
                            <div className="text-xl font-bold text-white/40 uppercase tracking-widest mt-2">Seats Won</div>
                        </div>

                        <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 flex flex-col items-center justify-center text-center">
                            <TrendingUp className="w-12 h-12 mb-6 text-emerald-500" />
                            <div className="text-7xl font-black tabular-nums">{stats.totalVotes.toLocaleString()}</div>
                            <div className="text-xl font-bold text-white/40 uppercase tracking-widest mt-2">Total Votes</div>
                        </div>

                        <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 mb-6 flex items-center justify-center">
                                <PercentIcon className="w-full h-full text-blue-500" />
                            </div>
                            <div className="text-7xl font-black tabular-nums">{stats.candidates}</div>
                            <div className="text-xl font-bold text-white/40 uppercase tracking-widest mt-2">Candidates</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-10 border-t-2 border-white/10 mt-auto opacity-60">
                    <p className="text-3xl font-black tracking-tight">NEPAL ELECTION PORTAL · 2082</p>
                    <p className="text-xl font-bold uppercase tracking-widest">LIVE DATA REPORT</p>
                </div>
            </div>
        );
    }

    return null;
};

const PercentIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="19" y1="5" x2="5" y2="19"></line>
        <circle cx="6.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
);
