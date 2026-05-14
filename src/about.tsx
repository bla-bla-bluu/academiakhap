import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

/* ---------------- HOME PAGE ---------------- */

function HomePage() {
  const posts = [
    {
      title: "Inter-Caste Marriage, Gotra & Cultural Continuity",
      category: "Social Structure",
      excerpt:
        "Understanding compatibility, lineage traditions, adaptation, and long-term social continuity in Indian communities.",
    },
    {
      title: "Jat, Jatt, Jutt & Tribal Identity",
      category: "History & Identity",
      excerpt:
        "Exploring tribal continuity across religions, regions, and historical transitions.",
    },
    {
      title: "Social Media & Born Superior Narratives",
      category: "Social Analysis",
      excerpt:
        "A critical analysis of online superiority narratives, caste conflicts, and misinformation.",
    },
    {
      title: "Language, Transliteration & Historical Terms",
      category: "Linguistics",
      excerpt:
        "Research-oriented discussion on Jat, Jatt, Jutt, Zutt and historical transliteration systems.",
    },
  ];

  const members = [
    "Research Scholars",
    "Doctorate Holders",
    "Legal Professionals",
    "Historians & Writers",
    "Community Representatives",
    "Social Researchers",
  ];

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
              className="px-5 py-2 rounded-full bg-[#5b3419] text-white"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              About Us
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20">

        <img
          src="/header.png"
          alt="Academia Khap Header"
          className="w-full object-cover"
        />

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="max-w-4xl">

            <p className="uppercase tracking-[0.4em] text-sm text-[#8b6a43] mb-4">
              Research • History • Culture
            </p>

            <p className="text-2xl leading-[2.5rem] text-[#4b3526] mb-10">
              A collective platform focused on evidence-based research,
              cultural continuity, social understanding, historical discourse,
              and intellectual engagement across communities.
            </p>

            <div className="flex flex-wrap gap-5">

              <button className="px-8 py-4 rounded-full bg-[#5b3419] text-white font-semibold hover:opacity-90 transition">
                Explore Research
              </button>

              <Link
                to="/about"
                className="px-8 py-4 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold hover:bg-[#5b3419] hover:text-white transition"
              >
                About Us
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* About Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14">

        <div>
          <h2 className="text-4xl font-bold mb-8">
            About Academia Khap
          </h2>

          <div className="space-y-6 text-lg leading-9 text-[#4a3728]">

            <p>
              Academia Khap is an intellectual and research-oriented
              platform dedicated to history, society, culture,
              identity, and social continuity.
            </p>

            <p>
              Our work focuses on research-oriented publications,
              preserving cultural knowledge, social analysis,
              documentation, and evidence-based dialogue.
            </p>

          </div>

          <Link
            to="/about"
            className="inline-block mt-10 px-7 py-4 rounded-full bg-[#5b3419] text-white"
          >
            Read More
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-5">

          {[
            "Research Papers",
            "Historical Analysis",
            "Social Dialogue",
            "Digital Awareness",
            "Community Documentation",
            "Books & Articles",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-[#b38b59]/40 bg-[#faf6ef] p-6 shadow-sm"
            >
              <div className="text-2xl font-bold mb-3">•</div>
              <p className="text-lg leading-7">{item}</p>
            </div>
          ))}

        </div>

      </section>

      {/* Posts */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20">

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">

            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-3">
                Publications & Posts
              </p>

              <h2 className="text-5xl font-bold">
                Featured Research Topics
              </h2>
            </div>

            <button className="border border-[#5b3419] px-6 py-3 rounded-full hover:bg-[#5b3419] hover:text-white transition">
              View All Posts
            </button>

          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {posts.map((post) => (
              <div
                key={post.title}
                className="bg-[#f8f2e7] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition"
              >

                <div className="inline-block px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm mb-5">
                  {post.category}
                </div>

                <h3 className="text-3xl font-bold mb-4 leading-tight">
                  {post.title}
                </h3>

                <p className="text-lg leading-8 text-[#4a3728] mb-6">
                  {post.excerpt}
                </p>

                <button className="font-semibold underline underline-offset-4">
                  Read Article
                </button>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Members */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="mb-12">
          <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-3">
            Community & Team
          </p>

          <h2 className="text-5xl font-bold">
            Our Members
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {members.map((member) => (
            <div
              key={member}
              className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-2xl px-5 py-6 shadow-sm"
            >
              {member}
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

/* ---------------- ABOUT PAGE ---------------- */

function AboutPage() {
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
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition"
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

      {/* About Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            About Academia Khap
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-10">
            Research, Culture & Social Understanding
          </h1>

          <div className="max-w-5xl space-y-8 text-xl leading-10 text-[#4a3728]">

            <p>
              Academia Khap is an independent intellectual and
              research-oriented platform focused on history,
              culture, identity, social continuity, documentation,
              and evidence-based public discourse.
            </p>

            <p>
              The organization works through academic engagement,
              social analysis, digital awareness, and collaborative
              research projects to preserve cultural continuity and
              encourage rational, fact-based understanding of
              communities and social systems.
            </p>

          </div>

        </div>

      </section>

      {/* Directors */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="mb-14">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-3">
            Leadership
          </p>

          <h2 className="text-5xl font-bold">
            Directors & Core Team
          </h2>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Harsh */}
          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-8 shadow-sm">

            <div className="w-20 h-20 rounded-full bg-[#5b3419] text-white flex items-center justify-center text-2xl font-bold mb-6">
              H
            </div>

            <h3 className="text-3xl font-bold mb-2">
              Harsh
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Community & Operations Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Oversees operations, social coordination,
                outreach, and organizational management.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">
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
              Dhillon
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Strategic Research Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Leads research initiatives, publications,
                analytical studies, and documentation projects.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">
                  <li>Research Scholar</li>
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
              Tewatia
            </h3>

            <p className="text-lg font-semibold text-[#5b3419] mb-6">
              Policy & Communications Director
            </p>

            <div className="space-y-4 text-[17px] leading-8 text-[#4a3728]">

              <p>
                Handles policy communication, public messaging,
                institutional representation, and outreach strategy.
              </p>

              <div className="pt-4 border-t border-[#d8c2a0]">

                <p className="font-semibold mb-2">
                  Qualifications
                </p>

                <ul className="space-y-1 list-disc pl-5">
                  <li>Policy Communication</li>
                  <li>Public Relations</li>
                  <li>Community Coordination</li>
                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

/* ---------------- APP ROUTER ---------------- */

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />

      </Routes>

    </BrowserRouter>
  );
}