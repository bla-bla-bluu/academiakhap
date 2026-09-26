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

export type PublicationStatus = "submitted" | "published" | "rejected" | "additional_research";

export type HeritageSubmission = {
  id: string;
  reportNumber?: string;
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
  researcherObservations?: string;
  independentVerification?: string;
  currentCondition?: string;
  references?: string;
  researchLevel: ResearchLevel;
  verificationStatus?: VerificationStatus | null;
  publicationStatus: PublicationStatus;
  editorialNote?: string;
};

// A reviewer's recommendation on an assigned submission -- distinct from the editorial
// publicationStatus, which only an admin sets. Doc id is `${submissionId}_${reviewerUid}`, both
// so a reviewer can only ever be assigned to a given submission once and so the Firestore rule
// granting the reviewer read access to that submission can check existence with a single id.
export type ReviewDecision = "recommend_publish" | "recommend_reject" | "needs_more_work";

export const REVIEW_DECISIONS: ReviewDecision[] = ["recommend_publish", "recommend_reject", "needs_more_work"];

export const REVIEW_DECISION_LABELS: Record<ReviewDecision, string> = {
  recommend_publish: "Recommend Publish",
  recommend_reject: "Recommend Reject",
  needs_more_work: "Needs More Work",
};

export type HeritageReviewAssignment = {
  id: string;
  submissionId: string;
  reviewerUid: string;
  reviewerName: string;
  assignedByName?: string;
  decision?: ReviewDecision | null;
  comments?: string;
};
