import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      {/* Navbar */}
      <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo_clean.png"
              alt="Academia Khap Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <p className="text-xl sm:text-2xl font-bold tracking-wide">
              Academia Khap
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Academia Khap
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-[#4a3728]">Effective date: June 22, 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10 text-[17px] leading-8 text-[#4a3728]">

        <p>
          This Privacy Policy describes how Academia Khap ("we", "us", "our") collects, uses,
          and protects information through the Academia Khap mobile application (the "App") and
          the academiakhap.org website (together, the "Services"). Academia Khap is a research,
          history, and cultural documentation platform that also operates an internal
          membership system for tracking donations, research/scholarship fund allocations, and
          community discussion among its admins, trustees, members, and scholars.
        </p>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Information We Collect</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>
              <span className="font-semibold">Account information:</span> when an admin creates a
              login for you, we store your full name, email address, and assigned role
              (admin, trustee, member, or scholar).
            </li>
            <li>
              <span className="font-semibold">Financial records:</span> donation amounts and
              donor names (visible only to admins), organizational expenses, fund allotments,
              and the expense entries members log against their allotted funds.
            </li>
            <li>
              <span className="font-semibold">Community content:</span> any post or comment you
              submit in the Community feed (limited to 500 characters of plain text; the app does
              not support image, GIF, or file attachments).
            </li>
            <li>
              <span className="font-semibold">Authentication data:</span> handled by Firebase
              Authentication (a Google service) to sign you in securely. We do not see or store
              your password ourselves.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">How We Use This Information</h2>
          <p>
            We use the information above solely to operate the Services: authenticating logins,
            tracking and displaying fund allocations and balances to the relevant member,
            displaying organization-wide totals where your role permits it, and running the
            Community discussion feed. We do not sell your information, and we do not use it for
            advertising profiling at this time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Third-Party Services</h2>
          <p>
            The App is built on Google Firebase (Authentication and Firestore Database) to store
            and secure the data described above. Firebase's handling of this data is governed by
            Google's own privacy and security practices; see{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[#5b3419]"
            >
              Google's Privacy Policy
            </a>{" "}
            for details. We do not currently use any third-party analytics or advertising SDKs
            inside the App. If we introduce advertising within research articles in a future
            version, this policy will be updated beforehand to disclose the specific ad provider
            and what it collects.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Data Access and Security</h2>
          <p>
            Access to financial and account data is restricted by role: members and scholars can
            only see their own fund allocations and expenses; donor-level detail and
            organization-level expense records are visible only to admins. All data is protected
            by Firebase Security Rules enforcing these restrictions at the database level.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Data Retention and Deletion</h2>
          <p>
            We retain account and financial records for as long as your account remains active,
            since they form part of Academia Khap's fund accountability records. To request
            deletion of your personal account information, or to ask what information we hold
            about you, contact us at{" "}
            <a href="mailto:academiakhap@gmail.com" className="underline underline-offset-4 hover:text-[#5b3419]">
              academiakhap@gmail.com
            </a>
            . We will respond and, where we are not required to retain records for organizational
            accountability or legal reasons, remove your personal information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Children's Privacy</h2>
          <p>
            The Services are not directed at children under 13, and we do not knowingly collect
            information from children under 13.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            reflected by updating the effective date above.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Contact Us</h2>
          <p>
            For any questions about this Privacy Policy or your information, contact us at{" "}
            <a href="mailto:academiakhap@gmail.com" className="underline underline-offset-4 hover:text-[#5b3419]">
              academiakhap@gmail.com
            </a>
            .
          </p>
        </div>

      </section>
    </div>
  );
}
