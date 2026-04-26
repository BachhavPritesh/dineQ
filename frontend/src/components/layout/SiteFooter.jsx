import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">
              Queue<span className="text-gold">Table</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Real-time restaurant queues, virtual check-in, and pre-ordering. Built for diners who
            value their time.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/restaurants" className="hover:text-gold">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/queue" className="hover:text-gold">
                My Queue
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-gold">
                History
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/login" className="hover:text-gold">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gold">
                Sign up
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-gold">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} QueueTable. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted for hungry humans.</p>
        </div>
      </div>
    </footer>
  );
}
