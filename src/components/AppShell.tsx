"use client";

import { usePathname } from "next/navigation";

/**
 * Reserves clearance for the fixed header around {children} — skipped entirely on
 * /studio, which renders Sanity Studio's own full-viewport chrome and shares this root
 * layout (Next.js only allows one layout to own <html>/<body>, so /studio can't opt
 * out of the root layout on its own).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return <>{children}</>;

  return <div className="flex min-h-full flex-1 flex-col pt-14 lg:pt-16">{children}</div>;
}
