import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { ContactCta, ServicesGrid } from "@/components/site/Blocks";
import { CATEGORIES } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Services",
      "Website design and development, YouTube editing and channel optimisation, and music promotion including Spotify release support.",
    ),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Services"
        title={<>Everything you need, <span className="text-gradient">nothing you don't.</span></>}
        description="Three focused areas. Spotify services live under Music Promotion. We never promise views, streams, rankings or revenue — we promise quality work, delivered as agreed."
      />
      {CATEGORIES.map((c) => (
        <Section key={c} title={c} className="!py-10">
          <ServicesGrid category={c} />
        </Section>
      ))}
      <ContactCta />
    </SiteShell>
  );
}
