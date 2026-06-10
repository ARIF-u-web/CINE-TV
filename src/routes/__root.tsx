import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieBanner } from "@/components/cine/CookieBanner";
import { initTheme } from "@/lib/theme";
import { auth } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary brand-glow">404</h1>
        <h2 className="mt-4 font-display text-2xl tracking-wide text-foreground">Scene not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has been cut from the final edit.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl tracking-wide text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing, or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border bg-secondary px-5 py-2 text-sm font-semibold hover:border-primary">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CINE TV — Movies & TV Shows" },
      { name: "description", content: "CINE TV — discover trending movies and TV shows, ratings, trailers, and reviews." },
      { name: "author", content: "CINE TV" },
      { property: "og:title", content: "CINE TV — Movies & TV Shows" },
      { property: "og:description", content: "CINE TV — discover trending movies and TV shows, ratings, trailers, and reviews." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CINE TV" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CINE TV — Movies & TV Shows" },
      { name: "twitter:description", content: "CINE TV — discover trending movies and TV shows, ratings, trailers, and reviews." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dbf23718-d396-43e3-8f1d-b9d0439b2ff6/id-preview-54c6e6a3--d247fd45-1d28-455b-b30b-aeef91b5c367.lovable.app-1781022746959.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dbf23718-d396-43e3-8f1d-b9d0439b2ff6/id-preview-54c6e6a3--d247fd45-1d28-455b-b30b-aeef91b5c367.lovable.app-1781022746959.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cinetv:theme')||'dark';var r=t==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t;var h=document.documentElement;h.classList.toggle('dark',r==='dark');h.classList.toggle('light',r==='light');h.style.colorScheme=r;}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { initTheme(); auth.init(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}
