// Spec section 4's "additional project roles", kept separate from the primary access-control
// Role (admin/trustee/member/scholar) in AuthContext -- a member can hold one of these on top
// of their primary role, and it's an admin-assigned institutional designation, not self-editable.
export type HeritageDesignation = "district_researcher" | "tehsil_coordinator" | "village_researcher";

export const HERITAGE_DESIGNATIONS: HeritageDesignation[] = [
  "district_researcher",
  "tehsil_coordinator",
  "village_researcher",
];

export const HERITAGE_DESIGNATION_LABELS: Record<HeritageDesignation, string> = {
  district_researcher: "District Researcher",
  tehsil_coordinator: "Tehsil Research Coordinator",
  village_researcher: "Village Heritage Researcher",
};
