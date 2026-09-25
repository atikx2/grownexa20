import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-glow.jpg";
import { SiteShell } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { CATEGORY_ICON, ContactCta, ReviewsList } from "@/components/site/Blocks";
import { CATEGORIES, statisticsQuery } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Website, YouTube & Music Promotion Agency",
      "Grownexa20 builds websites, edits and optimises YouTube content, and runs honest music promotion campaigns for creators and brands.",
    ),
  component: Home,
});

const BLURB: Record<string, string> = {
  "Website Services": "Fast, modern websites and landing pages designed to convert visitors into enquiries.",
  "YouTube Services": "Editing, thumbnails, channel setup and SEO-friendly metadata for creators.",
  "Music Promotion": "Release planning, Spotify profile optimisation, playlist pitching and campaign content.",
};

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

      <Section eyebrow="What we do" title="Three focused service areas">
        <div className="grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c] ?? ShieldCheck;
            return (
              <Link key={c} to="/services" className="glass-card group rounded-3xl p-7 transition-transform hover:-translate-y-1">
                <span className="bg-gradient-brand grid size-12 place-items-center rounded-2xl text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{c}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{BLURB[c]}</p>
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
                <p className="text-gradient font-display text-4xl font-bold">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

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
