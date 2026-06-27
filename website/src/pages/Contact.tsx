import Navbar from "../components/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">

      <Navbar
        links={[
          { to: "/", label: "Home" },
          { to: "/about", label: "About Us" },
          { to: "/work", label: "Work With Us" },
          { to: "/contact", label: "Contact", active: true },
          { to: "/community", label: "Chaupal" },
        ]}
      />

      {/* Hero */}
      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-20 pb-10">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Contact Academia Khap
          </p>

          <h1 className="text-6xl font-bold mb-8">
            Get In Touch
          </h1>

          <p className="max-w-4xl mx-auto text-lg leading-9 text-[#4a3728]">
            For collaborations, research discussions, institutional partnerships,
            legal consultation, historical documentation, publications,
            media engagement, or community initiatives, contact the
            Academia Khap team.
          </p>

        </div>

      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10">

        {/* Left Panel */}
        <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-12 bg-[#faf6ef]">

          <h2 className="text-4xl font-bold mb-8">
            Contact Information
          </h2>

          <div className="space-y-8 text-[17px] leading-8 text-[#4a3728]">

            <div>
              <h3 className="font-bold text-[#5b3419] text-xl mb-2">
                Email
              </h3>

              <a
                href="mailto:academiakhap@gmail.com"
                className="underline underline-offset-4 hover:text-[#5b3419]"
              >
                academiakhap@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-bold text-[#5b3419] text-xl mb-2">
                Operational Region
              </h3>

              <p>
                India • Community Research Network
              </p>
            </div>

          </div>

        </div>

        {/* Right Panel */}
        <div className="rounded-[2.5rem] bg-[#5b3419] text-white p-12 shadow-2xl">

          <h2 className="text-4xl font-bold mb-8">
            Connect With Us
          </h2>

          <p className="text-[#f5ede0] text-[17px] leading-8 mb-8">
            Follow Academia Khap across our social channels for
            research updates, documentation, and community initiatives.
          </p>

          <div className="flex flex-col gap-4">

            <a
              href="https://www.youtube.com/@academiakhap"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-white font-semibold text-center hover:bg-white hover:text-[#5b3419] transition duration-300"
            >
              YouTube
            </a>

            <a
              href="https://www.instagram.com/khap.academia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-white font-semibold text-center hover:bg-white hover:text-[#5b3419] transition duration-300"
            >
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/in/khap-academia/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-white font-semibold text-center hover:bg-white hover:text-[#5b3419] transition duration-300"
            >
              LinkedIn
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}