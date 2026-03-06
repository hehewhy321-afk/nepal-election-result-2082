export interface Candidate {
  CandidateID: number;
  CandidateName: string;
  AGE_YR: number;
  Gender: string;
  PoliticalPartyName: string;
  SYMBOLCODE: number;
  SymbolName: string;
  DistrictName: string;
  StateName: string;
  STATE_ID: number;
  SCConstID: string;
  SymbolID: number;
  TotalVoteReceived: number;
  Rank: string;
  QUALIFICATION: string;
  NAMEOFINST: string;
  EXPERIENCE: string;
  OTHERDETAILS: string;
  ADDRESS: string;
  FATHER_NAME: string;
  SPOUCE_NAME: string;
  DistrictCd: number;
}

export interface PartyStats {
  party: string;
  totalVotes: number;
  candidates: number;
  seatsWon?: number;
  color: string;
}

export interface ProvinceStats {
  province: string;
  totalVotes: number;
  candidates: number;
}

export interface GenderStats {
  gender: string;
  count: number;
}
