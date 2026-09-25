import { Link } from "react-router-dom";

export default function Footer() {
  return (
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
          <Link to="/terms-of-service" className="underline underline-offset-4 hover:text-[#5b3419]">
            Read Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
