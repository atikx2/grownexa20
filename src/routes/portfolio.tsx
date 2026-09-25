import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { EmptyState, Section } from "@/components/site/Section";
import { ContactCta } from "@/components/site/Blocks";
import { portfolioQuery } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead("Portfolio", "Selected website, YouTube and music promotion work by Grownexa20."),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data = [], isLoading } = useQuery(portfolioQuery);
  return (
    <SiteShell>
      <PageHero eyebrow="Portfolio" title={<>Selected <span className="text-gradient">work</span></>} description="Real projects only. We add work here once clients approve it for public display." />
      <Section className="!pt-0">
        {isLoading ? (
          <div className="h-60 animate-pulse rounded-3xl bg-secondary/40" />
        ) : !data.length ? (
          <EmptyState message="Our portfolio is being curated. Ask us for relevant samples — we're happy to share them privately." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <article key={p.id} className="glass-card overflow-hidden rounded-3xl">
                <div className="bg-gradient-soft aspect-video">
                  {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" className="size-full object-cover" /> : null}
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">{p.category}</p>
                  <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  {p.link_url ? (
                    <a href={p.link_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan">
                      View project <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
