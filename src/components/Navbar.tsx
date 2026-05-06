import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact Us" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled || open ? "bg-surface2/95 backdrop-blur-md border-b border-foreground/10" : "bg-transparent",
      )}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="font-body text-base md:text-lg font-bold uppercase tracking-[0.15em] text-foreground">
          LE SAFOUTIER
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-foreground/85 hover:text-primary",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="default">
            <Link to="/reservations">Book Online</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-20 bg-surface2 animate-fade-in">
          <nav className="container-x py-10 flex flex-col gap-7">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn("text-2xl font-bold uppercase tracking-wide", isActive ? "text-primary" : "text-foreground")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild size="lg" className="mt-4 w-full">
              <Link to="/reservations">Book Online</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
