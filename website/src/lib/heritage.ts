export type ResearchLevel = 1 | 2 | 3;

export const RESEARCH_LEVELS: ResearchLevel[] = [1, 2, 3];

export const RESEARCH_LEVEL_LABELS: Record<ResearchLevel, string> = {
  1: "Level 1 -- Basic Documentation",
  2: "Level 2 -- Research Article",
  3: "Level 3 -- Podcast / Documentary",
};

// The editorial classification spec section 19 requires before publication -- every published
// entry carries one of these rather than being presented as unqualified fact.
export type VerificationStatus =
  | "verified_fact"
  | "documentary_evidence"
  | "oral_history"
  | "local_tradition"
  | "interpretation"
  | "unverified"
  | "contested";

export const VERIFICATION_STATUSES: VerificationStatus[] = [
  "verified_fact",
  "documentary_evidence",
  "oral_history",
  "local_tradition",
  "interpretation",
  "unverified",
  "contested",
];

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  verified_fact: "Verified Historical Fact",
  documentary_evidence: "Documentary Evidence",
  oral_history: "Oral History",
  local_tradition: "Local Tradition",
  interpretation: "Researcher's Interpretation",
  unverified: "Unverified Claim",
  contested: "Contested Claim",
};

export type PublicationStatus = "submitted" | "published" | "rejected";

export type HeritageSubmission = {
  id: string;
  researcherUid: string;
  researcherName: string;
  researcherMemberId?: string;
  researcherDesignation?: string;
  researcherArea?: string;
  state: string;
  district: string;
  tehsil?: string;
  village: string;
  subject: string;
  date?: string;
  location?: string;
  historicalClaim: string;
  source: string;
  interviewee?: string;
  intervieweeAge?: number;
  photoNotes?: string;
  photoUrls?: string[];
  researcherObservations?: string;
  independentVerification?: string;
  currentCondition?: string;
  references?: string;
  researchLevel: ResearchLevel;
  verificationStatus?: VerificationStatus | null;
  publicationStatus: PublicationStatus;
  editorialNote?: string;
};
