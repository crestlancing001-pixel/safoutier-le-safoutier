import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  useScrollReveal();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};
