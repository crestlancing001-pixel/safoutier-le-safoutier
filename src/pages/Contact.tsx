import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, MessageCircle, Clock, MapPin, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HERO =
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=2000&q=80";

const MAPS_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=Hilton+Yaounde%2C+Boulevard+du+20+Mai%2C+Yaounde%2C+Cameroon";
const TRIPADVISOR =
  "https://www.tripadvisor.com/Restaurant_Review-g293824-Le_Safoutier-Yaounde.html";

const SUBJECTS = [
  "General Inquiry",
  "Group Booking",
  "Press & Media",
  "Feedback",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(5, "Please write a message").max(2000),
});

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: string, value: unknown) => {
    const partial = { name: "", email: "", subject: "", message: "", [field]: value };
    const result = schema.safeParse(partial);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === field);
        if (issue) next[field] = issue.message;
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject,
      message: fd.get("message"),
    });
    if (!result.success) {
      const flat: Record<string, string> = {};
      result.error.issues.forEach((i) => (flat[i.path[0] as string] = i.message));
      setErrors(flat);
      const firstKey = result.error.issues[0]?.path[0] as string | undefined;
      if (firstKey) {
        const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
      }
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Message received. We will reply within 24 hours.");
      form.reset();
      setSubject("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errClass = "text-accent text-xs mt-1.5 font-accent italic";

  return (
    <>
      {/* HERO */}
      <section className="relative h-[40vh] min-h-[300px] -mt-20 w-full overflow-hidden flex items-center justify-center">
        <img src={HERO} alt="Hilton Yaoundé entrance" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/[0.6]" />
        <div className="relative z-10 text-center container-x pt-20">
          <h1 className="font-display text-cream text-5xl md:text-7xl">Get in Touch</h1>
          <p className="font-accent italic text-primary text-xl md:text-2xl mt-4">
            We are here to make your visit extraordinary
          </p>
        </div>
      </section>

      {/* SECTION 1 — CONTACT CARDS */}
      <section className="bg-background py-20 md:py-24">
        <div className="container-x grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Phone */}
          <article className="bg-card border border-primary/30 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 rounded-full bg-primary/15 items-center justify-center mb-5">
              <Phone className="w-5 h-5 text-primary" />
            </span>
            <h3 className="font-display text-2xl text-cream mb-3">Call Us</h3>
            <div className="space-y-1 text-muted-foreground">
              <p><a href="tel:+237650002929" className="hover:text-primary">+237 650 002 929</a></p>
              <p><a href="tel:+237222233646" className="hover:text-primary">+237 222 233 646</a></p>
            </div>
          </article>

          {/* WhatsApp */}
          <article className="bg-card border border-primary/30 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 rounded-full bg-primary/15 items-center justify-center mb-5">
              <MessageCircle className="w-5 h-5 text-primary" />
            </span>
            <h3 className="font-display text-2xl text-cream mb-3">Chat with Us</h3>
            <p className="text-muted-foreground mb-5">+237 681 137 452</p>
            <Button asChild variant="terracotta" size="sm">
              <a href="https://wa.me/237681137452" target="_blank" rel="noopener noreferrer">
                Open WhatsApp
              </a>
            </Button>
          </article>

          {/* Hours */}
          <article className="bg-card border border-primary/30 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 rounded-full bg-primary/15 items-center justify-center mb-5">
              <Clock className="w-5 h-5 text-primary" />
            </span>
            <h3 className="font-display text-2xl text-cream mb-3">Opening Hours</h3>
            <div className="space-y-1 text-muted-foreground">
              <p>Monday–Sunday: 6:30 AM – 11:00 PM</p>
              <p>Sunday Brunch: 12:00 PM – 4:00 PM</p>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 2 — FORM + MAP */}
      <section className="bg-cream text-cream-foreground py-20 md:py-28">
        <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT — FORM */}
          <div>
            <h2 className="font-display text-accent text-4xl md:text-5xl mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <Label htmlFor="name" className="mb-2 inline-block text-cream-foreground">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  maxLength={100}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onBlur={(e) => validateField("name", e.target.value)}
                  onChange={(e) => errors.name && validateField("name", e.target.value)}
                  className="bg-background/5 border-cream-foreground/20 focus-visible:ring-accent text-cream-foreground"
                />
                {errors.name && <p id="name-error" className={errClass}>{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 inline-block text-cream-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={255}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onBlur={(e) => validateField("email", e.target.value)}
                  onChange={(e) => errors.email && validateField("email", e.target.value)}
                  className="bg-background/5 border-cream-foreground/20 focus-visible:ring-accent text-cream-foreground"
                />
                {errors.email && <p id="email-error" className={errClass}>{errors.email}</p>}
              </div>
              <div>
                <Label className="mb-2 inline-block text-cream-foreground">Subject</Label>
                <Select
                  value={subject}
                  onValueChange={(v) => {
                    setSubject(v);
                    validateField("subject", v);
                  }}
                >
                  <SelectTrigger aria-invalid={!!errors.subject} className="bg-background/5 border-cream-foreground/20 focus:ring-accent text-cream-foreground">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.subject && <p className={errClass}>{errors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="mb-2 inline-block text-cream-foreground">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  maxLength={2000}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onBlur={(e) => validateField("message", e.target.value)}
                  onChange={(e) => errors.message && validateField("message", e.target.value)}
                  className="bg-background/5 border-cream-foreground/20 focus-visible:ring-accent text-cream-foreground"
                />
                {errors.message && <p id="message-error" className={errClass}>{errors.message}</p>}
              </div>
              <Button type="submit" variant="terracotta" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>

          {/* RIGHT — MAP */}
          <div>
            <h2 className="font-display text-accent text-4xl md:text-5xl mb-8">Find Us</h2>
            <div className="rounded-xl overflow-hidden border border-cream-foreground/15 shadow-sm" style={{ height: 400 }}>
              <iframe
                title="Hilton Yaoundé location"
                src="https://www.google.com/maps?q=Hilton+Yaounde,+Boulevard+du+20+Mai,+Yaounde,+Cameroon&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="mt-6 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
              <p className="text-cream-foreground/80">
                Hilton Yaoundé, Boulevard du 20 Mai,<br />Yaoundé, Cameroon
              </p>
            </div>
            <div className="mt-6">
              <Button asChild variant="terracotta">
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Get Directions</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TRIPADVISOR */}
      <section className="bg-background py-24 md:py-28">
        <div className="container-x text-center max-w-4xl mx-auto">
          <h2 className="font-display text-primary text-4xl md:text-5xl mb-12">
            We Are Proud to Be Recognized
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Star, label: "4.7★", sub: "Rating" },
              { icon: Users, label: "341", sub: "Reviews" },
              { icon: Award, label: "#3 of 148", sub: "Restaurants in Yaoundé" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={sub} className="bg-card border border-primary/30 rounded-xl p-8">
                <Icon className="w-7 h-7 text-primary mx-auto mb-4" />
                <p className="font-display text-4xl text-cream">{label}</p>
                <p className="text-sm uppercase tracking-widest text-muted-foreground mt-2">{sub}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mb-8">
            Travelers' Choice Award Winner · Read our reviews on TripAdvisor
          </p>
          <Button asChild variant="terracotta" size="lg">
            <a href={TRIPADVISOR} target="_blank" rel="noopener noreferrer">Read Our Reviews</a>
          </Button>
        </div>
      </section>

      {/* SECTION 4 — FINAL CTA */}
      <section className="bg-accent text-accent-foreground py-24 md:py-28">
        <div className="container-x text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Your next great meal is waiting.
          </h2>
          <div className="mt-10">
            <Button asChild variant="default" size="lg">
              <Link to="/reservations">Reserve a Table</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
