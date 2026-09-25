import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BENEFITS = [
  "Verified member profile",
  "Member directory access",
  "Professional networking",
  "Research network participation",
  "Heritage projects",
  "Podcasts",
  "Seminars, conferences and workshops",
  "Educational resources",
  "Research opportunities",
  "Community events",
  "Member-only programmes",
  "Recognition and certificates",
  "Eligible research assistance",
  "Collaboration opportunities",
];

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar />

      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">Academia Khap</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">Academia Khap Club</h1>
          <p className="text-[#4a3728] max-w-2xl">
            Additional benefits for active annual members, alongside the free public research archive and heritage
            network. Membership and networking support Academia Khap's core mission -- research, history, heritage,
            education, documentation, community -- rather than replacing it.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className={cardClass}>
          <h2 className="text-2xl font-bold mb-4">Benefits</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2">
                <span className="text-[#2f6b3a] mt-1">•</span>
                <span className="text-[#4a3728]">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-2xl font-bold mb-3">How membership works</h2>
          <p className="text-[#4a3728] mb-3">
            Club benefits are available to members whose annual membership is Active. There's no separate
            payment tier on top of ordinary membership -- Academia Khap is an educational and charitable
            institution first, and access to its core research and heritage work stays free to the public
            regardless of membership status.
          </p>
          <p className="text-[#4a3728]">
            Already a member? Check your status and renewal date from your profile in Chaupal. New here? You
            can register from the same page -- new accounts are reviewed by an admin before they're activated.
          </p>
        </div>

        <div className={`${cardClass} text-center`}>
          <h2 className="text-xl font-bold mb-2">Join or check your membership</h2>
          <a href="/community" className="inline-block px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition">
            Go to Chaupal
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
