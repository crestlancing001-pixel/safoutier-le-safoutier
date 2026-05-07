import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Card, Field, OutBtn, PageHeader, RedBtn, YBtn, inputCls } from "@/components/admin/ui";
import { Modal } from "./MenuAdmin";

type T = { id: string; author_name: string; guest_detail: string | null; quote: string; stars: number; is_visible: boolean };

export default function AdminTestimonials() {
  const [rows, setRows] = useState<T[]>([]);
  const [editing, setEditing] = useState<Partial<T> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setRows((data as T[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.author_name || !editing?.quote) return toast.error("Author and quote required");
    const payload = { author_name: editing.author_name, guest_detail: editing.guest_detail ?? null, quote: editing.quote, stars: editing.stars ?? 5, is_visible: editing.is_visible ?? true };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const del = async (id: string) => { if (!confirm("Delete review?")) return; await supabase.from("testimonials").delete().eq("id", id); load(); };
  const toggle = async (t: T) => { await supabase.from("testimonials").update({ is_visible: !t.is_visible }).eq("id", t.id); load(); };

  return (
    <>
      <PageHeader title="Testimonials" subtitle="Reviews shown on the public homepage." action={<YBtn onClick={() => setEditing({ stars: 5, is_visible: true })}><Plus className="w-4 h-4" /> Add New Review</YBtn>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="py-4 px-5">Author</th><th className="py-4 px-5">Stars</th><th className="py-4 px-5">Quote</th><th className="py-4 px-5">Visible</th><th className="py-4 px-5 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-white/5">
                <td className="py-4 px-5 font-medium text-foreground">{t.author_name}<div className="text-xs text-muted-foreground">{t.guest_detail}</div></td>
                <td className="py-4 px-5"><div className="flex">{Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />)}</div></td>
                <td className="py-4 px-5 text-muted-foreground max-w-md"><p className="line-clamp-2">{t.quote}</p></td>
                <td className="py-4 px-5">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={t.is_visible} onChange={() => toggle(t)} className="sr-only peer" />
                    <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-primary relative transition">
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition ${t.is_visible ? "translate-x-5" : ""}`} />
                    </div>
                  </label>
                </td>
                <td className="py-4 px-5">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(t)} className="text-primary text-xs font-bold uppercase inline-flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    <RedBtn onClick={() => del(t.id)}><Trash2 className="w-3.5 h-3.5" /></RedBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {editing && (
        <Modal title={editing.id ? "Edit Review" : "Add New Review"} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Author"><input className={inputCls} value={editing.author_name ?? ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></Field>
            <Field label="Detail (e.g. city, date)"><input className={inputCls} value={editing.guest_detail ?? ""} onChange={(e) => setEditing({ ...editing, guest_detail: e.target.value })} /></Field>
            <Field label="Stars">
              <select className={inputCls} value={editing.stars ?? 5} onChange={(e) => setEditing({ ...editing, stars: Number(e.target.value) })}>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2"><Field label="Quote"><textarea rows={4} className={inputCls} value={editing.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></Field></div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <OutBtn onClick={() => setEditing(null)}>Cancel</OutBtn>
            <YBtn onClick={save}>Save</YBtn>
          </div>
        </Modal>
      )}
    </>
  );
}
