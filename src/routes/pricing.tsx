import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { CategoryTabs, PackagesGrid, PaymentMethods } from "@/components/site/Blocks";
import { CATEGORIES } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead(
      "Packages & Pricing",
      "Transparent package pricing for website, YouTube and music promotion services. Order by form, WhatsApp or email — pay via PayPal, Cash App, Zelle or Venmo.",
    ),
  component: PricingPage,
});

function PricingPage() {
  const [cat, setCat] = useState<string>(CATEGORIES[0]);
  return (
    <SiteShell>
      <PageHero
        eyebrow="Pricing"
        title={<>Clear packages. <span className="text-gradient">Fair prices.</span></>}
        description="Pick a package and hit Buy Now — we'll confirm the scope with you before any payment. Custom quotes are always welcome."
      />
      <Section className="!pt-0">
        <CategoryTabs value={cat} onChange={setCat} />
        <div className="mt-10">
          <PackagesGrid category={cat} />
        </div>
        <div className="mt-12">
          <PaymentMethods />
        </div>
      </Section>
    </SiteShell>
  );
}
