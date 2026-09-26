import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star, Globe, Youtube, Music, Mail, MessageCircle } from "lucide-react";
import {
  CATEGORIES,
  packagesQuery,
  reviewsQuery,
  servicesQuery,
  settingsQuery,
  whatsappLink,
} from "@/lib/content";
import { PackageCard } from "@/components/site/PackageCard";
import { EmptyState } from "@/components/site/Section";

export const CATEGORY_ICON: Record<string, typeof Globe> = {
  "Website Services": Globe,
  "YouTube Services": Youtube,
  "Music Promotion": Music,
};

export function ServicesGrid({ category }: { category?: string }) {
  const { data = [], isLoading } = useQuery(servicesQuery);
  const list = data.filter((s) => !category || s.category === category);
  if (isLoading) return <div className="h-40 animate-pulse rounded-3xl bg-secondary/40" />;
  if (!list.length) return <EmptyState message="Services will be listed here soon." />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s) => {
        const Icon = CATEGORY_ICON[s.category] ?? Globe;
        return (
          <article key={s.id} className="glass-card rounded-3xl p-6 transition-transform hover:-translate-y-1">
            <span className="bg-gradient-brand grid size-11 place-items-center rounded-2xl text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            {s.details ? <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">{s.details}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

export function PackagesGrid({ category }: { category?: string }) {
  const { data = [], isLoading } = useQuery(packagesQuery);
  const list = data.filter((p) => !category || p.category === category);
  if (isLoading) return <div className="h-72 animate-pulse rounded-3xl bg-secondary/40" />;
  if (!list.length) return <EmptyState message="Packages will be published soon." />;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {list.map((p) => (
        <PackageCard key={p.id} pkg={p} />
      ))}
    </div>
  );
}

export function CategoryTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="glass inline-flex flex-wrap gap-1 rounded-full p-1">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            value === c ? "bg-gradient-brand font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function ReviewsList({ limit }: { limit?: number }) {
  const { data = [], isLoading } = useQuery(reviewsQuery);
  const list = limit ? data.slice(0, limit) : data;
  if (isLoading) return <div className="h-40 animate-pulse rounded-3xl bg-secondary/40" />;
  if (!list.length)
    return (
      <EmptyState message="We only publish genuine reviews from real clients. As projects complete, their feedback will appear here." />
    );
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {list.map((r) => (
        <figure key={r.id} className="glass-card rounded-3xl p-6">
          <div className="flex gap-0.5 text-brand-pink">
            {Array.from({ length: r.rating }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-4 text-sm leading-relaxed">“{r.content}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 text-sm">
            {r.author_image ? (
              <img src={r.author_image} alt={r.author_name} loading="lazy" width={48} height={48} className="size-12 rounded-full object-cover ring-2 ring-primary/40" />
            ) : (
              <span className="bg-gradient-brand grid size-12 place-items-center rounded-full font-bold text-primary-foreground">{r.author_name.charAt(0)}</span>
            )}
            <span>
              <span className="block font-semibold">{r.author_name}</span>
              {r.author_role ? <span className="block text-xs text-muted-foreground">{r.author_role}</span> : null}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const PAYMENT_KEYS = [
  ["PayPal", "paypal"],
  ["Cash App", "cashapp"],
  ["Zelle", "zelle"],
  ["Venmo", "venmo"],
] as const;

export function PaymentMethods() {
  const { data: s } = useQuery(settingsQuery);
  return (
    <div className="glass-card rounded-3xl p-6">
      <h3 className="font-bold">Accepted payment methods</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        No online checkout. After we confirm your scope, pay manually using one of these:
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PAYMENT_KEYS.map(([label, key]) => (
          <div key={key} className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{s?.[key] || "Shared on confirmation"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactCta() {
  const { data: s } = useQuery(settingsQuery);
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="gradient-border glass-card relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to build something <span className="text-gradient">worth sharing?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tell us about your project. We reply with a clear scope, timeline and price — no pressure, no inflated promises.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="bg-gradient-brand rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground">
            Contact form
          </Link>
          {s?.["whatsapp"] ? (
            <a href={whatsappLink(s["whatsapp"], "Hi Grownexa20!")} target="_blank" rel="noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          ) : null}
          {s?.["email"] ? (
            <a href={`mailto:${s["email"]}`} className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
              <Mail className="size-4" /> Email
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
