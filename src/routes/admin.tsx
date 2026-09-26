import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/SiteShell";
import { CrudTable, type Field } from "@/components/admin/CrudTable";
import { LeadsPanel, SettingsPanel } from "@/components/admin/AdminExtras";
import { AdminsPanel } from "@/components/admin/AdminsPanel";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Grownexa20" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

const F = {
  services: [
    { key: "category", label: "Category", type: "category" },
    { key: "title", label: "Title", type: "text" },
    { key: "slug", label: "URL slug", type: "text" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "details", label: "Details", type: "textarea" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
  packages: [
    { key: "category", label: "Category", type: "category" },
    { key: "name", label: "Name", type: "text" },
    { key: "price", label: "Price", type: "number" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "price_note", label: "Price note (e.g. one-time)", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "features", label: "Features (one per line)", type: "list" },
    { key: "is_highlighted", label: "Highlight as most requested", type: "bool" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
  portfolio: [
    { key: "title", label: "Title", type: "text" },
    { key: "category", label: "Category", type: "category" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "image_url", label: "Image", type: "image" },
    { key: "link_url", label: "Project link", type: "text" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
  reviews: [
    { key: "author_name", label: "Client name", type: "text" },
    { key: "author_role", label: "Role / company", type: "text" },
    { key: "author_image", label: "Client photo", type: "image" },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "content", label: "Review", type: "textarea" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_published", label: "Published", type: "bool" },
  ],
  faqs: [
    { key: "question", label: "Question", type: "text" },
    { key: "answer", label: "Answer", type: "textarea" },
    { key: "category", label: "Group", type: "text" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
  statistics: [
    { key: "label", label: "Label", type: "text" },
    { key: "value", label: "Value (real numbers only)", type: "text" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
  team: [
    { key: "name", label: "Name", type: "text" },
    { key: "occupation", label: "Occupation", type: "text" },
    { key: "image_url", label: "Photo", type: "image" },
    { key: "sort_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "bool" },
  ],
} satisfies Record<string, Field[]>;

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;

  return (
    <div className="page-aura min-h-screen bg-background">
      <header className="glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">View site</Link>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">
        {!isAdmin ? (
          <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">This account doesn't have admin access.</p>
        ) : (
          <Tabs defaultValue="leads">
            <TabsList className="flex h-auto flex-wrap">
              {["leads", "services", "packages", "portfolio", "reviews", "team", "faqs", "statistics", "contact", "admins"].map((t) => (
                <TabsTrigger key={t} value={t} className="capitalize">{t === "packages" ? "Packages & prices" : t}</TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-6">
              <TabsContent value="leads"><LeadsPanel /></TabsContent>
              <TabsContent value="services"><CrudTable table="services" queryKey="services" fields={F.services} titleKey="title" subtitleKey="category" /></TabsContent>
              <TabsContent value="packages"><CrudTable table="packages" queryKey="packages" fields={F.packages} titleKey="name" subtitleKey="category" /></TabsContent>
              <TabsContent value="portfolio"><CrudTable table="portfolio_items" queryKey="portfolio_items" fields={F.portfolio} titleKey="title" subtitleKey="category" /></TabsContent>
              <TabsContent value="reviews"><CrudTable table="reviews" queryKey="reviews" fields={F.reviews} titleKey="author_name" subtitleKey="content" /></TabsContent>
              <TabsContent value="team"><CrudTable table="team_members" queryKey="team_members" fields={F.team} titleKey="name" subtitleKey="occupation" /></TabsContent>
              <TabsContent value="faqs"><CrudTable table="faqs" queryKey="faqs" fields={F.faqs} titleKey="question" /></TabsContent>
              <TabsContent value="statistics"><CrudTable table="statistics" queryKey="statistics" fields={F.statistics} titleKey="label" subtitleKey="value" /></TabsContent>
              <TabsContent value="contact"><SettingsPanel /></TabsContent>
              <TabsContent value="admins"><AdminsPanel /></TabsContent>
            </div>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up") toast.success("Check your inbox to confirm, then sign in.");
  }

  return (
    <div className="page-aura grid min-h-screen place-items-center bg-background px-5">
      <form onSubmit={submit} className="glass-card w-full max-w-sm space-y-4 rounded-3xl p-8">
        <Logo />
        <h1 className="text-xl font-bold">{mode === "in" ? "Admin sign in" : "Create the admin account"}</h1>
        <div className="space-y-1.5"><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
        <button type="button" className="w-full text-xs text-muted-foreground hover:text-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "First time? Create the admin account" : "Back to sign in"}
        </button>
      </form>
    </div>
  );
}
