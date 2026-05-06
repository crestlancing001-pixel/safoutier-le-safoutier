import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const HERO = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=80";

type Item = { name: string; desc: string; img: string; badge?: string };

const tabs: { key: string; label: string; badge: string; items: Item[] }[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    badge: "Breakfast",
    items: [
      { name: "Safou Omelette", desc: "Fluffy eggs folded with roasted safou and herbs.", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80" },
      { name: "Cameroonian Puff Puff", desc: "Golden, lightly sweet fried dough served warm.", img: "https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?auto=format&fit=crop&w=900&q=80" },
      { name: "Fresh Tropical Fruit Platter", desc: "Mango, papaya, pineapple, passionfruit.", img: "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?auto=format&fit=crop&w=900&q=80" },
      { name: "Avocado Toast with Local Herbs", desc: "Sourdough, smashed avocado, chili, basil.", img: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=900&q=80" },
      { name: "Yaoundé Pepper Sauce Eggs", desc: "Soft eggs simmered in spiced tomato pepper sauce.", img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80" },
      { name: "Croissants & Pastries", desc: "Daily-baked viennoiseries from our pastry kitchen.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80" },
      { name: "Fresh Juices & Smoothies", desc: "Cold-pressed seasonal fruits, made to order.", img: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80" },
      { name: "Café Camerounais", desc: "Single-origin Cameroonian coffee, freshly brewed.", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    key: "lunch",
    label: "Lunch",
    badge: "Lunch",
    items: [
      { name: "Ndolé with Plantains", desc: "Bitterleaf stew with prawns and ripe plantain.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80" },
      { name: "Grilled Tilapia with Attiéké", desc: "Whole tilapia served with cassava couscous.", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80" },
      { name: "Poulet DG", desc: "Pan-seared chicken, sweet plantains, vegetables.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80" },
      { name: "Roasted Yam & Sauce Gombo", desc: "Tender yam with rich okra and meat sauce.", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80" },
      { name: "Caesar Salad International", desc: "Romaine, anchovy dressing, parmesan, croutons.", img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80" },
      { name: "Pasta Station", desc: "Made-to-order pasta with chef's selection of sauces.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80" },
      { name: "Grilled Beef Brochettes", desc: "Skewered beef, peppers, onion, suya spice.", img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80" },
      { name: "Légumes Sautés", desc: "Seasonal vegetables sautéed with garlic and herbs.", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    key: "dinner",
    label: "Dinner",
    badge: "Dinner",
    items: [
      { name: "Lobster Bisque", desc: "Velvety lobster cream, cognac, chive oil.", img: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=900&q=80" },
      { name: "Braised Oxtail in Palm Butter", desc: "Slow-cooked oxtail in rich palm butter sauce.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80" },
      { name: "Lamb Chops with Herb Crust", desc: "Roasted rack of lamb, fresh herb crust.", img: "https://images.unsplash.com/photo-1514516816566-de580c8a071d?auto=format&fit=crop&w=900&q=80" },
      { name: "Grilled Whole Fish", desc: "Catch of the day, charred lemon, safou butter.", img: "https://images.unsplash.com/photo-1535399831218-d4bb97c54fa1?auto=format&fit=crop&w=900&q=80" },
      { name: "Risotto du Chef", desc: "Creamy arborio rice with chef's seasonal garnish.", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80" },
      { name: "Cameroonian Pepper Soup", desc: "Spiced broth with goat meat and fresh herbs.", img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" },
      { name: "Chocolate Fondant", desc: "Warm molten chocolate cake, vanilla bean ice cream.", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80" },
      { name: "Banana Flambée", desc: "Caramelized banana flambéed in dark rum.", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    key: "buffet",
    label: "Buffet Themes",
    badge: "Theme Night",
    items: [
      { name: "African Night", desc: "A grand tour of African flavors. Every Friday.", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=80" },
      { name: "Mediterranean Evening", desc: "Olive oils, fresh seafood, sun-soaked classics. Wednesdays.", img: "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=900&q=80" },
      { name: "Asian Fusion Night", desc: "Sushi, dim sum, wok stations. Every Saturday.", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80" },
      { name: "Cameroonian Heritage Buffet", desc: "Traditional dishes from across our regions. Sundays.", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80" },
      { name: "International Grill Night", desc: "Live grill stations with prime cuts. Thursdays.", img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80" },
      { name: "Seafood Friday Special", desc: "Fresh catch, crustaceans, raw bar selections.", img: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    key: "drinks",
    label: "Drinks & Wine",
    badge: "Bar",
    items: [
      { name: "Château Margaux Selection", desc: "Curated Bordeaux vintages from our cellar.", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80" },
      { name: "South African Pinotage", desc: "Bold, smoky reds from the Cape vineyards.", img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80" },
      { name: "Cameroon Castel Beer", desc: "Crisp, refreshing local lager, served chilled.", img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=900&q=80" },
      { name: "Premium Cocktail Bar", desc: "Signature cocktails crafted by our mixologists.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80" },
      { name: "Fresh Bissap Juice", desc: "Hibiscus infusion with mint and lime.", img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80" },
      { name: "Ginger & Hibiscus Mocktail", desc: "Spiced ginger, hibiscus, citrus zest.", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80" },
      { name: "Espresso & Digestifs", desc: "Italian espresso paired with aged spirits.", img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80" },
      { name: "Champagne by the Glass", desc: "Daily selection of premier maisons.", img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80" },
    ],
  },
];

const Menu = () => {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active)!;

  return (
    <>
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[360px] -mt-20 w-full overflow-hidden flex items-center justify-center">
        <img src={HERO} alt="Le Safoutier buffet spread" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/[0.6]" />
        <div className="relative z-10 text-center container-x pt-20">
          <h1 className="font-display text-cream text-5xl md:text-7xl">Our Menu</h1>
          <p className="font-accent italic text-primary text-xl md:text-2xl mt-4">
            A celebration of Cameroonian and international cuisine
          </p>
        </div>
      </section>

      {/* TAB NAV */}
      <section className="bg-background py-12 md:py-16 sticky top-20 z-30 border-b border-border/40 backdrop-blur-sm bg-background/95">
        <div className="container-x flex flex-wrap justify-center gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-5 md:px-6 py-2.5 rounded-full text-sm uppercase tracking-wider transition-all border ${
                active === t.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-primary border-primary/40 hover:border-primary hover:bg-primary/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="bg-background py-16 md:py-24">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {current.items.map((item) => (
              <article
                key={item.name}
                className="group bg-card rounded-xl overflow-hidden border border-border/40 transition-transform duration-500 hover:scale-[1.02] animate-fade-up"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {current.badge}
                  </span>
                  <h3 className="font-display text-2xl text-cream mb-2">{item.name}</h3>
                  <p className="font-light text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CREAM BANNER */}
      <section className="bg-cream text-cream-foreground py-16 md:py-20">
        <div className="container-x text-center max-w-3xl mx-auto">
          <p className="font-accent italic text-2xl md:text-3xl text-accent leading-snug">
            All menus are subject to seasonal availability. Our chef sources fresh ingredients
            daily from Yaoundé's local markets.
          </p>
          <div className="mt-8">
            <Button asChild variant="terracotta" size="lg">
              <Link to="/reservations">Make a Reservation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
