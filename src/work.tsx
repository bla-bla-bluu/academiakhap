import { Link } from "react-router-dom";

export default function WorkWithUsPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      {/* Navbar */}
      <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <img
              src="/logo_clean.png"
              alt="Academia Khap Logo"
              className="w-12 h-12 object-contain"
            />

            <h1 className="text-2xl font-bold tracking-wide">
              Academia Khap
            </h1>

          </div>

          <div className="flex gap-4">

            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/work-with-us"
              className="px-5 py-2 rounded-full bg-[#5b3419] text-white"
            >
              Work With Us
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Collaborate With Academia Khap
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-10">
            Researchers, Scholars,
            Historians & Community Contributors
          </h1>

          <p className="max-w-5xl text-xl leading-10 text-[#4a3728]">
            Academia Khap works through collaborative research,
            historical documentation, policy discussion,
            digital awareness, cultural preservation,
            and intellectual engagement across communities.
          </p>

        </div>

      </section>

      {/* Work Areas */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="mb-16">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Areas of Contribution
          </p>

          <h2 className="text-5xl font-bold">
            Work Domains
          </h2>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {[
            {
              title: "Historical Research",
              desc: "Ancient inscriptions, regional history, tribal continuity, linguistic evolution, social systems, migration patterns, and archival analysis."
            },
            {
              title: "Social Analysis",
              desc: "Research on social structure, cultural continuity, rural systems, traditions, demographics, and community-oriented discourse."
            },
            {
              title: "Technology & AI",
              desc: "Artificial intelligence, digital infrastructure, media systems, cyber awareness, data analysis, and defence-oriented technologies."
            },
            {
              title: "Legal & Policy Studies",
              desc: "Policy interpretation, constitutional research, governance systems, legal awareness, and social legislation."
            },
            {
              title: "Media & Communication",
              desc: "Content creation, public communication, design systems, documentaries, podcasts, and awareness campaigns."
            },
            {
              title: "Community Documentation",
              desc: "Oral histories, village-level documentation, cultural records, genealogies, local narratives, and preservation work."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm"
            >

              <h3 className="text-3xl font-bold mb-5">
                {item.title}
              </h3>

              <p className="text-[17px] leading-9 text-[#4a3728]">
                {item.desc}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* Contributor Details */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Contributor Information
          </p>

          <h2 className="text-5xl font-bold mb-16">
            Who Can Work With Us
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Left */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-10">

              <h3 className="text-3xl font-bold mb-8">
                Academic & Professional Background
              </h3>

              <ul className="space-y-4 list-disc pl-6 text-[17px] leading-8 text-[#4a3728]">
                <li>Research Scholars</li>
                <li>PhD Candidates & Doctorate Holders</li>
                <li>Historians & Archaeology Researchers</li>
                <li>AI & Technology Experts</li>
                <li>Defence & Strategic Analysts</li>
                <li>Legal Professionals</li>
                <li>Media & Communication Specialists</li>
                <li>Writers & Documentation Experts</li>
                <li>Social Researchers & Policy Analysts</li>
              </ul>

            </div>

            {/* Right */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-10">

              <h3 className="text-3xl font-bold mb-8">
                Contributor Profile Information
              </h3>

              <ul className="space-y-4 list-disc pl-6 text-[17px] leading-8 text-[#4a3728]">
                <li>Educational Qualifications</li>
                <li>Area of Expertise</li>
                <li>Research Interests</li>
                <li>Professional Experience</li>
                <li>State & Regional Background</li>
                <li>Village / District Representation</li>
                <li>Community & Cultural Research Interest</li>
                <li>Social or Academic Contributions</li>
                <li>Digital / Technical Skillset</li>
              </ul>

            </div>

          </div>

        </div>

      </section>

      {/* Why Join */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="max-w-5xl">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Why Collaborate
          </p>

          <h2 className="text-5xl font-bold mb-10">
            Purpose & Long-Term Vision
          </h2>

          <div className="space-y-8 text-xl leading-10 text-[#4a3728]">

            <p>
              Academia Khap aims to create a long-term
              intellectual platform for documentation,
              research, historical discourse, policy analysis,
              and cultural understanding rooted in evidence-based work.
            </p>

            <p>
              The objective is not limited to online content,
              but extends toward building archives,
              publishing research-oriented material,
              preserving oral traditions,
              encouraging rational dialogue,
              and connecting scholars from diverse backgrounds.
            </p>

            <p>
              Contributors become part of a collaborative
              ecosystem involving researchers,
              professionals, educators,
              analysts, and socially aware individuals
              across India and abroad.
            </p>

          </div>

        </div>

      </section>

      {/* Application */}
      <section className="bg-[#5b3419] text-white py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[0.35em] text-sm text-[#e7d6be] mb-4">
            Join Academia Khap
          </p>

          <h2 className="text-5xl font-bold mb-10">
            Research • Culture • Documentation
          </h2>

          <p className="text-xl leading-10 text-[#f5ede0] mb-12">
            We welcome individuals committed to
            evidence-based thinking,
            intellectual contribution,
            social understanding,
            and long-term cultural documentation.
          </p>

          <button className="px-10 py-5 rounded-full bg-white text-[#5b3419] text-lg font-semibold hover:opacity-90 transition duration-300">
            Apply To Collaborate
          </button>

        </div>

      </section>

    </div>
  );
}