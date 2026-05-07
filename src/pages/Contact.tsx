import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Star,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=2000&q=80";

const MAPS_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=Hilton+Yaounde%2C+Boulevard+du+20+Mai%2C+Yaounde%2C+Cameroon";
const TRIPADVISOR =
  "https://www.tripadvisor.com/Restaurant_Review-g293824-Le_Safoutier-Yaounde.html";

const SUBJECTS = [
  "General Inquiry",
  "Group Booking",
  "Press & Media",
  "Feedback",
  "Other",
];

// DEFAULT contact info fallback
const DEFAULT_CONTACT = {
  phone1: "+237 650 002 929",
  phone2: "+237 222 233 646",
  whatsapp: "237681137452",
  whatsapp_display: "+237 681 137 452",
  address: "Hilton Yaoundé, Boulevard du 20 Mai\nYaoundé, Cameroon",
  hours_weekday: "Monday–Sunday: 6:30 AM – 11:00 PM",
  hours_brunch: "Sunday Brunch: 12:00 PM – 4:00 PM",
  map_url:
    "https://www.google.com/maps?q=Hilton+Yaounde,+Boulevard+du+20+Mai,+Yaounde,+Cameroon&output=embed",
};

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255),
  subject: z.string().min(1, "Please select a subject"),
  message: z
    .string()
    .trim()
    .min(5, "Please write a message")
    .max(2000),
});

// HOOK — fetches contact info from Supabase
const useContactInfo = () => {
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [heroImg, setHeroImg] = useState(HERO_DEFAULT);
  const [loading, setLoading] = useState(true);

  const fetchContact = async () => {
    try {
      // Fetch contact info
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setContact({
          phone1: data.phone1 || DEFAULT_CONTACT.phone1,
          phone2: data.phone2 || DEFAULT_CONTACT.phone2,
          whatsapp:
            data.whatsapp?.replace(/\D/g, "") ||
            DEFAULT_CONTACT.whatsapp,
          whatsapp_display:
            data.whatsapp || DEFAULT_CONTACT.whatsapp_display,
          address:
            data.address || DEFAULT_CONTACT.address,
          hours_weekday:
            data.hours || DEFAULT_CONTACT.hours_weekday,
          hours_brunch:
            data.hours_brunch ||
            DEFAULT_CONTACT.hours_brunch,
          map_url:
            data.map_url || DEFAULT_CONTACT.map_url,
        });
      }

      // Fetch hero image
      const { data: imgData } = await supabase
        .from("site_images")
        .select("image_url")
        .eq("section", "contact_hero")
        .single();

      if (imgData?.image_url) {
        setHeroImg(imgData.image_url);
      }
    } catch (err) {
      console.error("Error fetching contact info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();

    // REAL TIME — contact info changes
    const contactChannel = supabase
      .channel("contact_info_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_info",
        },
        () => fetchContact()
      )
      .subscribe();

    // REAL TIME — image changes
    const imgChannel = supabase
      .channel("site_images_contact")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_images",
        },
        () => fetchContact()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contactChannel);
      supabase.removeChannel(imgChannel);
    };
  }, []);

  return { contact, heroImg, loading };
};

const Contact = () => {
  const { contact, heroImg, loading } = useContactInfo();
  const [subject, setSubject] = useState("");
  const [errors, setErrors] = useState
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (field: string, value: unknown) => {
    const partial = {
      name: "",
      email: "",
      subject: "",
      message: "",
      [field]: value,
    };
    const result = schema.safeParse(partial);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.path[0] === field
        );
        if (issue) next[field] = issue.message;
      }
      return next;
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (isSubmitting) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject,
      message: fd.get("message"),
    });
    if (!result.success) {
      const flat: Record<string, string> = {};
      result.error.issues.forEach(
        (i) => (flat[i.path[0] as string] = i.message)
      );
      setErrors(flat);
      const firstKey = result.error.issues[0]
        ?.path[0] as string | undefined;
      if (firstKey) {
        const el = form.querySelector<HTMLElement>(
          `[name="${firstKey}"]`
        );
        el?.focus();
      }
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      // Save message to Supabase
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: result.data.name,
          email: result.data.email,
          subject: result.data.subject,
          message: result.data.message,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(
        "Message received. We will reply within 24 hours."
      );
      form.reset();
      setSubject("");
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        const first =
          form.querySelector<HTMLElement>('[name="name"]');
        first?.focus();
      }, 2200);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const errClass =
    "text-destructive text-xs mt-1.5 font-medium";
  const darkInput =
    "bg-surface2 border-foreground/15 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground/70 h-12 rounded-md";

  const whatsappUrl = `https://wa.me/${contact.whatsapp}`;

  return (
    <>
      {/* HERO */}
      <section className="relative h-[40vh] min-h-[300px] 
      -mt-20 w-full overflow-hidden flex items-center 
      justify-center">
        {loading ? (
          <div className="absolute inset-0 bg-gray-900 
          animate-pulse" />
        ) : (
          <img
            src={heroImg}
            alt="Hilton Yaoundé entrance"
            className="absolute inset-0 w-full h-full 
            object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                HERO_DEFAULT;
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center 
        container-x pt-20">
          <h1
            className="font-body font-black uppercase 
            text-primary leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
            }}
          >
            GET IN TOUCH
          </h1>
          <p className="text-foreground/85 text-base 
          md:text-lg mt-4">
            We are here to make your visit extraordinary
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="bg-background py-20 md:py-24">
        <div className="container-x grid md:grid-cols-3 
        gap-6 md:gap-8">
          {/* Phone */}
          <article className="bg-surface2 border 
          border-foreground/10 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 
            rounded-full bg-primary/15 items-center 
            justify-center mb-5">
              <Phone className="w-5 h-5 text-primary" />
            </span>
            <h3 className="text-xl font-bold 
            text-foreground mb-3">
              Call Us
            </h3>
            <div className="space-y-1 
            text-muted-foreground text-sm">
              <p>
                
                  href={`tel:${contact.phone1.replace(/\s/g, "")}`}
                  className="hover:text-primary"
                >
                  {loading ? (
                    <span className="animate-pulse 
                    bg-gray-700 rounded h-4 w-36 
                    inline-block" />
                  ) : (
                    contact.phone1
                  )}
                </a>
              </p>
              <p>
                
                  href={`tel:${contact.phone2.replace(/\s/g, "")}`}
                  className="hover:text-primary"
                >
                  {loading ? (
                    <span className="animate-pulse 
                    bg-gray-700 rounded h-4 w-36 
                    inline-block" />
                  ) : (
                    contact.phone2
                  )}
                </a>
              </p>
            </div>
          </article>

          {/* WhatsApp */}
          <article className="bg-surface2 border 
          border-foreground/10 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 
            rounded-full bg-primary/15 items-center 
            justify-center mb-5">
              <MessageCircle className="w-5 h-5 
              text-primary" />
            </span>
            <h3 className="text-xl font-bold 
            text-foreground mb-3">
              Chat with Us
            </h3>
            <p className="text-muted-foreground 
            text-sm mb-5">
              {loading ? (
                <span className="animate-pulse 
                bg-gray-700 rounded h-4 w-36 
                inline-block" />
              ) : (
                contact.whatsapp_display
              )}
            </p>
            <Button
              asChild
              size="sm"
              className="bg-whatsapp text-whatsapp-foreground 
              hover:brightness-110"
            >
              
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open WhatsApp
              </a>
            </Button>
          </article>

          {/* Hours */}
          <article className="bg-surface2 border 
          border-foreground/10 rounded-xl p-8 reveal">
            <span className="inline-flex w-12 h-12 
            rounded-full bg-primary/15 items-center 
            justify-center mb-5">
              <Clock className="w-5 h-5 text-primary" />
            </span>
            <h3 className="text-xl font-bold 
            text-foreground mb-3">
              Opening Hours
            </h3>
            <div className="space-y-1 
            text-muted-foreground text-sm">
              <p>
                {loading ? (
                  <span className="animate-pulse 
                  bg-gray-700 rounded h-4 w-48 
                  inline-block" />
                ) : (
                  contact.hours_weekday
                )}
              </p>
              <p>
                {loading ? (
                  <span className="animate-pulse 
                  bg-gray-700 rounded h-4 w-40 
                  inline-block" />
                ) : (
                  contact.hours_brunch
                )}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* FIND US — yellow */}
      <section className="bg-primary text-primary-foreground 
      py-20 md:py-[100px]">
        <div className="container-x grid lg:grid-cols-2 
        gap-12 lg:gap-16">
          {/* LEFT — DETAILS */}
          <div>
            <h2
              className="font-body font-extrabold mb-8 
              leading-[1.05]"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              }}
            >
              Find Us
            </h2>

            <div className="space-y-6 text-base">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Address</p>
                  <p className="opacity-85 whitespace-pre-line">
                    {loading ? (
                      <span className="animate-pulse 
                      bg-yellow-600/30 rounded h-4 w-56 
                      inline-block" />
                    ) : (
                      contact.address
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Phone</p>
                  <p className="opacity-85">
                    
                      href={`tel:${contact.phone1.replace(/\s/g, "")}`}
                      className="hover:underline"
                    >
                      {contact.phone1}
                    </a>
                  </p>
                  <p className="opacity-85">
                    
                      href={`tel:${contact.phone2.replace(/\s/g, "")}`}
                      className="hover:underline"
                    >
                      {contact.phone2}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Hours</p>
                  <p className="opacity-85">
                    {contact.hours_weekday}
                  </p>
                  <p className="opacity-85">
                    {contact.hours_brunch}
                  </p>
                </div>
              </div>
            </div>

            
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-ring relative inline-flex 
              items-center gap-3 mt-10 bg-whatsapp 
              text-whatsapp-foreground px-6 py-3 
              rounded-full font-bold uppercase 
              tracking-[0.05em] text-sm 
              hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* RIGHT — MAP */}
          <div>
            <div
              className="rounded-2xl overflow-hidden 
              border-[3px] border-primary-foreground"
              style={{ height: 460 }}
            >
              <iframe
                title="Hilton Yaoundé location"
                src={contact.map_url}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="mt-6">
              <Button asChild variant="dark">
                
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEND MESSAGE FORM */}
      <section className="bg-background py-20 
      md:py-[100px]">
        <div className="container-x max-w-3xl mx-auto">
          <h2
            className="font-body font-extrabold 
            text-foreground mb-3 leading-[1.05] 
            text-center"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
            }}
          >
            Send Us a Message
          </h2>
          <p className="text-muted-foreground 
          text-center mb-10">
            We'll reply within 24 hours.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <div>
              <Label
                htmlFor="name"
                className="text-foreground/90 mb-2 
                inline-block text-xs uppercase 
                tracking-wider"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                maxLength={100}
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "name-error" : undefined
                }
                onBlur={(e) =>
                  validateField("name", e.target.value)
                }
                onChange={(e) =>
                  errors.name &&
                  validateField("name", e.target.value)
                }
                className={darkInput}
              />
              {errors.name && (
                <p id="name-error" className={errClass}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-foreground/90 mb-2 
                inline-block text-xs uppercase 
                tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                maxLength={255}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "email-error" : undefined
                }
                onBlur={(e) =>
                  validateField("email", e.target.value)
                }
                onChange={(e) =>
                  errors.email &&
                  validateField("email", e.target.value)
                }
                className={darkInput}
              />
              {errors.email && (
                <p id="email-error" className={errClass}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label
                className="text-foreground/90 mb-2 
                inline-block text-xs uppercase 
                tracking-wider"
              >
                Subject
              </Label>
              <Select
                value={subject}
                onValueChange={(v) => {
                  setSubject(v);
                  validateField("subject", v);
                }}
              >
                <SelectTrigger
                  aria-invalid={!!errors.subject}
                  className={darkInput}
                >
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className={errClass}>{errors.subject}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="message"
                className="text-foreground/90 mb-2 
                inline-block text-xs uppercase 
                tracking-wider"
              >
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                maxLength={2000}
                aria-invalid={!!errors.message}
                aria-describedby={
                  errors.message
                    ? "message-error"
                    : undefined
                }
                onBlur={(e) =>
                  validateField("message", e.target.value)
                }
                onChange={(e) =>
                  errors.message &&
                  validateField("message", e.target.value)
                }
                className={`${darkInput} h-auto`}
              />
              {errors.message && (
                <p
                  id="message-error"
                  className={errClass}
                >
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={isSubmitting || isSuccess}
              aria-live="polite"
            >
              {isSuccess ? (
                <span className="inline-flex 
                items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Message Sent
                </span>
              ) : isSubmitting ? (
                "Sending…"
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* TRIPADVISOR */}
      <section className="bg-surface2 py-20 
      md:py-[100px]">
        <div className="container-x text-center 
        max-w-4xl mx-auto">
          <h2
            className="font-body font-extrabold 
            text-primary mb-12 leading-[1.05]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
            }}
          >
            We Are Proud to Be Recognized
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Star, label: "4.7★", sub: "Rating" },
              {
                icon: Users,
                label: "341",
                sub: "Reviews",
              },
              {
                icon: Award,
                label: "#3 of 148",
                sub: "Restaurants in Yaoundé",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={sub}
                className="bg-background border 
                border-foreground/10 rounded-xl p-8"
              >
                <Icon className="w-7 h-7 text-primary 
                mx-auto mb-4" />
                <p className="text-3xl font-extrabold 
                text-foreground">
                  {label}
                </p>
                <p className="text-xs uppercase 
                tracking-widest text-muted-foreground mt-2">
                  {sub}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mb-8">
            Travelers' Choice Award Winner · Read our 
            reviews on TripAdvisor
          </p>
          <Button asChild size="lg">
            
              href={TRIPADVISOR}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Our Reviews
            </a>
          </Button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary 
      text-primary-foreground py-24 md:py-28">
        <div className="container-x text-center 
        max-w-3xl mx-auto">
          <h2
            className="font-body font-extrabold 
            leading-tight"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Your next great meal is waiting.
          </h2>
          <div className="mt-10">
            <Button asChild size="lg" variant="dark">
              <Link to="/reservations">
                Reserve a Table
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
