import { Link } from "react-router-dom";

export default function ContactPage() {
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

          <div className="flex gap-4 flex-wrap">

            <Link
              to="/"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              About Us
            </Link>

            <Link
              to="/work"
              className="px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
            >
              Work With Us
            </Link>

            <Link
              to="/contact"
              className="px-5 py-2 rounded-full bg-[#5b3419] text-white"
            >
              Contact
            </Link>

          </div>

        </div>

      </nav>

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
                General Email
              </h3>

              <p>
                academiakhap@gmail.com
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#5b3419] text-xl mb-2">
                Research & Publications
              </h3>

              <p>
                research@academiakhap.org
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#5b3419] text-xl mb-2">
                Collaborations
              </h3>

              <p>
                partnerships@academiakhap.org
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#5b3419] text-xl mb-2">
                Social Media
              </h3>

              <p>Instagram: @academiakhap</p>
              <p>LinkedIn: Academia Khap</p>
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
            Send a Message
          </h2>

          <div className="space-y-6">

            <input
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Full Name"
            />

            <input
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Email Address"
            />

            <input
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Subject"
            />

            <textarea
              rows={6}
              className="w-full rounded-2xl bg-white text-[#3b2415] px-5 py-4 outline-none"
              placeholder="Write your message..."
            />

            <button className="w-full py-4 rounded-2xl bg-white text-[#5b3419] font-bold hover:bg-[#efe4cf] transition duration-300">
              Submit Message
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}