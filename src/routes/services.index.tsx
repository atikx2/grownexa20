import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { CATEGORY_ICON, ContactCta } from "@/components/site/Blocks";
import { CATEGORY_PAGES } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => pageHead("Services", "Website, YouTube, Spotify and SEO services by Grownexa20 — choose a service to see details, work and pricing."),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Services" title={<>Choose a <span className="text-gradient">service</span></>} description="Each service has its own page with details, sample work and pricing." />
      <Section className="!pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_PAGES.map((pg) => {
            const Icon = CATEGORY_ICON[pg.category] ?? ArrowRight;
            return (
              <Link key={pg.slug} to="/services/$slug" params={{ slug: pg.slug }} className="glass-card group rounded-3xl p-7 transition-transform hover:-translate-y-1">
                <span className="bg-gradient-brand grid size-12 place-items-center rounded-2xl text-primary-foreground"><Icon className="size-6" /></span>
                <h3 className="mt-6 text-xl font-bold">{pg.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pg.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-brand-cyan">Open page <ArrowRight className="size-4" /></span>
              </Link>
            );
          })}
        </div>
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
