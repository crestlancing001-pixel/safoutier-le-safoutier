import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, Field, OutBtn, PageHeader, RedBtn, YBtn, inputCls } from "@/components/admin/ui";
import { Modal } from "./MenuAdmin";

type Ev = { id: string; title: string; description: string; tag: string | null; date: string | null; time: string | null; image_url: string | null; is_active: boolean };

export default function AdminEvents() {
  const [items, setItems] = useState<Ev[]>([]);
  const [editing, setEditing] = useState<Partial<Ev> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems((data as Ev[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = { title: editing.title, description: editing.description ?? "", tag: editing.tag || null, date: editing.date || null, time: editing.time || null, image_url: editing.image_url || null, is_active: editing.is_active ?? true };
    const { error } = editing.id
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const del = async (id: string) => { if (!confirm("Delete event?")) return; await supabase.from("events").delete().eq("id", id); toast.success("Deleted"); load(); };
  const toggle = async (e: Ev) => { await supabase.from("events").update({ is_active: !e.is_active }).eq("id", e.id); load(); };

  return (
    <>
      <PageHeader title="Events" subtitle="Toggle visibility on the public site." action={<YBtn onClick={() => setEditing({ is_active: true })}><Plus className="w-4 h-4" /> Add New Event</YBtn>} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((e) => (
          <Card key={e.id} className="p-0 overflow-hidden">
            {e.image_url && <img src={e.image_url} alt={e.title} className="w-full h-44 object-cover" />}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-foreground">{e.title}</h3>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={e.is_active} onChange={() => toggle(e)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-primary relative transition">
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition ${e.is_active ? "translate-x-5" : ""}`} />
                  </div>
                </label>
              </div>
              {e.tag && <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/40 rounded-full px-2 py-0.5 mb-2">{e.tag}</span>}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{e.description}</p>
              <div className="flex gap-2">
                <OutBtn className="h-9 px-3" onClick={() => setEditing(e)}><Pencil className="w-3.5 h-3.5" /> Edit</OutBtn>
                <RedBtn onClick={() => del(e.id)}><Trash2 className="w-3.5 h-3.5" /></RedBtn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Event" : "Add New Event"} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><Field label="Title"><input className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div>
            <Field label="Tag"><input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
            <Field label="Date"><input type="date" className={inputCls} value={editing.date ?? ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field>
            <Field label="Time"><input className={inputCls} value={editing.time ?? ""} onChange={(e) => setEditing({ ...editing, time: e.target.value })} placeholder="7:00 PM" /></Field>
            <Field label="Image URL"><input className={inputCls} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Description"><textarea rows={4} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>
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
