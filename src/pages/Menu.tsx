import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeafDivider } from "@/components/SafouLeaf";
import { supabase } from "@/lib/supabase";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=80";

type Item = {
  name: string;
  desc: string;
  img: string;
  badge?: string;
  category: string;
};

// FALLBACK hardcoded items if Supabase is empty
const FALLBACK_ITEMS: Item[] = [
  {
    category: "breakfast",
    name: "Safou Omelette",
    desc: "Fluffy eggs folded with roasted safou and herbs.",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "breakfast",
    name: "Cameroonian Puff Puff",
    desc: "Golden, lightly sweet fried dough served warm.",
    img: "https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "breakfast",
    name: "Fresh Tropical Fruit Platter",
    desc: "Mango, papaya, pineapple, passionfruit.",
    img: "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "breakfast",
    name: "Avocado Toast with Local Herbs",
    desc: "Sourdough, smashed avocado, chili, basil.",
    img: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "breakfast",
    name: "Yaoundé Pepper Sauce Eggs",
    desc: "Soft eggs simmered in spiced tomato pepper sauce.",
    img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "breakfast",
    name: "Croissants & Pastries",
    desc: "Daily-baked viennoiseries from our pastry kitchen.",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "lunch",
    name: "Ndolé with Plantains",
    desc: "Bitterleaf stew with prawns and ripe plantain.",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "lunch",
    name: "Grilled Tilapia with Attiéké",
    desc: "Whole tilapia served with cassava couscous.",
    img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "lunch",
    name: "Poulet DG",
    desc: "Pan-seared chicken, sweet plantains, vegetables.",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "dinner",
    name: "Lobster Bisque",
    desc: "Velvety lobster cream, cognac, chive oil.",
    img: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "dinner",
    name: "Braised Oxtail in Palm Butter",
    desc: "Slow-cooked oxtail in rich palm butter sauce.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "dinner",
    name: "Lamb Chops with Herb Crust",
    desc: "Roasted rack of lamb, fresh herb crust.",
    img: "https://images.unsplash.com/photo-1514516816566-de580c8a071d?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "buffet",
    name: "African Night",
    desc: "A grand tour of African flavors. Every Friday.",
    img: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "buffet",
    name: "Mediterranean Evening",
    desc: "Olive oils, fresh seafood, sun-soaked classics. Wednesdays.",
    img: "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "drinks",
    name: "Premium Cocktail Bar",
    desc: "Signature cocktails crafted by our mixologists.",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "drinks",
    name: "Fresh Bissap Juice",
    desc: "Hibiscus infusion with mint and lime.",
    img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80",
  },
];

const CATEGORY_META: Record
  string,
  { label: string; badge: string }
> = {
  breakfast: { label: "Breakfast", badge: "Breakfast" },
  lunch: { label: "Lunch", badge: "Lunch" },
  dinner: { label: "Dinner", badge: "Dinner" },
  buffet: { label: "Buffet Themes", badge: "Theme Night" },
  drinks: { label: "Drinks & Wine", badge: "Bar" },
};

const CATEGORY_ORDER = [
  "breakfast",
  "lunch",
  "dinner",
  "buffet",
  "drinks",
];

// HOOK — fetches menu items from Supabase
const useMenuItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImg, setHeroImg] = useState(HERO_DEFAULT);

  const fetchItems = async () => {
    try {
      // Fetch menu items
      const { data, error } = await supabase
        .from("menu_items")
        .select("name, description, image_url, category, tag")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setItems(
          data.map((d) => ({
            name: d.name,
            desc: d.description,
            img: d.image_url || "",
            badge: d.tag || "",
            category: d.category?.toLowerCase() || "lunch",
          }))
        );
      } else {
        // Use fallback if Supabase is empty
        setItems(FALLBACK_ITEMS);
      }

      // Fetch hero image
      const { data: imgData } = await supabase
        .from("site_images")
        .select("image_url")
        .eq("section", "menu_hero")
        .single();

      if (imgData?.image_url) {
        setHeroImg(imgData.image_url);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      setItems(FALLBACK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    // REAL TIME — listen for menu changes
    const menuChannel = supabase
      .channel("menu_items_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
        },
        () => fetchItems()
      )
      .subscribe();

    // REAL TIME — listen for image changes
    const imgChannel = supabase
      .channel("site_images_menu")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_images",
        },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(imgChannel);
    };
  }, []);

  return { items, loading, heroImg };
};

const Menu = () => {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const { items, loading, heroImg } = useMenuItems();

  const navTabs = useMemo(
    () => [
      { key: "all", label: "All" },
      ...CATEGORY_ORDER.map((k) => ({
        key: k,
        label: CATEGORY_META[k]?.label || k,
      })),
    ],
    []
  );

  // Group items by category
  const groupedSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORY_ORDER.map((catKey) => {
      const catItems = items
        .filter((item) => item.category === catKey)
        .filter(
          (item) =>
            active === "all" || item.category === active
        )
        .filter(
          (item) =>
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q)
        );
      return {
        key: catKey,
        label: CATEGORY_META[catKey]?.label || catKey,
        badge: CATEGORY_META[catKey]?.badge || catKey,
        items: catItems,
      };
    }).filter((s) => s.items.length > 0);
  }, [items, active, query]);

  const totalResults = groupedSections.reduce(
    (n, s) => n + s.items.length,
    0
  );

  return (
    <>
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[360px] 
      -mt-20 w-full overflow-hidden flex items-center 
      justify-center">
        {loading ? (
          <div className="absolute inset-0 bg-gray-900 
          animate-pulse" />
        ) : (
          <img
            src={heroImg}
            alt="Le Safoutier buffet spread"
            className="absolute inset-0 w-full h-full 
            object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                HERO_DEFAULT;
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center 
        container-x pt-20">
          <h1
            className="font-body font-black uppercase 
            text-primary leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(2.75rem, 9vw, 5.5rem)",
            }}
          >
            OUR MENU
          </h1>
          <p className="text-foreground/85 text-base 
          md:text-lg mt-4 max-w-xl mx-auto">
            A celebration of Cameroonian and international 
            cuisine
          </p>
        </div>
      </section>

      {/* TAB NAV + SEARCH */}
      <section className="bg-surface2 py-6 sticky top-20 
      z-30 border-b border-foreground/10">
        <div className="container-x flex flex-col gap-5">
          <div className="flex flex-wrap justify-center 
          gap-2.5">
            {navTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 md:px-6 py-2.5 rounded-full 
                text-xs md:text-sm font-bold uppercase 
                tracking-[0.05em] transition-all border ${
                  active === t.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground/85 border-foreground/20 hover:border-primary hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xl w-full mx-auto">
            <Search className="absolute left-4 top-1/2 
            -translate-y-1/2 w-4 h-4 text-muted-foreground 
            pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, ingredients…"
              aria-label="Search the menu"
              className="h-12 pl-11 pr-11 rounded-full 
              bg-background border-foreground/15 
              focus-visible:ring-primary 
              focus-visible:ring-offset-0 
              focus-visible:border-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 
                -translate-y-1/2 p-1 rounded-full 
                text-muted-foreground hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MENU SECTIONS */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-x">
          {loading ? (
            // LOADING SKELETON
            <div className="grid sm:grid-cols-2 
            lg:grid-cols-3 gap-x-8 gap-y-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-xl bg-gray-800 
                  h-[260px] mb-5" />
                  <div className="h-6 bg-gray-800 
                  rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-800 
                  rounded w-full" />
                </div>
              ))}
            </div>
          ) : groupedSections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold 
              text-foreground mb-2">
                No dishes found
              </p>
              <p className="text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          ) : (
            groupedSections.map((section, idx) => (
              <div
                key={section.key}
                className="animate-fade-up"
              >
                {idx > 0 && (
                  <LeafDivider className="my-16 md:my-20" />
                )}

                <div className="text-center mb-10 md:mb-14">
                  <span className="inline-block px-3 py-1 
                  text-[11px] font-bold uppercase 
                  tracking-[0.15em] text-primary 
                  border border-primary/40 rounded-full mb-4">
                    {section.badge}
                  </span>
                  <h2
                    className="font-body font-black uppercase 
                    text-foreground leading-[0.95] 
                    tracking-tight"
                    style={{
                      fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    }}
                  >
                    {section.label}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 
                lg:grid-cols-3 gap-x-8 gap-y-12">
                  {section.items.map((item) => (
                    <article
                      key={item.name}
                      className="group"
                    >
                      <div className="rounded-xl 
                      overflow-hidden mb-5 h-[260px]">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full 
                          object-cover transition-transform 
                          duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).src =
                              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80";
                          }}
                        />
                      </div>
                      <h3 className="text-[22px] font-bold 
                      text-foreground mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm 
                      text-muted-foreground leading-relaxed 
                      line-clamp-2">
                        {item.desc}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}

          {query && totalResults > 0 && (
            <p className="text-center text-sm 
            text-muted-foreground mt-12">
              {totalResults} result
              {totalResults === 1 ? "" : "s"} for "{query}"
            </p>
          )}
        </div>
      </section>

      {/* YELLOW BANNER */}
      <section className="bg-primary text-primary-foreground 
      py-16 md:py-20">
        <div className="container-x text-center 
        max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl font-semibold 
          leading-snug">
            All menus are subject to seasonal availability. 
            Our chef sources fresh ingredients daily from 
            Yaoundé's local markets.
          </p>
          <div className="mt-8">
            <Button asChild variant="dark" size="lg">
              <Link to="/reservations">
                Make a Reservation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
