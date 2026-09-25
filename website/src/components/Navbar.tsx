import { Link, useLocation } from "react-router-dom";
import LanguagePills from "./LanguagePills";

// The single canonical nav -- every page renders exactly this list. Previously each page
// hand-copied its own array (plus which entry was "active"), and they drifted: some pages
// picked up new sections late, Privacy/Terms grew two extra entries nobody else had. Owning
// the list here and deriving "active" from the real URL below makes that drift impossible.
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/work", label: "Work With Us" },
  { to: "/research", label: "Archive" },
  { to: "/heritage-network", label: "Heritage Network" },
  { to: "/community", label: "Chaupal" },
  { to: "/club", label: "Club" },
];

function isActive(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  if (to === "/research") return pathname.startsWith("/research");
  return pathname === to;
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo_clean.png"
            alt="Academia Khap Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
          />
          <p className="text-xl sm:text-2xl font-bold tracking-wide truncate notranslate">Academia Khap</p>
        </div>

        <div className="-mx-4 sm:mx-0 overflow-x-auto pb-1 sm:pb-0">
          {/* No justify-end here: when this row is wider than the space next to the logo (it
              now regularly is, with 7 links plus the language pills), flexbox end-aligning an
              overflowing row pushes its start -- Home -- off to the left of the scrollable area,
              unreachable by scrolling back. Left-aligned overflow always keeps Home visible
              first, pushing any overflow off the right instead, which scrolling can reach. */}
          <div className="flex w-max sm:w-auto flex-nowrap gap-2 sm:gap-3 px-4 sm:px-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive(pathname, link.to)
                    ? "whitespace-nowrap px-3.5 sm:px-5 py-2 rounded-full bg-[#5b3419] text-white text-sm sm:text-base leading-none"
                    : "whitespace-nowrap px-3.5 sm:px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300 text-sm sm:text-base leading-none"
                }
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="w-px self-stretch bg-[#8b6a43]/25 mx-0.5" />
            <LanguagePills />
          </div>
        </div>
      </div>
    </nav>
  );
}
