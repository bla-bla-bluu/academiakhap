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

            <p className="text-xl sm:text-2xl font-bold tracking-wide">
              Academia Khap
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300">
              Home
            </Link>
            <Link
              to="/community"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300">
              Chaupal
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

        <div className="grid lg:grid-cols-3 gap-5 max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 sm:pb-16">
          {/* Dhillon */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-6 shadow-sm">

            <h3 className="text-2xl font-bold mb-2">
              Mr. Dhillon
            </h3>

            <p className="text-base font-semibold text-[#5b3419] mb-5">
              Strategic Research Director
            </p>

            <div className="space-y-3 text-[16px] leading-7 text-[#4a3728]">

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
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-6 shadow-sm">

            <h3 className="text-2xl font-bold mb-2">
              Mr. Kaliraman
            </h3>

            <p className="text-base font-semibold text-[#5b3419] mb-5">
              Community & Operations Director
            </p>

            <div className="space-y-3 text-[16px] leading-7 text-[#4a3728]">

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
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-6 shadow-sm">

            <h3 className="text-2xl font-bold mb-2">
              Mr. Vashist
            </h3>

            <p className="text-base font-semibold text-[#5b3419] mb-5">
              Policy & Communications Director
            </p>

            <div className="space-y-3 text-[16px] leading-7 text-[#4a3728]">

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
                  <li>BTech, MTech Defence Technology, PhD Artificial Intelligence</li>
                  <li>Policy Communication, Public Relations & Community Coordination, Historical Document Analysis</li>
                </ul>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Supporting Members */}
{/* Supporting Members */}
<section className="bg-[#efe4cf] border-y border-[#8b6a43]/20 py-12 sm:py-24">

  <div className="max-w-7xl mx-auto px-4 sm:px-6">

    <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
      Supporting Members
    </p>

    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-14">
      Advisory, Research & Community Support
    </h2>

    {/* Senior Advisors */}
    <div className="mb-20">

      <h3 className="text-3xl font-bold mb-8">
        Senior Advisors & Backbone
      </h3>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Navtej Mangat */}
        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-3xl font-bold mb-3">
            Mr. Navtej Singh Mangat
          </h3>

            <p className="text-[17px] leading-8 text-[#4a3728]">
          University College London — LLB (Hons), Diploma in Advanced French — Institut Français
            </p>

        </div>

        {/* Ajay Gathwal */}
        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-3xl font-bold mb-3">
            Mr. Ajay Gathwal
          </h3>

          <p className="text-[17px] leading-8 text-[#4a3728]">
            American Citizen • International Advisory &
            Strategic Guidance.
          </p>

        </div>
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-3xl font-bold mb-3">
            Dr. Shivani Singh Tomar
          </h3>

          <p className="text-[17px] leading-8 text-[#4a3728]">
          BA, MA History, MPhil, PhD (Architecture)
          </p>

        </div>

      </div>

    </div>

    {/* Research & Academic Members */}
    <div className="mb-20">

      <h3 className="text-3xl font-bold mb-8">
        Research & Academic Members
      </h3>

      <div className="grid lg:grid-cols-3 gap-8">

        {[
          {
            name: "Dr. Vikas Malik",
            qualification: "BA, MA History, PhD (History)",
            expertise: "Evidence Analyst, Document & Fact Analysis",
          },
          {
            name: "Dr. Chahat Talan",
            qualification: "BSc, MSc, BEd, MEd, PhD (Mathematics)",
            expertise: "Community Outreach, Tribe & Race Analysis",
          },
          {
            name: " Dr. Rajeev Singh Bargoti ",
            qualification: "MPhil, PhD (Historical Archeology)",
            expertise: "Evidence Analyst, Document & Fact Analysis, Military History",
          },
          {
            name: "Mr. Ritik Baliyan",
            qualification: "BA Economics + Political Science, MA Politics & International Relations, PhD Political Science",
            expertise: "Agrarian Politics",
          },
          {
            name: "Miss Antim Chaudhary",
            qualification: "BA, MA Modern History, PhD",
            expertise: "Military History",
          },
          {
            name: "Mr. Hitesh Dahiya",
            qualification: "BA (Political Science + Philosophy), MA Political Science",
            expertise: "Philosophy, Psychology, Social Issues, Geopolitics",
          },
          {
            name: "Mr. Yashvardhan Pannu",
            qualification: "BA Political Science & International Relations (Hons)",
            expertise: "Geopolitical Analysis, Youth Diplomacy, Amateur Research",
          },
          {
            name: "Aryaman Tewatia",
            qualification: "BA History + Political Science, MA Development Studies, MA Political Science",
            expertise: "Political Analysis & Field Work",
          },
        ].map((member) => (
          <div
            key={member.name}
            className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm"
          >
            <h3 className="text-2xl font-bold mb-3">
              {member.name}
            </h3>

            <p className="mb-4 text-[#5b3419] font-semibold">
              Qualifications
            </p>

            <p className="text-[16px] leading-7 text-[#4a3728] mb-5">
              {member.qualification}
            </p>

            <p className="mb-2 font-semibold text-[#5b3419]">
              Expertise
            </p>

            <p className="text-[16px] leading-7 text-[#4a3728]">
              {member.expertise}
            </p>

          </div>
        ))}

      </div>

    </div>

    {/* Legal Advisory Panel */}
    <div className="mb-20">

      <h3 className="text-3xl font-bold mb-8">
        Legal Advisory Panel
      </h3>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-2xl font-bold mb-3">
            Adv. Anant Chattha
          </h3>

          <p className="text-[#5b3419] font-semibold mb-3">
            High Court of Delhi
          </p>

          <p className="text-[16px] leading-7 text-[#4a3728]">
            B.A LL.B (Hons) • Legal Affairs, Community Outreach & Fact Analysis
          </p>

        </div>
                <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-2xl font-bold mb-3">
            Sneha Shokeen
          </h3>

          <p className="text-[#5b3419] font-semibold mb-3">
            B.B.A. LL.B.
          </p>

          <p className="text-[16px] leading-7 text-[#4a3728]">
            Property Rights, Valuation & Ground Realities
          </p>

        </div>
        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-2xl font-bold mb-3">
            Mr. Vikas K. Farshwal
          </h3>

          <p className="text-[#5b3419] font-semibold mb-3">
            B.A. LL.B
          </p>

          <p className="text-[16px] leading-7 text-[#4a3728]">
            Legal Affairs, Community Outreach & Fact Analysis
          </p>

        </div>

      </div>

    </div>

    {/* Community Outreach */}
    <div>

      <h3 className="text-3xl font-bold mb-8">
        Community & Field Outreach
      </h3>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-2xl font-bold mb-3">
            Dr. Paras Narwal
          </h3>

          <p className="text-[#5b3419] font-semibold mb-3">
            B.H.M.S.
          </p>

          <p className="text-[16px] leading-7 text-[#4a3728]">
            Community Outreach
          </p>

        </div>

        <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

          <h3 className="text-2xl font-bold mb-3">
            Mr. Chowdary Sathyam Patel
          </h3>

          <p className="text-[#5b3419] font-semibold mb-3">
            BTech Agricultural Engineering, MBA International Transportation & Logistics Management
          </p>

          <p className="text-[16px] leading-7 text-[#4a3728]">
            Social Researcher, Community Representative & Genetic Study
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

    </div>
  );
}
