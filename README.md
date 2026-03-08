# Nepal Election Results 2082

A real-time, open-source web portal for tracking Nepal's 2082 Pratinidhi Sabha (House of Representatives) election results. Built with React, TypeScript, and Vite.

---

## Overview

This portal fetches live election data from the Election Commission Nepal API and presents it in a filterable, searchable interface. The application is fully bilingual (Nepali and English), mobile-responsive, and updates automatically throughout the counting period.

**Data source:** [Election Commission Nepal](https://result.election.gov.np/)

**Coverage:** 165 constituencies across 77 districts and 7 provinces.

---

## Features

- **Live data** - Fetches results directly from the Election Commission Nepal API with a Vite dev-proxy to avoid CORS issues. Falls back to local sample data when the API is unavailable.
- **Counting Progress & Result Status** - Real-time tracking of how many constituencies have started counting and when the data was last refreshed.
- **Find My Constituency** - Quick-jump widget with cascading Province -> District -> Constituency selectors to instantly find local results.
- **Auto-refresh** - Configurable polling interval to pull fresh results without a manual page reload.
- **Top Winners Leaderboard** - A nationwide ranking of candidates by total votes received.
- **Constituency Spotlight (Winner Slider)** - Auto-rotating slider that cycles through the leading candidates of every constituency, showing party, symbol, district, votes, educational background, and **live vote margins**.
- **Candidate grid** - Paginated card and list view of all candidates with winner badges. Click any candidate to open a full detail panel.
- **Candidate detail panel** - Full profile: party, symbol, constituency, address, qualification, age, gender, father's name, spouse name. Displays **live vote margin** (lead/trail status) and a profile photo (if available from ECN, otherwise a generated avatar).
- **Comprehensive Analytics & Insights**:
  - **Party Analysis** - Toggle between a donut chart and a bar chart showing seat and vote distribution by party.
  - **Provincial Votes** - Bar chart showing vote distribution across the 7 provinces.
  - **Party Comparison** - Scatter chart comparing vote share vs candidate count for major parties.
  - **Demographics** - Dedicated visualizations for Candidate Educational Qualification, Candidate Experience, Gender Diversity (Donut), Gender Representation by Province (Stacked Bar), and Age Distribution by Gender (Stacked Bar).
- **Data Tables**:
  - **Top Candidates** - Detailed list of top-ranked candidates.
  - **District table** - Summary of candidate counts and leading parties per district.
  - **Constituency list** - Full list of all 165 constituencies with quick-jump navigation.
- **Export Data** - Download the currently filtered candidate list as a CSV file for offline analysis.
- **Bilingual UI** - Labels and status messages in both Nepali script and English throughout the interface.
- **Dark mode** - Full light/dark theme support with premium glassmorphism aesthetics.
- **Responsive** - Designed and tested on mobile, tablet, and desktop viewports.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data fetching | TanStack Query (React Query) |
| Routing | React Router v6 |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or bun

### Installation

```sh
# Clone the repository
git clone https://github.com/your-org/election-result-2082.git
cd election-result-2082

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application runs at `http://localhost:8080` by default.

### Available scripts

```sh
npm run dev        # Start development server with HMR
npm run build      # Production build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

---

## Data Source

The application fetches data from the Election Commission Nepal:

```
https://result.election.gov.np/JSONFiles/ElectionResultCentral2082.txt
```

In development, API calls are routed through Vite's proxy at `/election-api` to avoid CORS restrictions. In production, you will need to either:

- Deploy behind a reverse proxy that forwards requests to the above URL, or
- Host a cached copy of the JSON file alongside the application.

Results are published by the commission incrementally during the counting period (typically 2-3 days after polling day). When no votes have been recorded yet, candidates are shown with a "Counting pending" status.

---

## Project Structure

```
src/
  components/
    election/         # All election-specific components
      CandidateGrid.tsx
      CandidateDetailModal.tsx
      WinnerSlider.tsx
      TopWinnersLeaderboard.tsx
      TopCandidatesTable.tsx
      PartyChart.tsx
      ProvinceChart.tsx
      PartyComparison.tsx
      GenderPieChart.tsx
      GenderByProvinceChart.tsx
      DemographicsCharts.tsx
      AgeDistributionChart.tsx
      ConstituencyList.tsx
      ConstituencyDetail.tsx
      DistrictTable.tsx
      SearchFilter.tsx
      FindMyConstituency.tsx
      StatsCards.tsx
      CountingProgress.tsx
      AutoRefreshTimer.tsx
      CSVExportButton.tsx
      ResultStatus.tsx
    ui/               # shadcn/ui base components
  hooks/
    useElectionData.ts
    useTheme.ts
  lib/
    electionUtils.ts  # Color mapping, data helpers
    candidateUtils.ts # Candidate photo URL helper
    utils.ts
  pages/
    Index.tsx         # Main dashboard page
  types/
    election.ts       # TypeScript types for API response
```

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request for significant changes so the approach can be discussed first.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear commit messages.
4. Push to your fork and open a pull request against `main`.

Please ensure `npm run lint` and `npm run test` pass before submitting. 

---

## License

This project is released under the [MIT License](LICENSE).

The election data displayed in this application is sourced from the Election Commission Nepal and is published as public information. This project is not affiliated with or endorsed by the Election Commission Nepal or the Government of Nepal.
