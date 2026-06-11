import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Settings, Film, Tv, Home, Menu, X, User, LogIn, LogOut, UserPlus, Shield, Sparkles, Heart } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/cine/ThemeToggle";
import { auth, type User as AuthUser } from "@/lib/auth";

export function Header() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<AuthUser | null>(null);

  useEffect(() => {
    auth.init();
    const refresh = () => setMe(auth.current());
    refresh();
    window.addEventListener("cinetv:auth", refresh);
    return () => window.removeEventListener("cinetv:auth", refresh);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  const signOut = () => { auth.signOut(); navigate({ to: "/" }); };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-3xl tracking-wider text-primary brand-glow">CINE</span>
          <span className="font-display text-3xl tracking-wider text-foreground">TV</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" icon={<Home className="size-4" />}>Home</NavLink>
          <NavLink to="/movies" icon={<Film className="size-4" />}>Movies</NavLink>
          <NavLink to="/tv" icon={<Tv className="size-4" />}>TV Shows</NavLink>
          <NavLink to="/anime" icon={<Sparkles className="size-4" />}>Anime</NavLink>
          <NavLink to="/account" icon={<Heart className="size-4" />}>My List</NavLink>
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

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle compact />

          {me ? (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Account menu" className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 transition hover:border-primary hover:text-primary">
                <User className="size-4" />
                <span className="hidden text-sm font-medium sm:inline">{me.name.split(" ")[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm">{me.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{me.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/account"><User className="mr-1 size-4" />My Account</Link></DropdownMenuItem>
                {me.role === "admin" && (
                  <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-1 size-4" />Admin Panel</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut}><LogOut className="mr-1 size-4" />Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth" className="hidden h-10 items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 text-sm font-medium transition hover:border-primary hover:text-primary sm:inline-flex">
                <LogIn className="size-4" />Sign In
              </Link>
              <Link to="/auth" className="hidden h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-flex">
                <UserPlus className="size-4" />Sign Up
              </Link>
              <Link to="/auth" aria-label="Sign in" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 sm:hidden">
                <LogIn className="size-4" />
              </Link>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Settings" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 transition hover:border-primary hover:text-primary">
              <Settings className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              {me ? (
                <>
                  <DropdownMenuItem asChild><Link to="/account">My Account</Link></DropdownMenuItem>
                  {me.role === "admin" && <DropdownMenuItem asChild><Link to="/admin">Admin Panel</Link></DropdownMenuItem>}
                  <DropdownMenuItem onSelect={signOut}>Sign Out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link to="/auth">Sign In</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/auth">Sign Up</Link></DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Company</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/about">About Us</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/contact">Contact Us</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/reviews">Reviews</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/careers">Careers</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Support</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/help">Help Center</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/faq">FAQ</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Legal</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/terms">Terms of Use</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/privacy">Privacy Policy</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/cookies">Cookie Policy</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/rules">Rules & Regulations</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/disclaimer">Disclaimer</Link></DropdownMenuItem>
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
            <NavLink to="/anime" icon={<Sparkles className="size-4" />} onClick={() => setOpen(false)}>Anime</NavLink>
            <NavLink to="/account" icon={<User className="size-4" />} onClick={() => setOpen(false)}>My List / Account</NavLink>
            {me?.role === "admin" && <NavLink to="/admin" icon={<Shield className="size-4" />} onClick={() => setOpen(false)}>Admin</NavLink>}
            {me ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                <LogOut className="size-4" />Sign Out
              </button>
            ) : (
              <NavLink to="/auth" icon={<LogIn className="size-4" />} onClick={() => setOpen(false)}>Sign In / Sign Up</NavLink>
            )}
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
