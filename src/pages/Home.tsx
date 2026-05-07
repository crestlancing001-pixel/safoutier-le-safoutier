import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// DEFAULT FALLBACK IMAGES (used if Supabase has no data)
const DEFAULTS = {
  hero: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80",
  about1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
  about2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  about3: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85",
  dish1: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  dish2: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=85",
  dish3: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
  carousel1: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
  carousel2: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85",
  carousel3: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=85",
  carousel4: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  carousel5: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
  carousel6: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
};

const avatars = Array.from({ length: 11 }, (_, i) =>
  `https://i.pravatar.cc/80?img=${i + 5}`,
);

const stats = [
  { value: 341, suffix: "+", label: "Satisfied Guests" },
  { value: 20, suffix: "+", label: "Menu Items" },
  { value: 4.7, suffix: "★", label: "TripAdvisor Rating", decimals: 1 },
];

const useCountUp = (
  target: number,
  decimals = 0,
  duration = 1400
) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(target);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, display: val.toFixed(decimals) };
};

const Stat = ({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) => {
  const { ref, display } = useCountUp(value, decimals);
  return (
    <div ref={ref} className="text-center px-6">
      <p className="font-body text-3xl md:text-4xl font-extrabold text-primary-foreground">
        {display}
        {suffix}
      </p>
      <p className="text-sm md:text-base font-medium text-primary-foreground/75 mt-1">
        {label}
      </p>
    </div>
  );
};

const Carousel = ({ images }: { images: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0 w-[280px] md:w-[340px] 
            aspect-[4/5] rounded-xl overflow-hidden"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover 
              hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="absolute -left-2 top-1/2 -translate-y-1/2 
        w-11 h-11 rounded-full bg-primary-foreground text-foreground 
        flex items-center justify-center hover:scale-105 
        transition-transform shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Next"
        className="absolute -right-2 top-1/2 -translate-y-1/2 
        w-11 h-11 rounded-full bg-primary-foreground text-foreground 
        flex items-center justify-center hover:scale-105 
        transition-transform shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// HOOK — fetches all images from Supabase site_images table
const useSiteImages = () => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("site_images")
        .select("section, image_url");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.section] = row.image_url;
      });
      setImages(map);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    // REAL TIME — listen for any image changes
    const channel = supabase
      .channel("site_images_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_images",
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper — get image URL or fallback to default
  const get = (section: string, fallback: string) =>
    images[section] || fallback;

  return { get, loading };
};

// HOOK — fetches menu dishes from Supabase
const useMenuDishes = () => {
  const [dishes, setDishes] = useState
    { name: string; desc: string; img: string }[]
  >([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("name, description, image_url")
          .limit(3);
        if (error) throw error;
        if (data && data.length > 0) {
          setDishes(
            data.map((d) => ({
              name: d.name,
              desc: d.description,
              img: d.image_url || DEFAULTS.dish1,
            }))
          );
        } else {
          // fallback to defaults
          setDishes([
            {
              name: "Ndole au Crevettes",
              desc: "Cameroon's beloved bitter leaf stew with prawns, groundnuts and plantain",
              img: DEFAULTS.dish1,
            },
            {
              name: "Barracuda Grillé",
              desc: "Fresh-catch barracuda marinated in local herbs and flame grilled",
              img: DEFAULTS.dish2,
            },
            {
              name: "Riz Jollof Spécial",
              desc: "Fragrant West African tomato rice with grilled chicken and fried plantain",
              img: DEFAULTS.dish3,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching dishes:", err);
      }
    };

    fetchDishes();

    // REAL TIME — listen for menu changes
    const channel = supabase
      .channel("menu_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
        },
        () => fetchDishes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return dishes;
};

const Home = () => {
  const { get, loading } = useSiteImages();
  const dishes = useMenuDishes();

  const heroImg = get("hero", DEFAULTS.hero);
  const aboutPhotos = [
    get("about1", DEFAULTS.about1),
    get("about2", DEFAULTS.about2),
    get("about3", DEFAULTS.about3),
  ];
  const carouselImages = [
    get("carousel1", DEFAULTS.carousel1),
    get("carousel2", DEFAULTS.carousel2),
    get("carousel3", DEFAULTS.carousel3),
    get("carousel4", DEFAULTS.carousel4),
    get("carousel5", DEFAULTS.carousel5),
    get("carousel6", DEFAULTS.carousel6),
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] -mt-20 w-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 bg-gray-900 animate-pulse" />
        ) : (
          <img
            src={heroImg}
            alt="Le Safoutier signature plate"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULTS.hero;
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full container-x flex 
        items-center justify-center pt-20">
          <h1
            className="hero-rise font-body font-black uppercase 
            text-primary leading-[0.9] text-center tracking-tight"
            style={{ fontSize: "clamp(3.75rem, 14vw, 8.5rem)" }}
          >
            LE SAFOUTIER
          </h1>
        </div>

        {/* Bottom-left pills */}
        <div
          className="absolute bottom-8 left-6 md:bottom-10 
          md:left-10 z-10 space-y-2 hero-rise"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            ["MON – SAT", "06:30 – 23:00"],
            ["SUNDAY BRUNCH", "12:00 – 16:00"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="bg-black/70 border border-white/10 
              rounded-md px-5 py-3 text-foreground text-[13px] 
              font-medium tracking-wide flex gap-4"
            >
              <span className="font-bold">{k}</span>
              <span className="text-foreground/85">{v}</span>
            </div>
          ))}
        </div>

        {/* Bottom-right tagline */}
        <p
          className="absolute bottom-10 right-6 md:right-10 z-10 
          text-foreground text-sm leading-relaxed max-w-[220px] 
          hero-rise hidden sm:block"
          style={{ animationDelay: "0.4s" }}
        >
          Experience the rich flavors of Cameroonian tradition 
          and passion in every dish.
        </p>
      </section>

      {/* ABOUT / WELCOME — yellow */}
      <section className="bg-primary text-primary-foreground 
      py-[60px] md:py-[100px]">
        <div className="container-x">
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-12 
          reveal overflow-x-auto md:overflow-visible">
            {aboutPhotos.map((src, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ height: 180 }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      DEFAULTS[`about${i + 1}` as keyof typeof DEFAULTS];
                  }}
                />
              </div>
            ))}
          </div>

          <div className="max-w-[700px] mx-auto text-center reveal">
            <p className="text-base md:text-lg font-semibold leading-[1.7]">
              Welcome to Le Safoutier, your destination for authentic 
              Cameroonian cuisine inside the prestigious Hilton Yaoundé. 
              Enjoy a culinary journey with dishes like savory Ndole and 
              delightful Jollof Rice. Join us for a memorable dining 
              experience where African tradition meets world-class taste.
            </p>
          </div>

          <div className="mt-12 pt-10 border-t border-primary-foreground/20 
          grid grid-cols-3 max-w-3xl mx-auto divide-x 
          divide-primary-foreground/15 reveal">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* MENU PREVIEW — dark */}
      <section className="bg-surface2 text-foreground 
      py-[60px] md:py-[100px]">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end 
          justify-between gap-6 mb-14 reveal">
            <div>
              <h2
                className="font-body font-extrabold text-foreground 
                leading-[1.05]"
                style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)" }}
              >
                Indulge in our
                <br />
                Exquisite Favorites
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Discover a symphony of Cameroonian and international 
                tastes with our handpicked favorites
              </p>
            </div>
            <Button asChild>
              <Link to="/reservations">Book Online</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {dishes.map((d, i) => (
              <article
                key={d.name}
                className="reveal group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="rounded-xl overflow-hidden mb-5"
                  style={{ height: 280 }}
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover 
                    transition-transform duration-700 
                    group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULTS.dish1;
                    }}
                  />
                </div>
                <h3 className="text-[22px] font-bold text-foreground mb-2">
                  {d.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center reveal">
            <Button asChild size="lg">
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — yellow */}
      <section className="bg-primary text-primary-foreground 
      py-[60px] md:py-[100px]">
        <div className="container-x">
          <div className="max-w-[750px] mx-auto text-center reveal">
            <p className="font-display text-6xl md:text-7xl 
            text-primary-foreground/40 leading-none mb-2">
              "
            </p>
            <blockquote className="text-xl md:text-2xl font-semibold 
            italic leading-[1.6]">
              Le Safoutier offers an incredible taste of Cameroon! 
              The Ndole and Sunday Brunch were outstanding, and every 
              dish was made with authentic flavors. Highly recommend!
            </blockquote>
            <p className="mt-6 text-base font-medium">
              Marcelle L. — Yaoundé, November 2023
            </p>

            <div className="mt-8 flex justify-center reveal">
              {avatars.map((a, i) => (
                <img
                  key={i}
                  src={a}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 
                  border-primary object-cover"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                />
              ))}
            </div>
          </div>

          <div className="mt-20 mb-10 reveal">
            <h2
              className="font-body font-extrabold 
              text-primary-foreground leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
            >
              Discover the Flavors
              <br />
              Behind Our Menu
            </h2>
            <p className="mt-4 text-primary-foreground/75 max-w-xl">
              A glimpse into our kitchen, our space, and the dishes 
              our guests love most.
            </p>
          </div>

          <Carousel images={carouselImages} />
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-surface2 text-foreground 
      py-[60px] md:py-[100px]">
        <div className="container-x text-center max-w-3xl 
        mx-auto reveal">
          <h2
            className="font-body font-extrabold text-foreground 
            leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
          >
            Ready for an Unforgettable
            <br />
            Dining Experience?
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Join us Monday through Sunday, 6:30 AM to 11:00 PM
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link to="/reservations">Make a Reservation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
