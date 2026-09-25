import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Section } from "@/components/site/Section";
import { OrderForm } from "@/components/site/OrderDialog";
import { PaymentMethods } from "@/components/site/Blocks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact", "Start a project with Grownexa20 — send the contact form, or reach us on WhatsApp or email."),
  component: () => (
    <SiteShell>
      <PageHero eyebrow="Contact" title={<>Let's talk about <span className="text-gradient">your project</span></>} description="Share a few details and we'll reply with scope, timeline and price. Prefer chat? Use WhatsApp or email below the form." />
      <Section className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <OrderForm />
          </div>
          <PaymentMethods />
        </div>
      </Section>
    </SiteShell>
  ),
});
