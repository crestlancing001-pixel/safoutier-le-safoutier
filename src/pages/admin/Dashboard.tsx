import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, PageHeader } from "@/components/admin/ui";

export default function AdminDashboard() {
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({ res: 0, menu: 0, test: 0, ev: 0 });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      const today = new Date(); today.setHours(0,0,0,0);
      const [{ count: res }, { count: menu }, { count: test }, { count: ev }] = await Promise.all([
        supabase.from("reservations").select("*", { count: "exact", head: true }).gte("date", today.toISOString().slice(0,10)),
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
      ]);
      setStats({ res: res ?? 0, menu: menu ?? 0, test: test ?? 0, ev: ev ?? 0 });
    };
    load();
  }, []);

  const cards = [
    { label: "Reservations Today", value: stats.res },
    { label: "Menu Items", value: stats.menu },
    { label: "Testimonials", value: stats.test },
    { label: "Events", value: stats.ev },
  ];

  return (
    <>
      <PageHeader
        title="Welcome back, Admin 👋"
        subtitle={now.toLocaleString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Card key={c.label} className="px-7 py-8">
            <p className="font-body text-[42px] font-black text-primary leading-none">{c.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-3">{c.label}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
