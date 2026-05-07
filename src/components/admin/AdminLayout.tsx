import { ReactNode, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, Calendar, PartyPopper,
  Star, Image as ImageIcon, Phone, Settings, LogOut, Menu as MenuIcon, X,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  { to: "/admin/reservations", label: "Reservations", icon: Calendar },
  { to: "/admin/events", label: "Events", icon: PartyPopper },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/images", label: "Images", icon: ImageIcon },
  { to: "/admin/contact", label: "Contact Info", icon: Phone },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { loading, session, isAdmin } = useAdminAuth();
  const loc = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#111] text-foreground">Loading…</div>;
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
};

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();
  const [open, setOpen] = useState(false);

  const Sidebar = (
    <aside className="w-[260px] shrink-0 bg-[#0A0A0A] border-r border-white/[0.08] border-t-[3px] border-t-primary flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5">
        <Link to="/admin" className="block">
          <div className="font-body text-lg font-black uppercase text-primary tracking-[0.1em]">LE SAFOUTIER</div>
          <div className="text-xs text-muted-foreground mt-0.5">Admin Panel</div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-300",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/65 hover:text-primary hover:bg-white/[0.03]",
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-3">
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        <button
          onClick={signOut}
          className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-md bg-[#E05C5C]/15 text-[#E05C5C] hover:bg-[#E05C5C] hover:text-white text-xs font-bold uppercase tracking-wider transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-[#111111] text-foreground">
      <div className="hidden lg:block">{Sidebar}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-[#0A0A0A] border-b border-white/5 p-4 flex items-center justify-between">
          <Link to="/admin" className="font-body text-sm font-black uppercase text-primary">LE SAFOUTIER</Link>
          <button onClick={() => setOpen(true)} className="text-foreground p-2"><MenuIcon className="w-5 h-5" /></button>
        </header>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
