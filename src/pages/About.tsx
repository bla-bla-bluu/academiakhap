import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      {/* Navbar */}
      <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo_clean.png"
              alt="Academia Khap Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"/>

            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
              Academia Khap
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Leadership & Team
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-10">
            Directors & Core Team
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 sm:pb-16">
          {/* Dhillon */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

            <div className="w-20 h-20 rounded-full bg-[#5b3419] text-white flex items-center justify-center text-2xl font-bold mb-6">
              D
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Dr. Deepak Dhillon
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Strategic Research Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Leads research initiatives,
                analytical studies,
                publications,
                and historical documentation.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">

                  <li>B.Voc, MSc CS, MTech Defence Tech, PhD Artificial Intelligence</li>
                  <li>Community Leadership, Academic Writing & Fact Analysis</li>

                </ul>

              </div>

            </div>

          </div>
          {/* Harsh */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

            <div className="w-20 h-20 rounded-full bg-[#5b3419] text-white flex items-center justify-center text-2xl font-bold mb-6">
              H
            </div>

            <h3 className="text-3xl font-bold mb-2">
              Mr. Harsh Kaliraman
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Community & Operations Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Oversees operations, outreach,
                organizational management,
                and community coordination.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">

                  <li>BA, MA Archaeology</li>
                  <li>Public Outreach, Evidence Analysis, Community Gathering</li>

                </ul>

              </div>

            </div>

          </div>
          {/* Tewatia */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

            <div className="w-20 h-20 rounded-full bg-[#5b3419] text-white flex items-center justify-center text-2xl font-bold mb-6">
              T
            </div>

            <h3 className="text-3xl font-bold mb-2">
              Mr. Aastik Tewatia
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Policy & Communications Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Handles institutional communication,
                public messaging,
                outreach strategy,
                and policy coordination.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">
                  <li>BA, MA History</li>
                  <li>Policy Communication, Public Relations & Community Coordination, Historical Document Analysis</li>
                </ul>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Supporting Members */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20 py-12 sm:py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Supporting Members
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 sm:mb-14">
            Advisory & Research Support
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

              {/* Navtej Mangat */}
              <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

                <h3 className="text-3xl font-bold mb-3">
                  Mr. Navtej Singh Mangat
                </h3>

                <p className="text-lg font-semibold text-[#5b3419] mb-6">
                  Senior Advisor — Legal, International Affairs & Strategic Guidance
                </p>

                <ul className="space-y-2 list-disc pl-5 text-[17px] leading-8 text-[#4a3728]">

                  <li>
                    Education: Charterhouse School & Epsom College, United Kingdom
                  </li>

                  <li>
                    UCL — LLB (Hons), Law Society Finals (College of Law, Guildford) — Distinction
                  </li>

                  <li>
                    Bar Examinations, Honourable Society of Lincoln’s Inn — Distinction
                  </li>

                  <li>
                    Qualified Solicitor & Barrister in the United Kingdom, Retired Solicitor — Supreme Court of England & Wales
                  </li>

                  <li>
                    15+ Years In-House General Commercial Lawyer for multinational corporations including Wyeth, Pfizer, Peugeot-Citroën, Allergan, Syngenta & 3M
                  </li>

                  <li>
                    Political Experience: Press Officer to Woking Constituency Labour Party at age 21
                  </li>

                  <li>
                    Youngest shortlisted Prospective Parliamentary Candidate (PPC) for constituency nomination at age 23
                  </li>

                  <li>
                    Diploma in Advanced French — Institut Français (Université de Lille)
                  </li>

                  <li>
                    International Community Guidance, Legal Advisory & Strategic Support
                  </li>

                </ul>

              </div>

            </div>
            {/* Ajay Kumar */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

              <h3 className="text-3xl font-bold mb-3">
                Dr. Ajay Kumar Vashist
              </h3>

              <p className="text-lg font-semibold text-[#5b3419] mb-6">
                Research & Technical Support
              </p>

              <ul className="space-y-2 list-disc pl-5 text-[17px] leading-8 text-[#4a3728]">
                <li>BTech, MTech Defence Tech, PhD Artificial Intelligence</li>
                <li>Fact observations, Community Outreach & Analysis</li>
              </ul>

            </div>

            {/* Ajay Gathwal */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

              <h3 className="text-3xl font-bold mb-3">
                Mr. Ajay Gathwal
              </h3>

              <p className="text-lg font-semibold text-[#5b3419] mb-6">
                Senior Advisor
              </p>

              <p className="text-[17px] leading-8 text-[#4a3728]">
                American Citizen • International Advisory & Strategic Support
              </p>

            </div>

          </div>

          {/* Legal Advisor */}
          <div className="mt-16 bg-[#faf6ef] border border-dashed border-[#b38b59]/40 rounded-[2rem] p-10 text-center">

            <h3 className="text-3xl font-bold mb-4">
              Legal Advisory Panel
            </h3>

            <p className="text-lg text-[#4a3728]">
              Additional legal advisors and academic contributors
              will be announced officially.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}
