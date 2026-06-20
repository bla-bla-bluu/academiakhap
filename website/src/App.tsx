import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import WorkWithUsPage from "./pages/Work";
import ResearchPage from "./pages/Research";
import ContactPage from "./pages/Contact";
import SEO from "./components/SEO";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <BrowserRouter>
      <SEO />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<WorkWithUsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}
