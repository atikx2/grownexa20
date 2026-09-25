import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { EmptyState, Section } from "@/components/site/Section";
import { ContactCta } from "@/components/site/Blocks";
import { faqsQuery } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => pageHead("FAQ", "Answers about Grownexa20 packages, timelines, payments and what we do — and don't — guarantee."),
  component: FaqPage,
});

function FaqPage() {
  const { data = [] } = useQuery(faqsQuery);
  return (
    <SiteShell>
      <PageHero eyebrow="FAQ" title={<>Questions, <span className="text-gradient">answered</span></>} description="Can't find what you need? Message us on WhatsApp or email." />
      <Section className="!pt-0">
        {!data.length ? (
          <EmptyState message="FAQs coming soon." />
        ) : (
          <Accordion type="single" collapsible className="glass-card rounded-3xl px-6">
            {data.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-border">
                <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Section>
      <ContactCta />
    </SiteShell>
  );
}
