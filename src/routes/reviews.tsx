import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { ContactCta, ReviewsList } from "@/components/site/Blocks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/reviews")({
  head: () => pageHead("Client Reviews", "Genuine feedback from Grownexa20 clients. We never publish invented testimonials."),
  component: () => (
    <SiteShell>
      <PageHero eyebrow="Reviews" title={<>What clients <span className="text-gradient">say</span></>} description="Every review here comes from a real client. No invented testimonials, ever." />
      <Section className="!pt-0">
        <ReviewsList />
      </Section>
      <ContactCta />
    </SiteShell>
  ),
});
