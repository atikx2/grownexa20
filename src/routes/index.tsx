import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Zap, MessageSquare, BadgeCheck, Smartphone } from "lucide-react";
import { CountUp } from "@/components/site/CountUp";
import heroImg from "@/assets/hero-glow.jpg";
import { SiteShell } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { CATEGORY_ICON, ContactCta, ReviewsList } from "@/components/site/Blocks";
import { CATEGORY_PAGES, statisticsQuery } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Website, YouTube & Music Promotion Agency",
      "Grownexa20 builds websites, edits and optimises YouTube content, and runs honest music promotion campaigns for creators and brands.",
    ),
  component: Home,
});


function Home() {
  const { data: stats = [] } = useQuery(statisticsQuery);
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 sm:pt-32">
          <p className="glass rise-in inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-cyan" /> Honest scopes. No fake numbers.
          </p>
          <h1 className="rise-in mt-6 max-w-4xl text-5xl leading-[1.02] font-bold sm:text-7xl">
            Websites, YouTube & music — <span className="text-gradient">built to grow.</span>
          </h1>
          <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Grownexa20 is a digital studio for creators, artists and small brands. We deliver clearly defined work you can see and measure.
          </p>
          <div className="rise-in mt-9 flex flex-wrap gap-3">
            <Link to="/pricing" className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground">
              View packages <ArrowRight className="size-4" />
            </Link>
            <Link to="/services" className="glass rounded-full px-6 py-3 text-sm font-semibold">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="What we do" title="Four focused service areas">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_PAGES.map((pg) => {
            const Icon = CATEGORY_ICON[pg.category] ?? ShieldCheck;
            return (
              <Link key={pg.slug} to="/services/$slug" params={{ slug: pg.slug }} className="glass-card group rounded-3xl p-7 transition-transform hover:-translate-y-1">
                <span className="bg-gradient-brand grid size-12 place-items-center rounded-2xl text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{pg.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pg.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-brand-cyan">
                  Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {stats.length ? (
        <Section>
          <div className="glass-card grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} className="text-center">
                <p className="text-gradient font-display text-4xl font-bold sm:text-5xl"><CountUp value={s.value} /></p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section eyebrow="Why Grownexa20" title="Built on clarity, not hype">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [BadgeCheck, "Clear scopes", "You know exactly what's delivered before you pay."],
            [Zap, "Fast turnaround", "Agreed timelines, with progress updates along the way."],
            [MessageSquare, "Direct contact", "Talk to us on WhatsApp or email — no ticket queues."],
            [Smartphone, "Mobile-first", "Everything we build looks great on every screen."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Zap;
            return (
              <div key={t as string} className="glass-card rounded-3xl p-6 transition-transform hover:-translate-y-1">
                <I className="size-6 text-brand-cyan" />
                <p className="mt-4 font-semibold">{t as string}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="How we work" title="A simple, transparent process">
        <div className="grid gap-5 md:grid-cols-4">
          {["Tell us your goal", "Get a clear scope & quote", "We build & deliver", "Review & revise"].map((t, i) => (
            <div key={t} className="glass rounded-3xl p-6">
              <p className="text-gradient font-display text-3xl font-bold">0{i + 1}</p>
              <p className="mt-3 font-semibold">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Client words" title="Reviews">
        <ReviewsList limit={3} />
      </Section>

      <ContactCta />
    </SiteShell>
  );
}
