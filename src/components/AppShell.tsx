"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps {children} in the app's column layout — skipped entirely on /studio,
 * which renders Sanity Studio's own full-viewport chrome and shares this root
 * layout (Next.js only allows one layout to own <html>/<body>, so /studio can't
 * opt out of the root layout on its own).
 *
 * The redesigned header is `sticky` rather than `fixed`, so it occupies layout
 * space itself and no top padding is reserved here anymore.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return <>{children}</>;

  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
