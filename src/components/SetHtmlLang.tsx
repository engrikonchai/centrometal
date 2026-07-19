"use client";

import { useEffect } from "react";

/**
 * Root layout sets a static <html lang="sr-ME"> (MNE is the default/primary
 * locale) since App Router only allows one root layout to own the <html>
 * tag. This corrects it for the /en subtree post-hydration.
 */
export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "sr-ME";
    };
  }, [lang]);

  return null;
}
