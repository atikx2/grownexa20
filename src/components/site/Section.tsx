import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-5 py-14 sm:py-20 ${className}`}>
      {eyebrow ? (
        <p className="text-gradient text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</p>
      ) : null}
      {title ? <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2> : null}
      {description ? (
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <div className={eyebrow || title || description ? "mt-10" : ""}>{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass rounded-3xl px-6 py-14 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
