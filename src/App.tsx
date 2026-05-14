import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AboutPage from "./about"; // ✅ import your real about page
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

  {/* Transparent Top Navbar */}
  <nav className="fixed top-1 left-1/2 -translate-x-1/2 w-[100%] z-50 bg-[#3b2415]/55 backdrop-blur-md border border-white/10 rounded-2xl">

    <div className="max-w-6xl mx-auto px-2 py-1.5 flex items-center justify-between">

      {/* Left Side */}
      <h1 className="text-[#f5ede0] text-2xl font-bold tracking-wide drop-shadow-lg">
        Academia Khap
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3">
     <Link
        to="/"
        className="px-3 py-1 rounded-full bg-[#5b3419]/50 backdrop-blur-md border border-[#d6b48a]/20 text-[#f5ede0] hover:bg-[#f5ede0] hover:text-[#3b2415] transition duration-300">
        Home
        </Link>

        <Link
          to="/about"
          className="px-3 py-1 rounded-full bg-[#5b3419]/50 backdrop-blur-md border border-[#d6b48a]/20 text-[#f5ede0] hover:bg-[#f5ede0] hover:text-[#3b2415] transition duration-300">
          About Us
        </Link>

        {/* Future Buttons Space */}
        <div className="flex gap-3">
          {/* Add future buttons here */}
        </div>

      </div>

    </div>

  </nav>
      {/* Hero Section */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-0">

        {/* Full Width Header Banner */}
        <div className="w-full">
          <img
            src="/header.png"
            alt="Academia Khap Header"
            className="w-full object-cover"
          />
        </div>

        {/* Hero Content */}
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

              <button className="px-8 py-4 rounded-full bg-[#5b3419] text-white font-semibold hover:opacity-90 transition duration-300">
                Explore Research
              </button>

              <button className="px-8 py-4 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold hover:bg-[#5b3419] hover:text-white transition duration-300">
                Work With Us
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14">
        <div>
          <h2 className="text-4xl font-bold mb-8">About Academia Khap</h2>

          <div className="space-y-6 text-lg leading-9 text-[#4a3728]">
            <p>
              Academia Khap is an intellectual and research-oriented platform
              dedicated to history, society, culture, identity, and social
              continuity.
            </p>

            <p>
              Our work focuses on publishing research-oriented content,
              encouraging critical discussion, preserving cultural knowledge,
              and documenting historical and social narratives through an
              evidence-based approach.
            </p>

            <p>
              We collaborate with scholars, students, writers, advocates,
              researchers, and community representatives across multiple
              disciplines.
            </p>
          </div>
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
              <h2 className="text-5xl font-bold">Featured Research Topics</h2>
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
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-3">
            Community & Team
          </p>

          <h2 className="text-5xl font-bold mb-8">Our Members</h2>

          <p className="text-lg leading-9 text-[#4a3728] mb-10">
            Academia Khap is built through collaboration between researchers,
            scholars, legal experts, educators, historians, and socially aware
            contributors dedicated to knowledge-based engagement.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member}
                className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-2xl px-5 py-4"
              >
                {member}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#5b3419] text-white p-12 shadow-2xl">
          <h3 className="text-4xl font-bold mb-8">Work With Us</h3>

          <div className="space-y-5 text-lg leading-8 text-[#f5ede0]">
            <p>
              We welcome collaborations in research, digital publishing,
              historical documentation, translation, design, and social
              awareness projects.
            </p>

            <p>
              Contributors may include:
            </p>

            <ul className="space-y-2 list-disc pl-6">
              <li>Writers & Editors</li>
              <li>Researchers & Historians</li>
              <li>Social Analysts</li>
              <li>Designers & Media Contributors</li>
              <li>Students & Scholars</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Donation */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-8">Donations & Contributions</h2>

            <p className="text-lg leading-9 text-[#4a3728] mb-6">
              Contributions help support independent research, publication of
              articles and books, archival work, digital awareness campaigns,
              and educational initiatives.
            </p>

            <p className="text-lg leading-9 text-[#4a3728]">
              All contributions are directed toward research-oriented and
              community awareness activities.
            </p>
          </div>

          <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-10 shadow-sm">
            <div className="space-y-6">
              <input
                className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
                placeholder="Full Name"
              />

              <input
                className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
                placeholder="Email Address"
              />

              <textarea
                rows={5}
                className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
                placeholder="Contribution Message"
              />

              <button className="w-full py-4 rounded-2xl bg-[#5b3419] text-white font-semibold hover:opacity-90 transition">
                Submit Contribution
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-[2.5rem] bg-[#5b3419] text-white p-14 text-center shadow-2xl">
          <p className="uppercase tracking-[0.35em] text-sm text-[#e7d6be] mb-4">
            Get Connected
          </p>

          <h2 className="text-5xl font-bold mb-8">Join Academia Khap</h2>

          <p className="max-w-3xl mx-auto text-lg leading-9 text-[#f5ede0] mb-10">
            Connect with us for research collaborations, social projects,
            publications, historical discussions, awareness campaigns, and
            community-oriented initiatives.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <button className="px-8 py-4 rounded-full bg-white text-[#5b3419] font-semibold">
              Instagram
            </button>

            <button className="px-8 py-4 rounded-full border border-white font-semibold">
              LinkedIn
            </button>

            <button className="px-8 py-4 rounded-full border border-white font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

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