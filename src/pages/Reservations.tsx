import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LeafDivider } from "@/components/SafouLeaf";
import { toast } from "@/hooks/use-toast";
import { Phone, MessageCircle } from "lucide-react";

const IMG = "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1400&q=80";

const Reservations = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast({
        title: "Reservation request received",
        description: "Our team will confirm your booking shortly. Merci!",
      });
    }, 700);
  };

  return (
    <>
      <section className="section-y">
        <div className="container-x text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Reservations</p>
          <h1 className="display-1 mb-6">A table awaits you.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Reserve your table at Le Safoutier — for a quiet breakfast, a working lunch,
            or an unforgettable dinner.
          </p>
          <LeafDivider className="mt-12" />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-x grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 reveal">
            <div className="aspect-[4/5] overflow-hidden rounded-xl">
              <img src={IMG} alt="Set table" className="w-full h-full object-cover" />
            </div>
            <div className="mt-8 p-6 bg-surface2 rounded-xl space-y-4">
              <p className="font-accent italic text-xl text-primary">Prefer to call?</p>
              <a href="tel:+237677011785" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" /> +237 677 011 785
              </a>
              <a href="tel:+237681137452" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" /> +237 681 137 452
              </a>
              <a href="https://wa.me/237681137452" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp +237 681 137 452
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-7 reveal bg-card border border-border/60 rounded-xl p-8 md:p-10 space-y-6">
            <h2 className="font-display text-3xl mb-2">Book a Table</h2>
            <p className="text-sm text-muted-foreground mb-6">All fields are required. We'll confirm your booking by phone or email.</p>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required placeholder="+237 ..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <Input id="guests" name="guests" type="number" min={1} max={20} defaultValue={2} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" required defaultValue="19:30" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Requests</Label>
              <Textarea id="notes" name="notes" rows={4} placeholder="Allergies, occasion, seating preference..." />
            </div>

            <Button type="submit" variant="terracotta" size="lg" disabled={submitting} className="w-full md:w-auto">
              {submitting ? "Sending..." : "Reserve My Table"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Reservations;
