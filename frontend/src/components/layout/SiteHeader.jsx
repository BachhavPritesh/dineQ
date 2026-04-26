import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, UtensilsCrossed, LogOut } from "lucide-react";
import { useRole, setStoredRole } from "@/lib/role";

const customerNav = [
  { to: "/queue", label: "My Queue" },
  { to: "/restaurants", label: "Top Restaurants" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

const ownerNav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/owner-history", label: "History" },
  { to: "/restaurants", label: "Discover" },
  { to: "/profile", label: "Profile" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const role = useRole();
  const navigate = useNavigate();
  const nav = role === "owner" ? ownerNav : customerNav;

  function signOut() {
    setStoredRole("customer");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center shadow-gold">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Dine<span className="text-gold">Q</span>
          </span>
          {role === "owner" && (
            <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-gold/40 text-gold">
              Owner
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={signOut}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium rounded-md gradient-gold text-primary-foreground hover:opacity-90 transition shadow-gold"
          >
            Switch role
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 px-4 py-3 space-y-1 bg-background">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex-1 text-center px-4 py-2 text-sm border border-border rounded-md"
            >
              Sign out
            </button>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-md gradient-gold text-primary-foreground"
            >
              Switch role
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
