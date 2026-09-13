import { useEffect, useRef } from "react";

// Google's website-translate widget, mounted once at the app root (outside <Routes>,
// see App.tsx) so route navigation never unmounts it. Restricted to Hindi, Punjabi and
// Urdu per the site's audience -- not the full language list Google offers.
//
// This component is the engine only and renders nothing visible: its container is
// present in the DOM (Google needs a real mount point to initialise against) but kept
// off-screen, because the themed LanguagePills control in the Navbar is what users
// actually see and click, driving switches through the googtrans cookie in
// lib/googleTranslate.ts rather than through this widget's own hidden UI.
//
// Two things Google's widget does that need active handling, not just styling:
//
// 1. It rewrites text nodes in place (wrapping words in <font> tags) rather than
//    working through React. When React later tries to update or remove a node that
//    Google has relocated, the DOM no longer matches what React expects and the browser
//    throws "Failed to execute 'removeChild'/'insertBefore' on 'Node'", which crashes
//    the app on the next route change. This is a known conflict between Google
//    Translate and any framework that owns the DOM (React, Vue, etc.), not a bug in
//    this site -- the fix is the guarded patch below, applied once, which lets those
//    specific mismatched calls fail silently instead of throwing.
// 2. It injects a full-width iframe banner at the top of the page and pushes body
//    down with an inline "top" style. Suppressed in index.css instead of here, since
//    it targets classes Google adds to <html>/<body> after the fact.
declare global {
  interface Window {
    google?: { translate?: { TranslateElement: new (options: object, id: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

let domPatchApplied = false;

function patchDomForGoogleTranslate() {
  if (domPatchApplied || typeof Node !== "function" || !Node.prototype) return;
  domPatchApplied = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

const SCRIPT_ID = "google-translate-script";

export default function LanguageSwitcher() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    patchDomForGoogleTranslate();

    if (document.getElementById(SCRIPT_ID)) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate || !containerRef.current) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,pa,ur",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // sr-only rather than display:none: Google's script still needs to be able to
  // measure/initialise against a rendered element, and display:none has been reported
  // to make that initialisation unreliable in some widget versions.
  return <div ref={containerRef} id="google_translate_element" className="sr-only notranslate" />;
}
