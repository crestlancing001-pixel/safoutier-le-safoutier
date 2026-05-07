import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";

export default function AdminLogin() {
  const { signIn, session, isAdmin, loading } = useAdminAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setErr("Invalid email or password.");
      return;
    }
    nav("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111111] p-6">
      <div className="w-full max-w-[420px] bg-[#1A1A1A] rounded-2xl p-8 md:p-12 border border-white/10 border-t-[3px] border-t-primary">
        <h1 className="font-body text-[28px] font-black uppercase text-primary tracking-tight">LE SAFOUTIER</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin Portal</p>
        <div className="h-px bg-primary/30 my-6" />
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider text-foreground/80 block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-white/15 focus:border-primary outline-none rounded-lg px-4 py-4 text-[15px] text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-foreground/80 block mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111111] border border-white/15 focus:border-primary outline-none rounded-lg px-4 py-4 text-[15px] text-white"
            />
          </div>
          {err && <p className="text-sm font-medium" style={{ color: "#E05C5C" }}>{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full h-14 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-[0.05em] text-sm hover:brightness-110 transition disabled:opacity-70 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "Authenticating…" : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
