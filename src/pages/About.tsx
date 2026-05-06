import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const heroImg =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80&auto=format&fit=crop";
const interiorImg =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop";
const chefImg =
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80&auto=format&fit=crop";
const buffetImg =
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80&auto=format&fit=crop";
const brunchImg =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop";

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            setVal(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, val };
}

const StatNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const { ref, val } = useCountUp(value);
  return <span ref={ref}>{val}{suffix}</span>;
};

const About = () => {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative container-x py-24 hero-rise">
          <p className="text-primary text-xs font-body uppercase tracking-[0.2em] mb-6">
            Hilton Yaoundé • Cameroon
          </p>
          <h1 className="text-primary font-display font-black uppercase leading-[0.95] text-[52px] md:text-[100px]">
            Our Story
          </h1>
          <p className="text-foreground font-body text-lg md:text-xl mt-6">
            A legacy rooted in the heart of Cameroon
          </p>
        </div>
      </section>

      {/* OUR STORY — yellow */}
      <section className="bg-primary section-y">
        <div className="container-x grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="reveal order-2 md:order-1">
            <p className="text-primary-foreground text-xs font-body font-bold uppercase tracking-[0.2em] mb-5">
              Who We Are
            </p>
            <h2 className="text-primary-foreground font-display font-extrabold text-3xl md:text-5xl leading-[1.15]">
              Named After Cameroon's Most Beloved Tree
            </h2>
            <div className="mt-8 space-y-6 text-primary-foreground font-body text-[17px] leading-[1.8]">
              <p>
                Le Safoutier takes its name from the iconic safou tree — a symbol of
                nourishment, community and abundance deeply rooted in Cameroonian
                culture. Just as the safou tree gives generously to all who gather
                beneath it, our restaurant exists to bring people together through
                the universal language of exceptional food.
              </p>
              <p>
                Nestled within the prestigious 5-star Hilton Yaoundé on Boulevard du
                20 Mai, we have spent years crafting dining experiences that honor
                Cameroon's rich culinary heritage while embracing the finest
                international techniques and ingredients.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-3 divide-x divide-primary-foreground/30">
              {[
                { num: <><StatNumber value={341} />+</>, label: "Guest Reviews" },
                { num: <>4.7★</>, label: "TripAdvisor Rating" },
                { num: <>#3</>, label: "in Yaoundé" },
              ].map((s, i) => (
                <div key={i} className={i === 0 ? "pr-4" : "px-4"}>
                  <div className="text-primary-foreground font-display font-black text-3xl md:text-[42px] leading-none">
                    {s.num}
                  </div>
                  <div className="text-primary-foreground/80 font-body text-sm font-medium mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal order-1 md:order-2">
            <img
              src={interiorImg}
              alt="Le Safoutier elegant restaurant interior"
              className="w-full h-[420px] md:h-[600px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* MISSION — dark */}
      <section className="bg-surface2 section-y">
        <div className="container-x max-w-[900px] text-center reveal">
          <p className="text-primary text-xs font-body uppercase tracking-[0.2em] mb-5">
            Our Mission
          </p>
          <h2 className="text-foreground font-display font-extrabold text-3xl md:text-[52px] leading-[1.1]">
            More Than a Restaurant — An Experience
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg leading-[1.8] mt-8">
            At Le Safoutier, we believe dining is one of life's greatest pleasures.
            Our mission is to create a space where every guest — whether a Yaoundé
            local or an international visitor — feels welcomed, nourished, and
            inspired. From our celebrated buffet breakfasts to our legendary Sunday
            Brunch with live music, every moment at Le Safoutier is crafted with
            intention and passion.
          </p>
        </div>
        <div className="container-x grid md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {[
            { icon: "🍽️", title: "Authentic Cuisine", desc: "Fresh ingredients sourced daily from local Cameroonian markets" },
            { icon: "🌍", title: "World-Class Service", desc: "Attentive, warm hospitality that makes every guest feel special" },
            { icon: "🎵", title: "Vibrant Atmosphere", desc: "Live music, African artworks and stunning garden views" },
          ].map((c, i) => (
            <div
              key={i}
              className="reveal group bg-background border border-foreground/10 border-t-[3px] border-t-primary rounded-xl p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.4)] hover:border-t-primary-hover"
            >
              <div className="text-5xl mb-5">{c.icon}</div>
              <h3 className="text-foreground font-display font-bold text-xl mb-3">{c.title}</h3>
              <p className="text-muted-foreground font-body text-[15px] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE EXPERIENCE — yellow */}
      <section className="bg-primary section-y">
        <div className="container-x">
          <div className="reveal max-w-3xl">
            <p className="text-primary-foreground text-xs font-body uppercase tracking-[0.2em] mb-5">
              The Experience
            </p>
            <h2 className="text-primary-foreground font-display font-extrabold text-3xl md:text-[52px] leading-[1.1]">
              Every Detail. Every Dish. Every Time.
            </h2>
            <p className="text-primary-foreground/80 font-body text-base md:text-base mt-6 max-w-2xl">
              From our chefs to our service team, everyone at Le Safoutier shares one
              goal — to make your visit unforgettable.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { img: chefImg, label: "Our Chefs", desc: "Trained in both Cameroonian tradition and international cuisine" },
              { img: buffetImg, label: "Our Buffet", desc: "Over 30 dishes daily — local and international, always fresh" },
              { img: brunchImg, label: "Sunday Brunch", desc: "Live band, pool access and unlimited food every Sunday 12PM – 4PM" },
            ].map((c, i) => (
              <div key={i} className="reveal">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="w-full h-[280px] object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-primary-foreground font-display font-bold text-[22px] mt-5">{c.label}</h3>
                <p className="text-primary-foreground/80 font-body text-[15px] leading-relaxed mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS — dark */}
      <section className="bg-background section-y">
        <div className="container-x text-center reveal">
          <p className="text-primary text-xs font-body uppercase tracking-[0.2em] mb-5">
            Recognition
          </p>
          <h2 className="text-foreground font-display font-extrabold text-3xl md:text-[52px] leading-[1.1]">
            Yaoundé's Most Celebrated Restaurant
          </h2>
        </div>
        <div className="container-x grid md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {[
            { icon: "⭐", number: "4.7", label: "TripAdvisor Rating", sub: "Based on 341 verified reviews" },
            { icon: "🏆", number: "#3", label: "Best in Yaoundé", sub: "Out of 148 restaurants" },
            { icon: "🎖️", number: "2024", label: "Travelers' Choice Award", sub: "Top 10% worldwide on TripAdvisor" },
          ].map((c, i) => (
            <div
              key={i}
              className="reveal bg-surface2 border border-foreground/10 rounded-2xl p-10 md:p-12 text-center transition-all duration-300 hover:border-primary hover:scale-[1.03]"
            >
              <div className="text-5xl mb-4">{c.icon}</div>
              <div className="text-primary font-display font-black text-5xl md:text-[56px] leading-none">
                {c.number}
              </div>
              <div className="text-foreground font-display font-bold text-lg mt-3">{c.label}</div>
              <div className="text-muted-foreground font-body text-sm mt-2">{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — yellow */}
      <section className="bg-primary py-20 md:py-24">
        <div className="container-x text-center reveal">
          <h2 className="text-primary-foreground font-display font-extrabold text-3xl md:text-[52px] leading-[1.1]">
            Ready to Experience Le Safoutier?
          </h2>
          <p className="text-primary-foreground/80 font-body text-base md:text-lg mt-6">
            Join us for breakfast, lunch, dinner or our legendary Sunday Brunch.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="dark" className="w-full sm:w-auto">
              <Link to="/reservations">Reserve a Table</Link>
            </Button>
            <Button asChild size="xl" variant="outline-dark" className="w-full sm:w-auto">
              <Link to="/menu">View Our Menu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
