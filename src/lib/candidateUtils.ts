/**
 * Utility helpers for candidate-level data, such as photo URLs.
 *
 * The Election Commission Nepal website hosts candidate photos at a
 * predictable path keyed by CandidateID. We try that URL and let the
 * <img> onError handler fall back to the letter-avatar when it fails.
 */

/** URL of the election-commission Vite proxy base (dev) */
const PROXY_BASE = "/election-api";
const DIRECT_BASE = "https://result.election.gov.np";

/**
 * Try the proxied path first (works in dev without CORS issues),
 * then fall back to the direct URL. The caller should use an
 * `onError` attribute to show a fallback avatar if both 404.
 */
export function getCandidatePhotoUrl(candidateId: number): string {
    // Both paths tried at runtime; we return the proxy path and let
    // the browser handle the 404/CORS via the onError handler.
    const isDev = import.meta.env.DEV;
    if (isDev) {
        return `${PROXY_BASE}/photos/${candidateId}.jpg`;
    }
    return `${DIRECT_BASE}/photos/${candidateId}.jpg`;
}
