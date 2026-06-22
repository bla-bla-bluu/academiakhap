import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function HomePage() {
  const posts = [
    {
      title: "History and Heritage of the Pilania Zamindars",
      category: "History",
      slug: "/research?article=pilania-zamindars",
      excerpt:
        "A historical and architectural study of Bahanpur Haveli and Unchagaon Fort, documenting the heritage of the Pilania zamindars of Bulandshahr and the contrasting trajectories of rural heritage preservation.",
    },
    {
      title: "The Royal Legacy of Kuchesar",
      category: "History",
      slug: "/research?article=kuchesar",
      excerpt:
        "A study of the Dalal family and Kuchesar Fort, examining Jat zamindari history, estate architecture, inheritance, and rural heritage preservation in Bulandshahr.",
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

  const [contribName, setContribName] = useState("");
  const [contribEmail, setContribEmail] = useState("");
  const [contribMessage, setContribMessage] = useState("");

  const handleContributionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Contribution Message from ${contribName}`);
    const body = encodeURIComponent(
      `Name: ${contribName}\nEmail: ${contribEmail}\n\nMessage:\n${contribMessage}`
    );

    window.location.href = `mailto:academiakhap@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
   <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      <Navbar
        links={[
          { to: "/", label: "Home", active: true },
          { to: "/about", label: "About Us" },
          { to: "/work", label: "Work With Us" },
          { to: "/research", label: "Research" },
          { to: "/community", label: "Community" },
          { to: "/contact", label: "Contact" },
        ]}
      />

      {/* Hero Section */}
      <section className="border-b border-[#8b6a43]/20 pt-0">

        {/* Full Width Header Banner */}
        <div className="w-full">
          <img
            src="/header.png"
            alt="Academia Khap Header"
            className="w-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">

          <div className="max-w-6xl mx-auto">

            <p className="uppercase tracking-[0.4em] text-sm text-[#8b6a43] mb-6 text-center">
              Research • History • Culture
            </p>

<h1 className="text-lg sm:text-xl lg:text-2xl leading-8 sm:leading-10 text-[#4b3526] text-center max-w-5xl mx-auto font-normal">

  A collective platform focused on evidence-based research,

  cultural continuity, social understanding, historical discourse,

  and intellectual engagement across communities.

</h1>

<div className="h-8" />
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-between items-center text-center gap-6 overflow-x-auto">

            {[
              "Research Papers",
              "Historical Analysis",
              "Social Dialogue",
              "Digital Awareness",
              "Community Documentation",
              "Books & Articles",
            ].map((item) => (
            <p
              key={item}
              className="text-base sm:text-lg font-bold text-black whitespace-nowrap"
            >
              {item}
            </p>
            ))}
          </div>
        </div>
      </section>


      {/* Posts */}
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-3">
                Publications & Posts
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Featured Research Topics</h2>
            </div>

            <Link
              to="/research"
              className="border border-[#5b3419] px-6 py-3 rounded-full hover:bg-[#5b3419] hover:text-white transition"
            >
              View All Posts
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post.title}
                className="bg-[#f8f2e7] border border-[#b38b59]/30 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-xl transition"
              >
                <div className="inline-block px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm mb-5">
                  {post.category}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                  {post.title}
                </h3>

                <p className="text-base sm:text-lg leading-7 sm:leading-8 text-[#4a3728] mb-6">
                  {post.excerpt}
                </p>

                <Link to={post.slug} className="font-semibold underline underline-offset-4">
                  Read Article
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Members */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

  {/* Community & Team Outside Ring */}
  <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-5">
    Community & Team
  </p>

  <div className="grid lg:grid-cols-3 gap-10 items-stretch">

    {/* Left Section */}
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-6 sm:p-12">

      <Link
        to="/about"
        className="inline-block text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 px-6 py-3 rounded-2xl border border-[#5b3419] bg-[#5b3419] text-white transition duration-300 hover:bg-[#f4efe4] hover:text-[#5b3419]"
      >
        Our Members
      </Link>

      <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728] mb-10">
        Academia Khap is built through collaboration between researchers,
        scholars, legal experts, educators, historians, and socially aware
        contributors dedicated to knowledge-based engagement.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">

        {members.map((member) => (
          <div
            key={member}
            className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-2xl px-5 py-4 transition duration-300 hover:bg-[#5b3419] hover:text-white"
          >
            {member}
          </div>
        ))}

      </div>

    </div>

 {/* Right Section */}
<div className="rounded-[2.5rem] bg-[#5b3419] text-white p-6 sm:p-12 shadow-2xl flex flex-col justify-start min-h-full">

  <Link
    to="/work"
    className="inline-block self-start mt-2 mb-8 px-6 sm:px-8 py-3 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full border border-white text-white hover:bg-white hover:text-[#5b3419] transition duration-300"
  >
    Work With Us
  </Link>

  <div className="space-y-5 text-lg leading-8 text-[#f5ede0]">

    <p>
      We welcome collaborations in research, digital publishing,
      historical documentation, translation, design, and social
      awareness projects.
    </p>

    <p className="font-semibold text-white">
      Contributors may include:
    </p>

    <ul className="space-y-3 list-disc pl-6 text-[#f5ede0]">

      <li>Writers & Editors</li>
      <li>Researchers & Historians</li>
      <li>Social Analysts</li>
      <li>Designers & Media Contributors</li>
      <li>Students & Scholars</li>
      <li>Legal Professionals</li>
      <li>Policy & Strategic Analysts</li>

    </ul>

  </div>

</div>

    {/* Discussion Community Section */}
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-6 sm:p-12">

      <Link
        to="/community"
        className="inline-block text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 px-6 py-3 rounded-2xl border border-[#5b3419] bg-[#5b3419] text-white transition duration-300 hover:bg-[#f4efe4] hover:text-[#5b3419]"
      >
        Discussion Community
      </Link>

      <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728] mb-10">
        Academia Khap members post updates and discuss research, events, and
        community matters in a focused, text-only space -- no images or GIFs,
        just real conversation.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">

        {["Post Updates", "Comment & Discuss", "Share Instantly"].map((feature) => (
          <div
            key={feature}
            className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-2xl px-5 py-4 transition duration-300 hover:bg-[#5b3419] hover:text-white"
          >
            {feature}
          </div>
        ))}

      </div>

    </div>

  </div>

</section>

     {/* Donation */}
<section className="bg-[#efe4cf] border-y border-[#8b6a43]/20">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 sm:gap-14 items-start">

    {/* Left Content */}
    <div>

      <p className="uppercase tracking-[0.3em] text-sm text-[#8b6a43] mb-3">
        Support Our Work
      </p>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
        Donations & Contributions
      </h2>

      <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728] mb-6">
        Contributions help support independent research,
        publication of articles and books, archival work,
        digital awareness campaigns, educational initiatives,
        and preservation of historical and cultural knowledge.
      </p>

      <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728] mb-6">
        Academia Khap functions through collaborative
        participation and community support. Every contribution
        directly supports research-oriented, educational,
        and awareness-driven activities.
      </p>

      <div className="bg-[#faf6ef] border border-[#b38b59]/20 rounded-[2rem] p-8 mt-10">

        <h3 className="text-2xl font-bold mb-5">
          What Your Contribution Supports
        </h3>

        <ul className="space-y-3 text-[#4a3728] text-lg list-disc pl-5">
          <li>Research & Publications</li>
          <li>Historical Documentation</li>
          <li>Digital Awareness Campaigns</li>
          <li>Books, Articles & Archives</li>
          <li>Community Education Initiatives</li>
        </ul>

      </div>

    </div>

    {/* Right Donation Panel */}
    <div className="bg-[#faf6ef] border border-[#b38b59]/25 rounded-[2.5rem] p-10 shadow-sm">

      {/* QR + Bank Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">

        {/* QR Section */}
        <div>

          <h3 className="text-2xl font-bold mb-4">
            UPI / QR Payment
          </h3>

          <div className="rounded-[2rem] border border-dashed border-[#b38b59]/40 bg-[#f8f4ed] p-6 flex items-center justify-center min-h-[260px]">

            {/* Replace with your QR */}
            <img
              src="/upi_qr.png"
              alt="UPI QR"
              className="max-h-[220px] object-contain"
            />

          </div>

          <p className="text-sm text-[#6b5746] mt-3 text-center">
            Scan to contribute through UPI
          </p>

        </div>

        {/* Bank Details */}
        <div>

          <h3 className="text-2xl font-bold mb-4">
            Bank Details
          </h3>

          <div className="space-y-4 text-[#4a3728] text-[17px] leading-8">

            <p>
              <span className="font-bold">Account Name:</span><br />
              Academia Khap
            </p>

            <p>
              <span className="font-bold">Bank Name:</span><br />
              [Your Bank Name]
            </p>

            <p>
              <span className="font-bold">Account Number:</span><br />
              XXXXXXXXXXXX
            </p>

            <p>
              <span className="font-bold">IFSC Code:</span><br />
              XXXXXXXX
            </p>

            <p>
              <span className="font-bold">UPI ID:</span><br />
              yourupi@bank
            </p>

          </div>

        </div>

      </div>

      {/* Contribution Form */}
      <div>

        <h3 className="text-2xl font-bold mb-5">
          Contribution Message
        </h3>

        <form onSubmit={handleContributionSubmit} className="space-y-6">

          <input
            required
            value={contribName}
            onChange={(e) => setContribName(e.target.value)}
            className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
            placeholder="Full Name"
          />

          <input
            required
            type="email"
            value={contribEmail}
            onChange={(e) => setContribEmail(e.target.value)}
            className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
            placeholder="Email Address"
          />

          <textarea
            required
            rows={4}
            value={contribMessage}
            onChange={(e) => setContribMessage(e.target.value)}
            className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none"
            placeholder="Contribution Message"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition duration-300"
          >
            Submit Contribution
          </button>

        </form>

      </div>

    </div>

  </div>

</section>
      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="rounded-[2.5rem] bg-[#5b3419] text-white p-14 text-center shadow-2xl">
          <p className="uppercase tracking-[0.35em] text-sm text-[#e7d6be] mb-4">
            Get Connected
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">Join Academia Khap</h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg leading-8 sm:leading-9 text-[#f5ede0] mb-10">
            Connect with us for research collaborations, social projects,
            publications, historical discussions, awareness campaigns, and
            community-oriented initiatives.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
          <a
            href="https://www.youtube.com/@academiakhap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-8 py-4 rounded-full border border-white font-semibold hover:bg-white hover:text-[#5b3419] transition duration-300">
              Youtube
            </button>
          </a>
          <a
            href="https://www.instagram.com/khap.academia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-8 py-4 rounded-full border border-white font-semibold hover:bg-white hover:text-[#5b3419] transition duration-300">
              Instagram
            </button>
          </a>

          <a
            href="https://www.linkedin.com/in/khap-academia/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-8 py-4 rounded-full border border-white font-semibold hover:bg-white hover:text-[#5b3419] transition duration-300">
              LinkedIn
            </button>
          </a>

          <Link
          to="/contact"
          className="px-8 py-4 rounded-full border border-white font-semibold hover:bg-white hover:text-[#5b3419] transition duration-300">
          Contact Us
        </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#8b6a43]/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-[#6b5746] leading-7">
          <p>&copy; {new Date().getFullYear()} Academia Khap. All Rights Reserved.</p>
          <p className="mt-2 max-w-3xl mx-auto">
            The Academia Khap name, logo, and ideology, together with all associated
            intellectual property, are the property of Academia Khap. The founding members of
            Academia Khap hold all rights to claim copyright on behalf of Academia Khap. No part
            of this website's content, branding, or materials may be reproduced, copied,
            distributed, or used in any form without prior written permission.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-[#5b3419]">
              Read Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
