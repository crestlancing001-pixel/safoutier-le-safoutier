import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, Field, PageHeader, YBtn, inputCls } from "@/components/admin/ui";

type C = {
  id: string; phone1: string | null; phone2: string | null; whatsapp: string | null;
  address: string | null; email: string | null; hours: string | null; map_url: string | null;
  restaurant_name: string | null; tagline_en: string | null; tagline_fr: string | null;
  tripadvisor_url: string | null; facebook_url: string | null; instagram_url: string | null;
};

export default function AdminContact() {
  const [c, setC] = useState<C | null>(null);
  useEffect(() => {
    supabase.from("contact_info").select("*").limit(1).maybeSingle().then(({ data }) => setC(data as C));
  }, []);

  const save = async () => {
    if (!c) return;
    const { error } = await supabase.from("contact_info").update({
      phone1: c.phone1, phone2: c.phone2, whatsapp: c.whatsapp, address: c.address, email: c.email,
      hours: c.hours, map_url: c.map_url,
    }).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Contact info updated");
  };

  if (!c) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Contact Info" subtitle="Updates apply instantly to the public website." />
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primary Phone"><input className={inputCls} value={c.phone1 ?? ""} onChange={(e) => setC({ ...c, phone1: e.target.value })} /></Field>
          <Field label="Secondary Phone"><input className={inputCls} value={c.phone2 ?? ""} onChange={(e) => setC({ ...c, phone2: e.target.value })} /></Field>
          <Field label="WhatsApp Number"><input className={inputCls} value={c.whatsapp ?? ""} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={c.email ?? ""} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Address"><input className={inputCls} value={c.address ?? ""} onChange={(e) => setC({ ...c, address: e.target.value })} /></Field></div>
          <div className="md:col-span-2"><Field label="Opening Hours"><input className={inputCls} value={c.hours ?? ""} onChange={(e) => setC({ ...c, hours: e.target.value })} /></Field></div>
          <div className="md:col-span-2"><Field label="Google Maps Embed URL"><input className={inputCls} value={c.map_url ?? ""} onChange={(e) => setC({ ...c, map_url: e.target.value })} /></Field></div>
        </div>
        <div className="mt-6"><YBtn onClick={save}>Save All Changes</YBtn></div>
      </Card>
    </>
  );
}
