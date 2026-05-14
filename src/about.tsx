import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      {/* Navbar */}
      <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-2xl font-bold tracking-wide">
            Academia Khap
          </h1>

          <div className="flex gap-4">

            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="px-5 py-2 rounded-full bg-[#5b3419] text-white"
            >
              About Us
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Leadership & Team
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-10">
            Directors & Core Team
          </h1>

          <p className="max-w-4xl text-xl leading-10 text-[#4a3728]">
            Academia Khap is driven by researchers,
            strategists, community leaders, and policy-oriented
            contributors working toward cultural continuity,
            evidence-based dialogue, and social understanding.
          </p>

        </div>

      </section>

      {/* Directors */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-3 gap-8">

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
                  <li>BA</li>
                  <li>MA Archaeology</li>
                  <li>Community Leadership</li>
                  <li>Operations Management</li>
                  <li>Public Outreach</li>
                </ul>

              </div>

            </div>

          </div>

          {/* Dhillon */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

            <div className="w-20 h-20 rounded-full bg-[#5b3419] text-white flex items-center justify-center text-2xl font-bold mb-6">
              D
            </div>

            <h3 className="text-3xl font-bold mb-2">
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
                  <li>BVoc</li>
                  <li>MSc Computer Science</li>
                  <li>MTech Defence Technology</li>
                  <li>PhD Artificial Intelligence</li>
                  <li>Academic Writing</li>
                  <li>Historical & Social Analysis</li>
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
                  <li>BA</li>
                  <li>MA History</li>
                  <li>Policy Communication</li>
                  <li>Public Relations</li>
                  <li>Community Coordination</li>
                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Supporting Members */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Supporting Members
          </p>

          <h2 className="text-5xl font-bold mb-14">
            Advisory & Research Support
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Ajay Kumar */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

              <h3 className="text-3xl font-bold mb-3">
                Mr. Ajay Kumar Vashist
              </h3>

              <p className="text-lg font-semibold text-[#5b3419] mb-6">
                Research & Technical Support
              </p>

              <ul className="space-y-2 list-disc pl-5 text-[17px] leading-8 text-[#4a3728]">
                <li>BTech</li>
                <li>MTech Defence Technology</li>
                <li>PhD Artificial Intelligence</li>
              </ul>

            </div>

            {/* Navtej */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

              <h3 className="text-3xl font-bold mb-3">
                Mr. Navtej Mangat
              </h3>

              <p className="text-lg font-semibold text-[#5b3419] mb-6">
                Senior Advisor
              </p>

              <p className="text-[17px] leading-8 text-[#4a3728]">
                UK Citizen • International Community Guidance & Advisory Support
              </p>

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