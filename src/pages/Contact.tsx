import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LeafDivider } from "@/components/SafouLeaf";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast({ title: "Message sent", description: "We'll reply within 24 hours." });
    }, 700);
  };

  return (
    <>
      <section className="section-y">
        <div className="container-x text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="display-1 mb-6">We'd love to hear from you.</h1>
          <p className="text-muted-foreground text-lg">
            Questions, private events, or special requests — reach out anytime.
          </p>
          <LeafDivider className="mt-12" />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-x grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 reveal space-y-8">
            <div className="p-6 rounded-xl bg-surface2">
              <h3 className="font-display text-2xl mb-5 text-primary">Reach Us</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" /> Hilton Yaoundé · Boulevard du 20 Mai, Yaoundé, Cameroon</li>
                <li className="flex gap-3"><Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" /> <a href="tel:+237677011785" className="hover:text-primary">+237 677 011 785</a></li>
                <li className="flex gap-3"><Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" /> <a href="tel:+237681137452" className="hover:text-primary">+237 681 137 452</a></li>
                <li className="flex gap-3"><MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" /> <a href="https://wa.me/237681137452" target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp +237 681 137 452</a></li>
                <li className="flex gap-3"><Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" /> <a href="mailto:lesafoutier@hilton.com" className="hover:text-primary">lesafoutier@hilton.com</a></li>
                <li className="flex gap-3"><Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" /> Monday – Sunday · 6:30 AM – 11:00 PM</li>
              </ul>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/60">
              <iframe
                title="Hilton Yaoundé map"
                src="https://www.google.com/maps?q=Hilton+Yaounde,+Boulevard+du+20+Mai,+Yaounde,+Cameroon&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-7 reveal bg-card border border-border/60 rounded-xl p-8 md:p-10 space-y-6">
            <h2 className="font-display text-3xl">Send a Message</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" name="email" type="email" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="csubject">Subject</Label>
              <Input id="csubject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmessage">Message</Label>
              <Textarea id="cmessage" name="message" rows={6} required />
            </div>
            <Button type="submit" variant="terracotta" size="lg" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
