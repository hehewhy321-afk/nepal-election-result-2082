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
  SCConstID: number;
  ConstName: number;
  TotalVoteReceived: number;
  R: number;
  E_STATUS: string | null;
  QUALIFICATION: string;
  NAMEOFINST: string;
  EXPERIENCE: string;
  OTHERDETAILS: string;
  ADDRESS: string;
  FATHER_NAME: string;
  SPOUCE_NAME: string;
}

export interface PartyStats {
  party: string;
  totalVotes: number;
  candidates: number;
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
