import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, MessageSquare, Target } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { ContactCta } from "@/components/site/Blocks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About Us", "Grownexa20 is a remote digital studio for websites, YouTube content and music promotion — focused on honest, well-crafted work."),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, t: "Honesty first", d: "No fake views, streams or subscribers. No guaranteed rankings or revenue. Ever." },
  { icon: Target, t: "Defined deliverables", d: "Every package lists exactly what you get, so expectations are clear from day one." },
  { icon: Sparkles, t: "Premium craft", d: "Modern design, careful editing and thoughtful strategy in every project." },
  { icon: MessageSquare, t: "Direct communication", d: "Talk to us on WhatsApp or email — no ticket queues." },
];

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About"
        title={<>A small studio with <span className="text-gradient">big standards.</span></>}
        description="Grownexa20 helps creators, artists and small businesses look professional online. We combine web development, YouTube production and music marketing under one roof."
      />
      <Section title="What we stand for" className="!pt-0">
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, t, d }) => (
            <div key={t} className="glass-card rounded-3xl p-7">
              <Icon className="size-6 text-brand-cyan" />
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
