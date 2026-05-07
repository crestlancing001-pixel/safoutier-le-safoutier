import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/PageLoader";
import { AdminAuthProvider } from "@/lib/admin/auth";
import AdminLayout, { AdminGuard } from "@/components/admin/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMenu from "./pages/admin/MenuAdmin";
import AdminReservations from "./pages/admin/ReservationsAdmin";
import AdminEvents from "./pages/admin/EventsAdmin";
import AdminTestimonials from "./pages/admin/TestimonialsAdmin";
import AdminImages from "./pages/admin/ImagesAdmin";
import AdminContact from "./pages/admin/ContactAdmin";
import AdminSettings from "./pages/admin/SettingsAdmin";

const queryClient = new QueryClient();

const PublicShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <Layout>{children}</Layout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <PageLoaderGate />
          <PublicShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </PublicShell>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const PageLoaderGate = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <PageLoader />;
};

export default App;
