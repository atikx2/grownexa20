import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { EmptyState, Section } from "@/components/site/Section";
import { ContactCta, PackagesGrid, PaymentMethods, ServicesGrid } from "@/components/site/Blocks";
import { CATEGORY_PAGES, portfolioQuery } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = CATEGORY_PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) =>
    loaderData ? pageHead(loaderData.page.title, loaderData.page.blurb) : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: ServicePage,
});

function ServicePage() {
  const { page } = Route.useLoaderData();
  const { data = [], isLoading } = useQuery(portfolioQuery);
  const work = data.filter((p) => p.category === page.category);
  return (
    <SiteShell>
      <PageHero eyebrow="Services" title={<span className="text-gradient">{page.title}</span>} description={page.blurb} />
      <Section className="!pt-0" title="What we do">
        <ServicesGrid category={page.category} />
      </Section>
      <Section title="Our work">
        {isLoading ? (
          <div className="h-60 animate-pulse rounded-3xl bg-secondary/40" />
        ) : !work.length ? (
          <EmptyState message="Samples for this service will be added soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {work.map((p) => (
              <article key={p.id} className="glass-card overflow-hidden rounded-3xl">
                <div className="bg-gradient-soft aspect-video">
                  {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" className="size-full object-cover" /> : null}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  {p.link_url ? (
                    <a href={p.link_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan">View project <ExternalLink className="size-3.5" /></a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
      <Section title="Pricing">
        <PackagesGrid category={page.category} />
        <div className="mt-10"><PaymentMethods /></div>
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
