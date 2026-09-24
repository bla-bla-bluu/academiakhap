export type NetworkStatus = "open" | "by_request" | "closed";

export const NETWORK_STATUSES: NetworkStatus[] = ["open", "by_request", "closed"];

export const NETWORK_STATUS_LABELS: Record<NetworkStatus, string> = {
  open: "Open to Connect",
  by_request: "Connections by Request",
  closed: "Not Open to Connect",
};

export const NETWORK_STATUS_DESCRIPTIONS: Record<NetworkStatus, string> = {
  open: "Other members can send you a connection request.",
  by_request: "You're visible in the network, but requests still need your approval before contact is shared.",
  closed: "Your profile stays visible, but no one can send you a connection request.",
};

// Spec default: "Connections by Request".
export const DEFAULT_NETWORK_STATUS: NetworkStatus = "by_request";

export type ConnectionRequestStatus = "pending" | "accepted" | "declined";

export type ConnectionRequest = {
  id: string;
  fromUid: string;
  fromName: string;
  fromEmail: string;
  toUid: string;
  toEmail?: string;
  message?: string;
  status: ConnectionRequestStatus;
};

export type MemberReport = {
  id: string;
  reporterUid: string;
  reporterName: string;
  reportedUid: string;
  reportedName: string;
  reason: string;
  status: "open" | "reviewed";
};
