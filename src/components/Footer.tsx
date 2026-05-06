import { Link } from "react-router-dom";
import { Facebook, Instagram, Award } from "lucide-react";

export const Footer = () => (
  <footer className="bg-surface2 border-t-[3px] border-primary">
    <div className="container-x py-16 md:py-20">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="font-body text-2xl font-bold uppercase tracking-[0.12em] text-primary mb-4">
            LE SAFOUTIER
          </h3>
          <p className="text-foreground text-sm leading-relaxed mb-6 max-w-xs">
            A taste of Cameroon, an experience of the world. Inside Hilton Yaoundé.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Award].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm text-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-primary transition-colors">Reservations</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Contact</h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li>Hilton Yaoundé, Boulevard du 20 Mai</li>
            <li>Yaoundé, Cameroon</li>
            <li><a href="tel:+237677011785" className="hover:text-primary">+237 677 011 785</a></li>
            <li><a href="tel:+237681137452" className="hover:text-primary">+237 681 137 452</a></li>
            <li className="text-muted-foreground">Mon–Sun · 6:30 AM – 11:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-6 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Le Safoutier Restaurant — Hilton Yaoundé</p>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-background border border-foreground/10 font-bold text-foreground/80">VISA</span>
          <span className="px-3 py-1 rounded bg-background border border-foreground/10 font-bold text-foreground/80">MasterCard</span>
        </div>
      </div>
    </div>
  </footer>
);
