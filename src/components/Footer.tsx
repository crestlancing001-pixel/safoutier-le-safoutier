import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, MapPin, Clock } from "lucide-react";
import { LeafDivider } from "./SafouLeaf";

export const Footer = () => (
  <footer className="bg-surface2 border-t border-border/60">
    <div className="container-x py-20">
      <LeafDivider className="mb-14" />
      <div className="grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl text-primary mb-3">Le Safoutier</h3>
          <p className="font-accent italic text-lg text-muted-foreground mb-6">
            A taste of Cameroon, an experience of the world.
          </p>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Inside Hilton Yaoundé, Boulevard du 20 Mai — where refined Cameroonian
            tradition meets international gastronomy.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-primary mb-5">Visit</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Hilton Yaoundé, Boulevard du 20 Mai, Yaoundé, Cameroon</li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" /> +237 677 011 785</li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" /> +237 681 137 452</li>
            <li className="flex gap-3"><Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Mon–Sun · 6:30 AM – 11:00 PM</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-primary mb-5">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-primary transition-colors">Reservations</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Le Safoutier Restaurant. All rights reserved.</p>
        <p>Inside Hilton Yaoundé · Cameroon</p>
      </div>
    </div>
  </footer>
);
