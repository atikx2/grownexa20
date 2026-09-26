import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { ContactCta } from "@/components/site/Blocks";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/seo";

type Member = { id: string; name: string; occupation: string; image_url: string | null };

export const Route = createFileRoute("/team")({
  head: () => pageHead("Our Team", "Meet the Grownexa20 team behind our website, YouTube and music promotion work."),
  component: TeamPage,
});

function TeamPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order");
      if (error) throw error;
      return data as Member[];
    },
  });
  return (
    <SiteShell>
      <PageHero eyebrow="Team" title={<>Meet the <span className="text-gradient">people</span></>} description="The small, focused team that plans, builds and runs your projects." />
      <Section className="!pt-0">
        {isLoading ? null : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((m) => (
              <div key={m.id} className="glass-card overflow-hidden rounded-3xl text-center">
                <div className="aspect-square overflow-hidden bg-muted">
                  {m.image_url ? <img src={m.image_url} alt={m.name} loading="lazy" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  <p className="text-sm text-gradient font-medium">{m.occupation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
