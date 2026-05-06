import { LeafDivider } from "@/components/SafouLeaf";

const sections = [
  {
    title: "Starters",
    note: "To awaken the palate.",
    items: [
      { name: "Folong Soup", desc: "Cameroonian leafy greens, smoked fish broth.", price: "5.500 XAF" },
      { name: "Safou & Avocado Salad", desc: "Roasted safou, avocado, citrus, peppered oil.", price: "6.000 XAF" },
      { name: "Beef Carpaccio", desc: "Aged beef, parmesan, rocket, truffle oil.", price: "8.500 XAF" },
      { name: "Crayfish Beignets", desc: "Crispy fritters, lime-pepper aioli.", price: "7.000 XAF" },
    ],
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "From Cameroon",
    note: "Our heritage, plated with care.",
    items: [
      { name: "Ndolé Royal", desc: "Bitterleaf stew, prawns, crayfish, beef.", price: "12.500 XAF" },
      { name: "Poulet DG", desc: "Chicken, sweet plantains, garden vegetables.", price: "11.000 XAF" },
      { name: "Eru with Water Fufu", desc: "Wild greens, smoked meat, palm oil.", price: "9.500 XAF" },
      { name: "Achu & Yellow Soup", desc: "Pounded cocoyam, traditional spice broth.", price: "9.000 XAF" },
    ],
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "From the World",
    note: "International classics, refined.",
    items: [
      { name: "Grilled Sea Bass", desc: "Whole bass, safou butter, herb rice.", price: "16.500 XAF" },
      { name: "Filet Mignon", desc: "Beef tenderloin, peppercorn jus, gratin.", price: "18.000 XAF" },
      { name: "Risotto ai Funghi", desc: "Arborio rice, wild mushrooms, parmesan.", price: "11.500 XAF" },
      { name: "Lamb Tagine", desc: "Slow-braised lamb, dried fruits, couscous.", price: "15.000 XAF" },
    ],
    img: "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Desserts & Drinks",
    note: "A sweet finish.",
    items: [
      { name: "Safou Mousse", desc: "Whipped safou cream, cocoa crumble.", price: "5.000 XAF" },
      { name: "Pineapple Carpaccio", desc: "Victoria pineapple, vanilla, mint.", price: "4.500 XAF" },
      { name: "Bissap Cocktail", desc: "Hibiscus, ginger, lime, dark rum.", price: "6.000 XAF" },
      { name: "Cameroon Single-Origin Coffee", desc: "Slow-brewed espresso.", price: "3.000 XAF" },
    ],
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
  },
];

const Menu = () => (
  <>
    <section className="section-y">
      <div className="container-x text-center max-w-3xl mx-auto">
        <p className="eyebrow mb-4">The Menu</p>
        <h1 className="display-1 mb-6">Composed with the seasons.</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          A curated selection of Cameroonian classics and international plates,
          crafted from local produce and the finest imported ingredients.
        </p>
        <LeafDivider className="mt-12" />
      </div>
    </section>

    {sections.map((sec, idx) => (
      <section key={sec.title} className="pb-24 md:pb-32">
        <div className="container-x grid md:grid-cols-12 gap-12 items-center">
          <div className={`md:col-span-5 reveal ${idx % 2 ? "md:order-2" : ""}`}>
            <div className="aspect-[4/5] overflow-hidden rounded-xl">
              <img src={sec.img} alt={sec.title} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className={`md:col-span-7 reveal ${idx % 2 ? "md:order-1 md:pr-8" : "md:pl-8"}`}>
            <p className="eyebrow mb-3">{sec.note}</p>
            <h2 className="display-2 mb-10">{sec.title}</h2>
            <ul className="divide-y divide-border/60">
              {sec.items.map((it) => (
                <li key={it.name} className="py-5 flex gap-6 items-baseline">
                  <div className="flex-1">
                    <h3 className="font-display text-xl mb-1">{it.name}</h3>
                    <p className="text-sm text-muted-foreground">{it.desc}</p>
                  </div>
                  <span className="font-accent italic text-lg text-primary whitespace-nowrap">{it.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    ))}
  </>
);

export default Menu;
