import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Clock, MapPin, Phone, MessageCircle, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HERO =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80";

const TIMES: string[] = (() => {
  const slots: string[] = [];
  for (let m = 6 * 60 + 30; m <= 22 * 60; m += 30) {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = ((h24 + 11) % 12) + 1;
    slots.push(`${h12}:${min.toString().padStart(2, "0")} ${period}`);
  }
  return slots;
})();

const GUESTS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];
const OCCASIONS = [
  "No special occasion",
  "Birthday",
  "Anniversary",
  "Business Dinner",
  "Wedding Reception",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(30),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time"),
  guests: z.string().min(1, "Please select number of guests"),
  occasion: z.string().min(1, "Please select an occasion"),
  requests: z.string().max(1000).optional(),
});

const Reservations = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      date,
      time,
      guests,
      occasion,
      requests: fd.get("requests") || "",
    });
    if (!result.success) {
      const flat: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        flat[i.path[0] as string] = i.message;
      });
      setErrors(flat);
      return;
    }
    setErrors({});
    toast.success("Thank you! We will confirm your reservation within 2 hours.");
    (e.target as HTMLFormElement).reset();
    setDate(undefined);
    setTime("");
    setGuests("");
    setOccasion("");
  };

  const errClass = "text-primary text-xs mt-1.5 font-accent italic";
  const inputCls =
    "bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary text-cream placeholder:text-muted-foreground/60";

  return (
    <>
      {/* HERO */}
      <section className="relative h-[40vh] min-h-[300px] -mt-20 w-full overflow-hidden flex items-center justify-center">
        <img src={HERO} alt="Candlelit table" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/[0.6]" />
        <div className="relative z-10 text-center container-x pt-20">
          <h1 className="font-display text-cream text-5xl md:text-7xl">Reserve Your Table</h1>
          <p className="font-accent italic text-primary text-xl md:text-2xl mt-4">
            We look forward to welcoming you
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT — FORM */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-primary text-4xl md:text-5xl mb-2">Book a Table</h2>
            <p className="text-muted-foreground mb-10">
              Fill in the details below and our team will reach out to confirm.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <Label htmlFor="name" className="text-cream/90 mb-2 inline-block">Full Name</Label>
                <Input id="name" name="name" maxLength={100} className={inputCls} />
                {errors.name && <p className={errClass}>{errors.name}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-cream/90 mb-2 inline-block">Email Address</Label>
                  <Input id="email" name="email" type="email" maxLength={255} className={inputCls} />
                  {errors.email && <p className={errClass}>{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-cream/90 mb-2 inline-block">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+237..." maxLength={30} className={inputCls} />
                  {errors.phone && <p className={errClass}>{errors.phone}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-cream/90 mb-2 inline-block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-10 normal-case tracking-normal",
                          inputCls,
                          !date && "text-muted-foreground/60"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < today}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className={errClass}>{errors.date}</p>}
                </div>

                <div>
                  <Label className="text-cream/90 mb-2 inline-block">Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className={inputCls}><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.time && <p className={errClass}>{errors.time}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-cream/90 mb-2 inline-block">Number of Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className={inputCls}><SelectValue placeholder="Select guests" /></SelectTrigger>
                    <SelectContent>
                      {GUESTS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.guests && <p className={errClass}>{errors.guests}</p>}
                </div>
                <div>
                  <Label className="text-cream/90 mb-2 inline-block">Occasion</Label>
                  <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger className={inputCls}><SelectValue placeholder="Select occasion" /></SelectTrigger>
                    <SelectContent>
                      {OCCASIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.occasion && <p className={errClass}>{errors.occasion}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="requests" className="text-cream/90 mb-2 inline-block">Special Requests</Label>
                <Textarea id="requests" name="requests" rows={4} maxLength={1000} className={inputCls} />
              </div>

              <Button type="submit" variant="terracotta" size="lg" className="w-full">
                Confirm Reservation
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Or call us directly at <a href="tel:+237650002929" className="text-primary hover:underline">+237 650 002 929</a>
              </p>
            </form>
          </div>

          {/* RIGHT — INFO */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-card border border-primary/40 rounded-xl p-7 space-y-6">
              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-display text-xl text-cream mb-1.5">Opening Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon–Sun: 6:30 AM – 11:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sunday Brunch: 12:00 PM – 4:00 PM</p>
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-display text-xl text-cream mb-1.5">Find Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Hilton Yaoundé, Boulevard du 20 Mai<br />Yaoundé, Cameroon
                  </p>
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-display text-xl text-cream mb-1.5">Call Us</h3>
                  <p className="text-sm"><a href="tel:+237677011785" className="text-muted-foreground hover:text-primary">+237 677 011 785</a></p>
                  <p className="text-sm"><a href="tel:+237681137452" className="text-muted-foreground hover:text-primary">+237 681 137 452</a></p>
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex gap-4">
                <MessageCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-display text-xl text-cream mb-2">WhatsApp</h3>
                  <Button asChild variant="terracotta" size="sm">
                    <a href="https://wa.me/237681137452" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/60">
              <iframe
                title="Hilton Yaoundé location"
                src="https://www.google.com/maps?q=Hilton+Yaounde,+Boulevard+du+20+Mai,+Yaounde,+Cameroon&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-center gap-4 bg-card border border-primary/30 rounded-xl py-4 px-5">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-display text-xl text-primary">4.7</span>
              <span className="text-xs text-muted-foreground">·</span>
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs text-cream/85">Travelers' Choice · #3 in Yaoundé</span>
            </div>
          </aside>
        </div>
      </section>

      {/* GROUP BANNER */}
      <section className="bg-accent text-accent-foreground py-16 md:py-20">
        <div className="container-x text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            Planning a large event or group dinner?
          </h2>
          <p className="mt-4 text-lg text-accent-foreground/85">
            We accommodate groups of 20 to 200 guests.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-transparent border border-cream text-cream hover:bg-cream hover:text-cream-foreground"
            >
              <Link to="/contact">Contact Us for Group Bookings</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reservations;
