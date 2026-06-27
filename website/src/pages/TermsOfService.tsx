import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
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
              to="/privacy-policy"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Privacy Policy
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
            Terms of Service
          </h1>
          <p className="text-[#4a3728]">Effective date: June 26, 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10 text-[17px] leading-8 text-[#4a3728]">

        <p>
          These Terms of Service ("Terms") govern your use of the Academia Khap mobile
          application (the "App") and the academiakhap.org website (together, the "Services"),
          operated by Academia Khap, a public charitable educational trust. By creating an
          account or otherwise using the Services, you agree to these Terms.
        </p>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Description of Services</h2>
          <p>
            Academia Khap publishes research articles, evidence-based discussions, podcasts, and
            video features on local history, tradition, and culture, and operates an internal
            membership system (the "Chaupal" and member tools) for community discussion, donation
            and expense tracking, and research/scholarship fund allocation among its Pardhan
            (admin), Panchayati (trustee), member, and scholar roles.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Accounts and Eligibility</h2>
          <p>
            Registering for the member tools or Chaupal requires admin approval. You agree to
            provide accurate information when registering and completing your profile, and you
            are responsible for activity that occurs under your account. We may revoke access for
            any account at our discretion, including for violation of these Terms; this does not
            delete your underlying Google or email login, only your access to Academia Khap's
            Services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Acceptable Use</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>Chaupal posts and replies are limited to 500 characters of plain text.</li>
            <li>
              You may not post content that is unlawful, defamatory, harassing, or that
              misrepresents historical or genealogical claims as verified fact when they are not.
            </li>
            <li>
              You may not use the Services to impersonate another person or misrepresent your
              role or affiliation with Academia Khap.
            </li>
            <li>
              Admins may remove any post, reply, or account that violates these Terms or that they
              otherwise determine is harmful to the community.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Content and Intellectual Property</h2>
          <p>
            The Academia Khap name, logo, ideology, research articles, and published material are
            the property of Academia Khap; no part of this content may be reproduced, copied,
            distributed, or used without prior written permission. By posting in the Chaupal, you
            grant Academia Khap a non-exclusive license to display that content within the
            Services. You remain responsible for what you post.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Financial Records</h2>
          <p>
            Donation, expense, and fund allotment records shown in the member tools are maintained
            for internal transparency among Academia Khap's admins, trustees, members, and
            scholars. They are not a substitute for, and do not replace, Academia Khap's formal
            accounts or any statutory filings required of the Trust.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Research Content Disclaimer</h2>
          <p>
            Articles and discussions published on the Archive reflect ongoing research and are
            presented in good faith with supporting citations and sources where available.
            Historical and genealogical interpretation can evolve as new evidence emerges; we do
            not guarantee that any article is final or free of error, and we update content when
            credible corrections are brought to our attention.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Third-Party Services</h2>
          <p>
            The Services are built on Google Firebase (Authentication and Firestore Database). Use
            of Google Sign-In is also subject to Google's own Terms of Service. See our{" "}
            <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-[#5b3419]">
              Privacy Policy
            </Link>{" "}
            for how we handle data collected through the Services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Disclaimer and Limitation of Liability</h2>
          <p>
            The Services are provided "as is" without warranties of any kind. To the fullest
            extent permitted by law, Academia Khap is not liable for indirect, incidental, or
            consequential damages arising from your use of the Services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Governing Law</h2>
          <p>
            These Terms are governed by the laws of India and the State of Haryana, without
            regard to conflict-of-law principles.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be reflected by
            updating the effective date above.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3b2415]">Contact Us</h2>
          <p>
            For any questions about these Terms, contact us at{" "}
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
