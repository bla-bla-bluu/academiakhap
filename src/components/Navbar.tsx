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
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo_clean.png" alt="Academia Khap Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-bold tracking-wide">Academia Khap</h1>
        </div>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                link.active
                  ? "px-5 py-2 rounded-full bg-[#5b3419] text-white"
                  : "px-5 py-2 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300"
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
