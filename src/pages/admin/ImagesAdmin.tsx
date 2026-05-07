import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Card, PageHeader } from "@/components/admin/ui";

type Img = { id: string; section_key: string; label: string; image_url: string };

export default function AdminImages() {
  const [rows, setRows] = useState<Img[]>([]);
  const load = async () => {
    const { data } = await supabase.from("site_images").select("*").order("section_key");
    setRows((data as Img[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const replace = async (img: Img, file: File) => {
    const path = `site/${img.section_key}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    const { error: e2 } = await supabase.from("site_images").update({ image_url: data.publicUrl }).eq("id", img.id);
    if (e2) return toast.error(e2.message);
    toast.success("Image updated"); load();
  };

  const replaceUrl = async (img: Img, url: string) => {
    if (!url) return;
    await supabase.from("site_images").update({ image_url: url }).eq("id", img.id);
    toast.success("Image updated"); load();
  };

  return (
    <>
      <PageHeader title="Images" subtitle="Replace any image used on the public website." />
      <div className="grid md:grid-cols-2 gap-5">
        {rows.map((img) => (
          <Card key={img.id}>
            <div className="flex items-center gap-4">
              <img src={img.image_url} alt={img.label} className="w-24 h-24 rounded-lg object-cover border border-white/10" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{img.label}</p>
                <p className="text-xs text-muted-foreground truncate">{img.image_url}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-2 cursor-pointer h-10 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:brightness-110 transition">
                <Upload className="w-3.5 h-3.5" /> Replace Image
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && replace(img, e.target.files[0])} />
              </label>
              <input
                placeholder="…or paste URL & blur"
                defaultValue={img.image_url}
                onBlur={(e) => e.target.value !== img.image_url && replaceUrl(img, e.target.value)}
                className="flex-1 bg-[#111] border border-white/15 focus:border-primary outline-none rounded-md px-3 py-2 text-xs text-white"
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
