import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";

export default function WorkWithUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleApplySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Collaboration Application from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nArea of Interest / Message:\n${message}`
    );

    window.location.href = `mailto:academiakhap@gmail.com?subject=${subject}&body=${body}`;
  };

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
              to="/work"
              className="px-5 py-2 rounded-full bg-[#5b3419] text-white"
            >
              Work With Us
            </Link>

            <Link
              to="/community"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Chaupal
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 py-12 sm:py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Collaborate With Academia Khap
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-10">
            Researchers, Historians &
            Community Contributors
          </h1>

          <p className="max-w-5xl text-base sm:text-lg lg:text-xl leading-8 sm:leading-9 lg:leading-10 text-[#4a3728]">
            We research and document local community history, from the stone age to the
            present, through fieldwork, oral tradition, archival study, and cultural
            preservation.
          </p>

        </div>

      </section>

      {/* Work Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">

        <div className="mb-16">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Areas of Contribution
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Work Domains
          </h2>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {[
            {
              title: "Historical & Archaeological Research",
              desc: "Stone age settlements, ancient inscriptions, regional history, migration patterns, and archival analysis tracing community origins to the present day."
            },
            {
              title: "Culture, Tradition & Oral History",
              desc: "Village-level documentation, genealogies, oral histories, customs, and local narratives passed down through generations."
            },
            {
              title: "Media & Public Communication",
              desc: "Documentaries, podcasts, and public-facing content that bring this research to a wider audience."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-6 sm:p-8 shadow-sm"
            >

              <h3 className="text-2xl sm:text-3xl font-bold mb-5">
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
      <section className="bg-[#efe4cf] border-y border-[#8b6a43]/20 py-12 sm:py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Contributor Information
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 sm:mb-16">
            Who Can Work With Us
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Left */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-10">

              <h3 className="text-3xl font-bold mb-8">
                Academic & Professional Background
              </h3>

              <ul className="space-y-4 list-disc pl-6 text-[17px] leading-8 text-[#4a3728]">
                <li>Research Scholars & PhD Candidates</li>
                <li>Historians & Archaeologists</li>
                <li>Writers & Documentation Experts</li>
                <li>Media & Communication Specialists</li>
                <li>Social Researchers</li>
              </ul>

            </div>

            {/* Right */}
            <div className="bg-[#faf6ef] border border-[#b38b59]/30 rounded-[2rem] p-10">

              <h3 className="text-3xl font-bold mb-8">
                Contributor Profile Information
              </h3>

              <ul className="space-y-4 list-disc pl-6 text-[17px] leading-8 text-[#4a3728]">
                <li>Educational Qualifications</li>
                <li>Area of Expertise / Research Interests</li>
                <li>Village, District & Regional Background</li>
                <li>Community & Cultural Research Interest</li>
                <li>Past Academic or Documentation Work</li>
              </ul>

            </div>

          </div>

        </div>

      </section>

      {/* Why Join */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">

        <div className="max-w-5xl">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Why Collaborate
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10">
            Purpose & Long-Term Vision
          </h2>

          <p className="text-base sm:text-lg lg:text-xl leading-8 sm:leading-9 lg:leading-10 text-[#4a3728]">
            Academia Khap is building a long-term archive of community history and culture,
            from the stone age to the present, through documentation, oral tradition, and
            evidence-based research. Contributors join a growing network of historians,
            researchers, and community voices working to preserve this history for future
            generations.
          </p>

        </div>

      </section>

      {/* Application */}
      <section className="bg-[#5b3419] text-white py-12 sm:py-24">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

          <p className="uppercase tracking-[0.35em] text-sm text-[#e7d6be] mb-4">
            Join Academia Khap
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10">
            From Stone Age to Present
          </h2>

          <p className="text-base sm:text-lg lg:text-xl leading-8 sm:leading-9 lg:leading-10 text-[#f5ede0] mb-12">
            We welcome anyone committed to documenting and preserving local community
            history, tradition, and culture.
          </p>

          <form onSubmit={handleApplySubmit} className="max-w-xl mx-auto text-left space-y-5">

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Full Name"
            />

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Email Address"
            />

            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Area of Interest / Message"
            />

            <button
              type="submit"
              className="w-full px-10 py-5 rounded-full bg-white text-[#5b3419] text-lg font-semibold hover:opacity-90 transition duration-300"
            >
              Apply To Collaborate
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}
