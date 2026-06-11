import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl text-primary brand-glow">CINE</span>
              <span className="font-display text-3xl">TV</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Discover movies and TV shows. Trailers, ratings, reviews — all in one cinematic place.
            </p>
          </div>
          <FooterCol title="Browse" links={[
            ["Home", "/"], ["Movies", "/movies"], ["TV Shows", "/tv"],
            ["Anime", "/anime"], ["Search", "/search"], ["My Account", "/account"],
          ]} />
          <FooterCol title="Company" links={[
            ["About Us", "/about"], ["Contact Us", "/contact"],
            ["Reviews", "/reviews"], ["Careers", "/careers"],
            ["Help Center", "/help"], ["FAQ", "/faq"],
          ]} />
          <FooterCol title="Legal" links={[
            ["Terms of Use", "/terms"], ["Privacy Policy", "/privacy"],
            ["Cookie Policy", "/cookies"], ["Rules & Regulations", "/rules"],
            ["Disclaimer", "/disclaimer"], ["DMCA", "/dmca"],
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} CINE TV. All rights reserved.</p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link to={href} className="text-muted-foreground transition hover:text-primary">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
