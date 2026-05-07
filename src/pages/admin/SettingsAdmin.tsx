import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, Field, PageHeader, YBtn, inputCls } from "@/components/admin/ui";

type C = { id: string; restaurant_name: string | null; tagline_en: string | null; tagline_fr: string | null; tripadvisor_url: string | null; facebook_url: string | null; instagram_url: string | null; whatsapp: string | null };

export default function AdminSettings() {
  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [c, setC] = useState<C | null>(null);
  useEffect(() => { supabase.from("contact_info").select("id, restaurant_name, tagline_en, tagline_fr, tripadvisor_url, facebook_url, instagram_url, whatsapp").limit(1).maybeSingle().then(({ data }) => setC(data as C)); }, []);

  const updatePwd = async () => {
    if (pwd.next.length < 8) return toast.error("Password must be ≥ 8 characters");
    if (pwd.next !== pwd.confirm) return toast.error("Passwords do not match");
    const { error } = await supabase.auth.updateUser({ password: pwd.next });
    if (error) return toast.error(error.message);
    toast.success("Password updated"); setPwd({ next: "", confirm: "" });
  };

  const saveSettings = async () => {
    if (!c) return;
    const { error } = await supabase.from("contact_info").update({
      restaurant_name: c.restaurant_name, tagline_en: c.tagline_en, tagline_fr: c.tagline_fr,
      tripadvisor_url: c.tripadvisor_url, facebook_url: c.facebook_url, instagram_url: c.instagram_url,
      whatsapp: c.whatsapp,
    }).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Account and restaurant configuration." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-foreground mb-4">Change Password</h3>
          <div className="space-y-4">
            <Field label="New Password"><input type="password" className={inputCls} value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} /></Field>
            <Field label="Confirm New Password"><input type="password" className={inputCls} value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} /></Field>
            <YBtn onClick={updatePwd}>Update Password</YBtn>
          </div>
        </Card>

        {c && (
          <Card>
            <h3 className="font-bold text-foreground mb-4">Restaurant Info</h3>
            <div className="space-y-4">
              <Field label="Restaurant Name"><input className={inputCls} value={c.restaurant_name ?? ""} onChange={(e) => setC({ ...c, restaurant_name: e.target.value })} /></Field>
              <Field label="Tagline (English)"><input className={inputCls} value={c.tagline_en ?? ""} onChange={(e) => setC({ ...c, tagline_en: e.target.value })} /></Field>
              <Field label="Tagline (Français)"><input className={inputCls} value={c.tagline_fr ?? ""} onChange={(e) => setC({ ...c, tagline_fr: e.target.value })} /></Field>
              <Field label="TripAdvisor URL"><input className={inputCls} value={c.tripadvisor_url ?? ""} onChange={(e) => setC({ ...c, tripadvisor_url: e.target.value })} /></Field>
              <Field label="Facebook URL"><input className={inputCls} value={c.facebook_url ?? ""} onChange={(e) => setC({ ...c, facebook_url: e.target.value })} /></Field>
              <Field label="Instagram URL"><input className={inputCls} value={c.instagram_url ?? ""} onChange={(e) => setC({ ...c, instagram_url: e.target.value })} /></Field>
              <Field label="WhatsApp Number"><input className={inputCls} value={c.whatsapp ?? ""} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} /></Field>
              <YBtn onClick={saveSettings}>Save Settings</YBtn>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
