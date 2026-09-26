import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Menu, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { settingsQuery, whatsappLink } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="bg-gradient-brand grid size-9 place-items-center rounded-xl text-sm font-bold text-primary-foreground">
        G
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Grownexa<span className="text-gradient">20</span>
      </span>
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery(settingsQuery);

  const wa = whatsappLink(
    settings?.["whatsapp"] ?? "",
    "Hi Grownexa20, I'd like to discuss a project.",
  );

  return (
    <div className="page-aura min-h-screen bg-background">
      <header className="sticky top-0 z-50">
        <div className="glass border-b border-border">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="bg-gradient-brand hidden rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-flex"
              >
                Start a project
              </Link>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                  aria-label="Open menu"
                  className="glass grid size-10 place-items-center rounded-xl lg:hidden"
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="right" className="border-border bg-background/95 backdrop-blur">
                  <div className="mt-10 flex flex-col gap-1 px-2">
                    {NAV.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        activeProps={{ className: "text-foreground bg-secondary" }}
                        activeOptions={{ exact: item.to === "/" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {settings?.["tagline"] ?? "Websites, YouTube and music campaigns — built honestly."}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/services/$slug" params={{ slug: "website" }} className="hover:text-foreground">
                  Website Services
                </Link>
              </li>
              <li>
                <Link to="/services/$slug" params={{ slug: "youtube" }} className="hover:text-foreground">
                  YouTube Services
                </Link>
              </li>
              <li>
                <Link to="/services/$slug" params={{ slug: "spotify" }} className="hover:text-foreground">
                  Spotify & Music
                </Link>
              </li>
              <li>
                <Link to="/services/$slug" params={{ slug: "seo" }} className="hover:text-foreground">
                  SEO Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground">
                  Packages & Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-foreground">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-foreground">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {settings?.["email"] ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-brand-cyan" />
                  <a href={`mailto:${settings["email"]}`} className="hover:text-foreground">
                    {settings["email"]}
                  </a>
                </li>
              ) : null}
              {settings?.["whatsapp"] ? (
                <li className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-brand-pink" />
                  <a href={wa} target="_blank" rel="noreferrer" className="hover:text-foreground">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings?.["location"] ? (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand-violet" />
                  {settings["location"]}
                </li>
              ) : null}
              {settings?.["hours"] ? (
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-brand-blue" />
                  {settings["hours"]}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {settings?.["company_name"] ?? "Grownexa20"}. All rights
              reserved.
            </p>
            <p>
              We deliver defined work — we never guarantee views, streams, rankings or revenue.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:pt-24">
      <p className="text-gradient rise-in text-xs font-semibold tracking-[0.2em] uppercase">
        {eyebrow}
      </p>
      <h1 className="rise-in mt-4 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl">
        {title}
      </h1>
      <p className="rise-in mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </section>
  );
}
