import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import WorkWithUsPage from "./pages/Work";
import ResearchPage from "./pages/Research";
import ContactPage from "./pages/Contact";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsOfServicePage from "./pages/TermsOfService";
import ClubPage from "./pages/Club";
import SEO from "./components/SEO";
import ScrollToTop from "./components/ScrollToTop";
import LanguageSwitcher from "./components/LanguageSwitcher";

// Lazy-loaded: Community and Heritage Network both pull in the Firebase SDK, which would
// otherwise be downloaded by every visitor even if they never use either feature.
const CommunityPage = lazy(() => import("./pages/Community"));
const HeritageNetworkPage = lazy(() => import("./pages/HeritageNetwork"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SEO />
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<WorkWithUsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:slug" element={<ResearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/club" element={<ClubPage />} />
        <Route
          path="/community"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#f4efe4]" />}>
              <CommunityPage />
            </Suspense>
          }
        />
        <Route
          path="/heritage-network"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#f4efe4]" />}>
              <HeritageNetworkPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
