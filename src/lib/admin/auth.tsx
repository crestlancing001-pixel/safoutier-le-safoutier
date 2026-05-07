import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);
const IDLE_KEY = "admin_last_activity";
const IDLE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24h

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => checkAdmin(s.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) checkAdmin(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 24h inactivity expiry
  useEffect(() => {
    if (!session) return;
    const touch = () => localStorage.setItem(IDLE_KEY, String(Date.now()));
    const last = Number(localStorage.getItem(IDLE_KEY) ?? 0);
    if (last && Date.now() - last > IDLE_LIMIT_MS) {
      supabase.auth.signOut();
      return;
    }
    touch();
    const events = ["click", "keydown", "mousemove", "scroll"];
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, touch));
  }, [session]);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) await checkAdmin(data.user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(IDLE_KEY);
  };

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, isAdmin, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAdminAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return v;
};
