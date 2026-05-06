import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LeafDivider } from "@/components/SafouLeaf";
import { Star, Award, ChevronDown, Utensils, Music, Waves, Sun } from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80";
const STORY_IMG = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85";
const TERRACE = "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=85";
const BRUNCH = "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=85";

const dishes = [
  {
    name: "Ndolé Royal",
    desc: "Bitterleaf stew with prawns, crayfish & beef.",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Poulet DG",
    desc: "Pan-seared chicken with sweet plantains & vegetables.",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Grilled Sea Bass",
    desc: "Whole fish with safou butter & herb rice.",
    img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=85",
  },
];

const reviews = [
  { text: "Exceptional buffet. The variety of Cameroonian dishes alongside international options was remarkable. Best meal in Yaoundé.", name: "James A." },
  { text: "Sunday brunch with live music and pool access — absolutely magical. The staff treated us like royalty.", name: "Sophie M." },
  { text: "The Ndolé was the best I have ever tasted. The ambiance inside the Hilton is world-class.", name: "Pierre K." },
  { text: "Highly recommend for business dinners. Quiet, elegant, and the food quality is unmatched in Cameroon.", name: "Amara D." },
];

const Home = () => {
  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative h-screen min-h-[640px] -mt-20 w-full overflow-hidden flex items-center justify-center">
        <img src={HERO} alt="Le Safoutier signature plate" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/[0.55]" />
        <div className="relative z-10 container-x text-center max-w-4xl">
          <p className="font-accent italic text-primary text-lg md:text-xl uppercase tracking-[0.25em] mb-6 animate-fade-up">
            Hilton Yaoundé, Cameroon
          </p>
          <h1
            className="font-display font-medium text-cream leading-[1.05] animate-fade-up"
            style={{ fontSize: "clamp(2.625rem, 6vw, 4.5rem)", animationDelay: "0.1s" }}
          >
            Where Cameroon Meets the World
          </h1>
          <p className="mt-6 text-base md:text-lg font-light text-cream/85 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Authentic flavors. Refined ambiance. Unforgettable moments.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="terracotta" size="lg">
              <Link to="/reservations">Reserve a Table</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border border-cream/70 text-cream hover:bg-cream hover:text-cream-foreground"
            >
              <Link to="/menu">Explore Our Menu</Link>
            </Button>
          </div>
        </div>

        {/* Awards strip */}
        <div className="absolute bottom-16 md:bottom-20 left-0 right-0 z-10">
          <div className="mx-auto max-w-5xl bg-background/60 backdrop-blur-sm border-y border-primary/20">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 px-6 text-sm text-cream/90">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-display text-lg text-primary">4.7</span>
                <span className="text-cream/70">TripAdvisor</span>
              </span>
              <span className="hidden md:inline text-primary/40">·</span>
              <span>#3 of 148 restaurants in Yaoundé</span>
              <span className="hidden md:inline text-primary/40">·</span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Travelers' Choice Award
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce-soft">
          <ChevronDown className="w-6 h-6 text-cream/70" />
        </div>
      </section>

      {/* SECTION 2 — STORY */}
      <section className="bg-cream text-cream-foreground py-24 md:py-32">
        <div className="container-x grid md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="md:col-span-7 reveal">
            <p className="font-accent italic text-accent/80 text-lg mb-6 uppercase tracking-[0.2em]">Our Origin</p>
            <blockquote className="font-display text-accent text-3xl md:text-5xl leading-[1.15] font-medium">
              "Named after the safou — the wild African plum that thrives in Cameroonian forests.
              <span className="block mt-3 italic font-accent text-accent/90">A fruit of richness. A symbol of our table.</span>"
            </blockquote>
            <div className="mt-10 h-px w-24 bg-accent/30" />
            <p className="mt-6 text-cream-foreground/70 max-w-md leading-relaxed">
              Within the Hilton Yaoundé, our chefs honor this heritage through plates that
              draw from local terroir and the wider world.
            </p>
          </div>
          <div className="md:col-span-5 reveal relative">
            <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-2xl">
              <img src={STORY_IMG} alt="Le Safoutier interior" className="w-full h-full object-cover" />
            </div>
            {/* Floating award badge */}
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-background text-cream rounded-xl shadow-2xl p-5 w-56 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-widest text-primary">TripAdvisor</span>
              </div>
              <p className="font-display text-2xl">4.7 ★</p>
              <p className="text-xs text-cream/70 mt-1">Travelers' Choice · 341 reviews</p>
            </div>
          </div>
        </div>
        <div className="mt-24"><LeafDivider /></div>
      </section>

      {/* SECTION 3 — FEATURED DISHES */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <p className="eyebrow mb-3">Signature Flavours</p>
            <h2 className="font-display text-primary text-4xl md:text-5xl font-medium">
              Crafted with intention.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dishes.map((d, i) => (
              <article
                key={d.name}
                className="reveal group bg-card rounded-xl overflow-hidden transition-transform duration-500 hover:scale-[1.03]"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[4/5] overflow-hidden" style={{ height: "60%" }}>
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-cream mb-2">{d.name}</h3>
                  <p className="font-light text-muted-foreground text-sm leading-relaxed">{d.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — EXPERIENCE */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="container-x space-y-20 md:space-y-28">
          {/* Block A */}
          <div className="grid md:grid-cols-100 md:[grid-template-columns:55fr_45fr] gap-10 md:gap-16 items-center reveal">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img src={TERRACE} alt="Restaurant terrace" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="eyebrow mb-3">The Setting</p>
              <h3 className="font-display text-4xl md:text-5xl text-cream mb-8">A Table with a View</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-muted-foreground">Refined ambiance with warm, intimate lighting</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-muted-foreground">Live acoustic music every Sunday</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Waves className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-muted-foreground">Direct poolside access for guests</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Block B — alternated */}
          <div className="grid md:[grid-template-columns:45fr_55fr] gap-10 md:gap-16 items-center reveal">
            <div className="md:order-1 order-2">
              <p className="eyebrow mb-3">Every Sunday</p>
              <h3 className="font-display text-4xl md:text-5xl text-cream mb-6">The Sunday Brunch</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A celebrated tradition at Le Safoutier — Sundays from 12:00 PM to 4:00 PM bring
                together a lavish spread of Cameroonian and international dishes, accompanied
                by live music and full poolside access.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><Sun className="w-4 h-4 text-primary" /> 12:00 PM – 4:00 PM</li>
                <li className="flex items-center gap-3"><Music className="w-4 h-4 text-primary" /> Live music throughout</li>
                <li className="flex items-center gap-3"><Waves className="w-4 h-4 text-primary" /> Pool access included</li>
              </ul>
              <div className="mt-8">
                <Button asChild variant="terracotta"><Link to="/reservations">Book Sunday Brunch</Link></Button>
              </div>
            </div>
            <div className="md:order-2 order-1 aspect-[4/3] overflow-hidden rounded-xl">
              <img src={BRUNCH} alt="Sunday brunch buffet" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — TESTIMONIALS */}
      <section className="bg-cream text-cream-foreground py-24 md:py-32 overflow-hidden">
        <div className="container-x text-center mb-14 reveal">
          <p className="font-accent italic text-accent text-lg mb-3 uppercase tracking-[0.2em]">Guest Voices</p>
          <h2 className="font-display text-cream-foreground text-4xl md:text-5xl">What Our Guests Say</h2>
        </div>
        <div className="relative">
          <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((r, i) => (
              <article
                key={i}
                className="w-[340px] md:w-[420px] bg-background/[0.04] border border-accent/15 rounded-xl p-8 shadow-sm shrink-0"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-accent italic text-xl md:text-2xl leading-snug text-cream-foreground/90">
                  "{r.text}"
                </p>
                <div className="mt-6 pt-5 border-t border-accent/15">
                  <p className="font-display text-lg text-accent">{r.name}</p>
                  <p className="text-xs uppercase tracking-widest text-cream-foreground/50 mt-1">via TripAdvisor</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA BANNER */}
      <section className="bg-accent text-accent-foreground py-24 md:py-32">
        <div className="container-x text-center max-w-3xl mx-auto reveal">
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Ready for an Unforgettable Dining Experience?
          </h2>
          <p className="mt-6 text-lg text-accent-foreground/85">
            Join us Monday through Sunday, 6:30 AM to 11:00 PM
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-cream text-cream-foreground hover:bg-cream/90"
            >
              <Link to="/reservations">Make a Reservation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
