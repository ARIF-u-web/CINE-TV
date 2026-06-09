import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Settings, Film, Tv, Home, Menu, X } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-3xl tracking-wider text-primary brand-glow">CINE</span>
          <span className="font-display text-3xl tracking-wider text-foreground">TV</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" icon={<Home className="size-4" />}>Home</NavLink>
          <NavLink to="/movies" icon={<Film className="size-4" />}>Movies</NavLink>
          <NavLink to="/tv" icon={<Tv className="size-4" />}>TV Shows</NavLink>
        </nav>

        <form onSubmit={submit} className="ml-auto hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, shows..."
              className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto md:ml-0 inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 transition hover:border-primary hover:text-primary">
            <Settings className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/about">About Us</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/contact">Contact Us</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/reviews">Reviews</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/terms">Terms of Use</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/privacy">Privacy Policy</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/rules">Rules & Regulations</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/dmca">DMCA</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            <NavLink to="/" icon={<Home className="size-4" />} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/movies" icon={<Film className="size-4" />} onClick={() => setOpen(false)}>Movies</NavLink>
            <NavLink to="/tv" icon={<Tv className="size-4" />} onClick={() => setOpen(false)}>TV Shows</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, icon, children, onClick }: { to: string; icon?: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={{ exact: to === "/" }}
      activeProps={{ className: "text-primary bg-secondary/80" }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
