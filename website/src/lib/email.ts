import emailjs from "@emailjs/browser";
import type { Role } from "../contexts/AuthContext";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "As an Admin, you have full access to manage donations, organization expenses, member fund allocations, and review new membership requests.",
  trustee: "As a Trustee, you can view your allotted funds, log your expenses, and see the organization's overall donation and expense totals.",
  member: "As a Member, you can view your allotted funds, log your own expenses, and take part in community discussions.",
  scholar: "As a Scholar, you can view your allotted research funds and log your expenses, and take part in community discussions.",
};

export async function sendJoiningEmail(toName: string, toEmail: string, role: Role) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error("Missing EmailJS config. Set VITE_EMAILJS_* in .env.");
  }
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_name: toName,
      to_email: toEmail,
      role: role.charAt(0).toUpperCase() + role.slice(1),
      role_description: ROLE_DESCRIPTIONS[role],
    },
    { publicKey: PUBLIC_KEY }
  );
}
