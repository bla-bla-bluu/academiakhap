import { Link } from "react-router-dom";

type NavLink = {
  to: string;
  label: string;
  active?: boolean;
};

type NavbarProps = {
  links: NavLink[];
};

export default function Navbar({ links }: NavbarProps) {
  return (
    <nav className="w-full bg-[#efe4cf] border-b border-[#8b6a43]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo_clean.png" alt="Academia Khap Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <p className="text-xl sm:text-2xl font-bold tracking-wide">Academia Khap</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                link.active
                  ? "px-4 sm:px-5 py-2 rounded-full bg-[#5b3419] text-white text-sm sm:text-base"
                  : "px-4 sm:px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300 text-sm sm:text-base"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
