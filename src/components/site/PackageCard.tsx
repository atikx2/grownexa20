import { Check, Sparkles } from "lucide-react";
import { formatPrice, type Package } from "@/lib/content";
import { OrderDialog } from "@/components/site/OrderDialog";

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article
      className={`glass-card relative flex h-full flex-col rounded-3xl p-7 ${
        pkg.is_highlighted ? "gradient-border glow-ring" : ""
      }`}
    >
      {pkg.is_highlighted ? (
        <span className="bg-gradient-brand absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-primary-foreground">
          <Sparkles className="size-3" /> Most requested
        </span>
      ) : null}
      <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
        {pkg.category}
      </p>
      <h3 className="mt-2 text-xl font-bold">{pkg.name}</h3>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-gradient font-display text-4xl font-bold">{formatPrice(pkg)}</span>
        {pkg.price_note ? (
          <span className="pb-1 text-xs text-muted-foreground">{pkg.price_note}</span>
        ) : null}
      </div>
      {pkg.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
      ) : null}
      <ul className="mt-6 space-y-3 text-sm">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-cyan" />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-7">
        <OrderDialog defaults={{ category: pkg.category, packageName: pkg.name }}>
          <button
            className={`w-full rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
              pkg.is_highlighted
                ? "bg-gradient-brand text-primary-foreground"
                : "glass text-foreground"
            }`}
          >
            Buy now
          </button>
        </OrderDialog>
      </div>
    </article>
  );
}
