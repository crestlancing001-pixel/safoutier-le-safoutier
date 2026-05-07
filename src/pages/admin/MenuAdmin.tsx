import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { Card, Field, OutBtn, PageHeader, RedBtn, YBtn, inputCls } from "@/components/admin/ui";

type Item = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  tag: string | null;
  image_url: string | null;
};

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Buffet Themes", "Drinks & Wine"];

export default function AdminMenu() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("menu_items").select("*").order("category").order("sort_order");
    setItems((data as Item[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(
    () => filter === "all" ? items : items.filter((i) => i.category === filter),
    [items, filter],
  );

  const onSave = async () => {
    if (!editing?.name || !editing?.category) return toast.error("Name and category are required");
    const payload = {
      name: editing.name, description: editing.description ?? "", price: editing.price ?? "",
      category: editing.category, tag: editing.tag || null, image_url: editing.image_url || null,
    };
    const { error } = editing.id
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null); load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this dish?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  const onUpload = async (file: File) => {
    const path = `menu/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setEditing((p) => ({ ...p!, image_url: data.publicUrl }));
  };

  return (
    <>
      <PageHeader
        title="Menu Management"
        subtitle="Add, edit and remove dishes. Changes appear on the public website instantly."
        action={<YBtn onClick={() => setEditing({ category: "Breakfast" })}><Plus className="w-4 h-4" /> Add New Dish</YBtn>}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition ${
              filter === c ? "bg-primary text-primary-foreground border-primary" : "border-white/15 text-foreground/75 hover:border-primary hover:text-primary"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/10">
            <tr>
              <th className="py-3 pr-3">Image</th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3">Category</th>
              <th className="py-3 pr-3">Price</th>
              <th className="py-3 pr-3">Tag</th>
              <th className="py-3 pr-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.id} className="border-b border-white/5">
                <td className="py-3 pr-3">{i.image_url && <img src={i.image_url} alt="" className="w-12 h-12 rounded object-cover" />}</td>
                <td className="py-3 pr-3 font-medium text-foreground">{i.name}</td>
                <td className="py-3 pr-3 text-muted-foreground">{i.category}</td>
                <td className="py-3 pr-3 text-primary font-semibold">{i.price}</td>
                <td className="py-3 pr-3 text-muted-foreground">{i.tag}</td>
                <td className="py-3 pr-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(i)} className="text-primary hover:underline inline-flex items-center gap-1 text-xs font-bold uppercase"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    <RedBtn onClick={() => onDelete(i.id)}><Trash2 className="w-3.5 h-3.5" /></RedBtn>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No dishes</td></tr>}
          </tbody>
        </table>
      </Card>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Dish" : "Add New Dish"}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Dish Name"><input className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Category">
              <select className={inputCls} value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Price"><input className={inputCls} value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="e.g. 9 500 XAF" /></Field>
            <Field label="Tag (optional)"><input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Description"><textarea rows={3} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Image URL"><input className={inputCls} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field></div>
            <div className="md:col-span-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-primary border border-primary/40 rounded-md px-4 h-10 hover:bg-primary hover:text-primary-foreground transition">
                <Upload className="w-3.5 h-3.5" /> Upload Image
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
              </label>
              {editing.image_url && <img src={editing.image_url} alt="" className="w-16 h-16 rounded object-cover" />}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <OutBtn onClick={() => setEditing(null)}>Cancel</OutBtn>
            <YBtn onClick={onSave}>Save Changes</YBtn>
          </div>
        </Modal>
      )}
    </>
  );
}

export const Modal = ({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80">
    <div className="bg-[#1A1A1A] border border-white/10 border-t-[3px] border-t-primary rounded-none md:rounded-xl w-full md:max-w-2xl max-h-screen md:max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <h3 className="font-body text-lg font-extrabold text-foreground">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
