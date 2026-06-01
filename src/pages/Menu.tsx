import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeafDivider } from "@/components/SafouLeaf";
import { useMenuItems, useRealtimeUpdates } from "@/hooks/useSupabase";

const HERO = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=80";

const Menu = () => {
  const { data: menuItems = [], isLoading } = useMenuItems();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Enable real-time updates
  useRealtimeUpdates();

  // Group menu items by category for tabs
  const tabs = useMemo(() => {
    const grouped = menuItems.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);

    return Object.entries(grouped).map(([category, items]) => ({
      key: category.toLowerCase().replace(/\s+/g, "-"),
      label: category,
      badge: category,
      items: items.map(item => ({
        name: item.name,
        desc: item.description || "",
        img: item.image_url || "https://via.placeholder.com/600x400?text=No+Image",
        badge: item.tag || undefined,
      })),
    }));
  }, [menuItems]);

  const navTabs = useMemo(
    () => [{ key: "all", label: "All" }, ...tabs.map((t) => ({ key: t.key, label: t.label }))],
    [tabs]
  );

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tabs
      .filter((t) => active === "all" || t.key === active)
      .map((t) => ({
        ...t,
        items: q
          ? t.items.filter(
              (i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
            )
          : t.items,
      }))
      .filter((t) => t.items.length > 0);
  }, [active, query, tabs]);

  const totalResults = visibleSections.reduce((n, s) => n + s.items.length, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading menu...</p>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[360px] -mt-20 w-full overflow-hidden flex items-center justify-center">
        <img src={HERO} alt="Le Safoutier buffet spread" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center container-x pt-20">
          <h1
            className="font-body font-black uppercase text-primary leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.75rem, 9vw, 5.5rem)" }}
          >
            OUR MENU
          </h1>
          <p className="text-foreground/85 text-base md:text-lg mt-4 max-w-xl mx-auto">
            A celebration of Cameroonian and international cuisine
          </p>
        </div>
      </section>

      {/* TAB NAV + SEARCH */}
      <section className="bg-surface2 py-6 sticky top-20 z-30 border-b border-foreground/10">
        <div className="container-x flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-2.5">
            {navTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.05em] transition-all border ${
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, ingredients…"
              aria-label="Search the menu"
              className="h-12 pl-11 pr-11 rounded-full bg-background border-foreground/15 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-primary"
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
          {visibleSections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-foreground mb-2">No dishes found</p>
              <p className="text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          ) : (
            visibleSections.map((section, idx) => (
              <div key={section.key} className="animate-fade-up">
                {idx > 0 && <LeafDivider className="my-16 md:my-20" />}

                <div className="text-center mb-10 md:mb-14">
                  <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary border border-primary/40 rounded-full mb-4">
                    {section.badge}
                  </span>
                  <h2
                    className="font-body font-black uppercase text-foreground leading-[0.95] tracking-tight"
                    style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
                  >
                    {section.label}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {section.items.map((item) => (
                    <article key={item.name} className="group">
                      <div className="rounded-xl overflow-hidden mb-5 h-[260px]">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          {item.badge && (
                            <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-foreground/70 text-sm mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Menu;
