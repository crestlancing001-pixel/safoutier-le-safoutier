import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Download, Eye } from "lucide-react";
import { Card, OutBtn, PageHeader, RedBtn } from "@/components/admin/ui";
import { Modal } from "./MenuAdmin";

type Res = {
  id: string; full_name: string; email: string; phone: string;
  date: string; time: string; guests: string; occasion: string | null;
  special_requests: string | null; status: string; created_at: string;
};

const STATUSES = ["pending", "confirmed", "cancelled"] as const;
const colorOf = (s: string) =>
  s === "confirmed" ? "bg-green-500/20 text-green-400" :
  s === "cancelled" ? "bg-red-500/20 text-red-400" :
  "bg-yellow-500/20 text-yellow-400";

export default function AdminReservations() {
  const [rows, setRows] = useState<Res[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<Res | null>(null);

  const load = async () => {
    const { data } = await supabase.from("reservations").select("*").order("date", { ascending: false }).order("time");
    setRows((data as Res[]) ?? []);
  };
  useEffect(() => {
    load();
    const ch = supabase.channel("res-admin").on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const visible = useMemo(() => rows.filter((r) =>
    (status === "all" || r.status === status) &&
    (!q || r.full_name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q))
  ), [rows, q, status]);

  const summary = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  const setRowStatus = async (id: string, s: string) => {
    const { error } = await supabase.from("reservations").update({ status: s }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    await supabase.from("reservations").delete().eq("id", id);
  };

  const exportCsv = () => {
    const header = ["Name","Email","Phone","Date","Time","Guests","Occasion","Status","Created"];
    const lines = [header.join(",")].concat(visible.map((r) => [r.full_name,r.email,r.phone,r.date,r.time,r.guests,r.occasion??"",r.status,r.created_at].map((x) => `"${String(x).replace(/"/g,'""')}"`).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "reservations.csv"; a.click();
  };

  return (
    <>
      <PageHeader
        title="Reservations"
        subtitle="Manage incoming reservations in real time."
        action={<OutBtn onClick={exportCsv}><Download className="w-4 h-4" /> Export CSV</OutBtn>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[["Total", summary.total], ["Pending", summary.pending], ["Confirmed", summary.confirmed], ["Cancelled", summary.cancelled]].map(([l, v]) => (
          <Card key={l as string} className="px-5 py-5">
            <p className="font-body text-3xl font-black text-primary">{v as number}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          placeholder="Search by name or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-[#1A1A1A] border border-white/15 focus:border-primary outline-none rounded-md px-4 py-3 text-sm text-white"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="bg-[#1A1A1A] border border-white/15 focus:border-primary outline-none rounded-md px-4 py-3 text-sm text-white">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-4 px-5">Name</th><th className="py-4 px-5">Phone</th>
              <th className="py-4 px-5">Date</th><th className="py-4 px-5">Time</th>
              <th className="py-4 px-5">Guests</th><th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-4 px-5 font-medium text-foreground">{r.full_name}</td>
                <td className="py-4 px-5 text-muted-foreground">{r.phone}</td>
                <td className="py-4 px-5">{r.date}</td>
                <td className="py-4 px-5">{r.time}</td>
                <td className="py-4 px-5">{r.guests}</td>
                <td className="py-4 px-5">
                  <select value={r.status} onChange={(e) => setRowStatus(r.id, e.target.value)} className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${colorOf(r.status)} border-0 outline-none`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-4 px-5">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setView(r)} className="text-primary text-xs font-bold uppercase inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</button>
                    <RedBtn onClick={() => onDelete(r.id)}><Trash2 className="w-3.5 h-3.5" /></RedBtn>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No reservations</td></tr>}
          </tbody>
        </table>
      </Card>

      {view && (
        <Modal title="Reservation Details" onClose={() => setView(null)}>
          <div className="space-y-3 text-sm">
            {[
              ["Name", view.full_name], ["Email", view.email], ["Phone", view.phone],
              ["Date", view.date], ["Time", view.time], ["Guests", view.guests],
              ["Occasion", view.occasion ?? "—"], ["Status", view.status],
              ["Special Requests", view.special_requests ?? "—"],
              ["Submitted", new Date(view.created_at).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k as string} className="grid grid-cols-3 gap-3 border-b border-white/5 pb-2">
                <span className="text-muted-foreground uppercase text-xs">{k}</span>
                <span className="col-span-2 text-foreground">{v as string}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
