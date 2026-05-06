import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LeafDivider, SafouLeaf } from "@/components/SafouLeaf";
import { Star, Award, MapPin, Clock } from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80";
const PLATE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
const AMBIANCE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
const CHEF = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80";

const dishes = [
  { name: "Ndolé Royal", desc: "Bitterleaf stew with prawns, crayfish & beef.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80" },
  { name: "Poulet DG", desc: "Pan-seared chicken with sweet plantains & vegetables.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80" },
  { name: "Grilled Sea Bass", desc: "Whole fish with safou butter & herb rice.", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80" },
];

const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <img src={HERO} alt="Le Safoutier dining ambiance" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="relative z-10 container-x h-full flex flex-col justify-end pb-24 md:pb-32">
          <p className="eyebrow mb-4 animate-fade-up">Inside Hilton Yaoundé</p>
          <h1 className="display-1 text-foreground max-w-4xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            A taste of Cameroon, <br />
            <span className="text-primary italic font-accent font-normal">an experience of the world.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Refined cuisine in the heart of Yaoundé — where ancestral flavors meet
            international finesse, served from sunrise to late evening.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="terracotta" size="lg"><Link to="/reservations">Reserve a Table</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/menu">View the Menu</Link></Button>
          </div>
        </div>
      </section>

      {/* TRIPADVISOR STRIP */}
      <section className="bg-surface2 border-y border-border/50">
        <div className="container-x py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
          <div className="flex items-center gap-2 text-primary"><Star className="w-5 h-5 fill-primary" /><span className="font-display text-2xl">4.7</span><span className="text-sm text-muted-foreground">/ 5</span></div>
          <div className="text-sm text-muted-foreground">341 reviews on TripAdvisor</div>
          <div className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /><span className="text-sm">#3 of 148 restaurants in Yaoundé</span></div>
        </div>
      </section>

      {/* INTRO — asymmetric */}
      <section className="section-y">
        <div className="container-x grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">Our Story</p>
            <h2 className="display-2 mb-6">Named for the safou tree, rooted in Cameroon.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Le Safoutier celebrates the safou — a beloved fruit of Central Africa — and the
              culinary heritage that surrounds it. Within the Hilton Yaoundé, our chefs
              compose menus that honor local terroir while embracing world flavors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Each plate is an invitation to slow down, to taste, and to share.
            </p>
            <div className="mt-8"><Button asChild variant="ghost"><Link to="/menu">Discover our menu →</Link></Button></div>
          </div>
          <div className="md:col-span-7 md:translate-y-8 reveal">
            <div className="grid grid-cols-5 gap-4">
              <img src={AMBIANCE} alt="Restaurant ambiance" className="col-span-3 aspect-[4/5] object-cover rounded-xl" />
              <img src={PLATE} alt="Signature plate" className="col-span-2 aspect-[3/4] object-cover rounded-xl mt-12" />
            </div>
          </div>
        </div>
      </section>

      <LeafDivider />

      {/* SIGNATURE DISHES */}
      <section className="section-y">
        <div className="container-x">
          <div className="max-w-2xl mb-16 reveal">
            <p className="eyebrow mb-4">Signature Dishes</p>
            <h2 className="display-2">Flavors crafted with intention.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dishes.map((d, i) => (
              <article key={d.name} className="reveal group" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="overflow-hidden rounded-xl mb-5 aspect-[4/5]">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-display text-2xl mb-2">{d.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{d.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-BLEED QUOTE */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <img src={CHEF} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative container-x text-center max-w-3xl mx-auto reveal">
          <SafouLeaf className="w-10 h-10 text-primary mx-auto mb-6" />
          <p className="font-accent italic text-2xl md:text-4xl leading-snug text-cream">
            "Cooking is a language — and at Le Safoutier, every plate tells a story
            of land, water, and the warmth of Cameroon."
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-primary">Executive Chef</p>
        </div>
      </section>

      {/* VISIT */}
      <section className="section-y bg-surface2">
        <div className="container-x grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">Visit Us</p>
            <h2 className="display-2 mb-8">Open every day, sunrise to late evening.</h2>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex gap-4"><MapPin className="w-5 h-5 text-primary mt-1 shrink-0" /><span>Hilton Yaoundé · Boulevard du 20 Mai<br />Yaoundé, Cameroon</span></li>
              <li className="flex gap-4"><Clock className="w-5 h-5 text-primary mt-1 shrink-0" /><span>Monday – Sunday<br />6:30 AM – 11:00 PM</span></li>
            </ul>
            <div className="mt-10 flex gap-4">
              <Button asChild variant="terracotta"><Link to="/reservations">Reserve a Table</Link></Button>
              <Button asChild variant="outline"><Link to="/contact">Contact</Link></Button>
            </div>
          </div>
          <div className="md:col-span-7 reveal">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/60">
              <iframe
                title="Hilton Yaoundé location"
                src="https://www.google.com/maps?q=Hilton+Yaounde,+Boulevard+du+20+Mai,+Yaounde,+Cameroon&output=embed"
                className="w-full h-full grayscale-[0.3] contrast-110"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
