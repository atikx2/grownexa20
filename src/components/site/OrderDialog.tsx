import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MessageCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, settingsQuery, whatsappLink } from "@/lib/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type OrderDefaults = {
  category?: string;
  packageName?: string;
  budget?: string;
};

type Form = {
  name: string;
  email: string;
  phone: string;
  category: string;
  package_name: string;
  budget: string;
  message: string;
};

function initialForm(d: OrderDefaults): Form {
  return {
    name: "",
    email: "",
    phone: "",
    category: d.category ?? "",
    package_name: d.packageName ?? "",
    budget: d.budget ?? "",
    message: d.packageName
      ? `Hi Grownexa20, I'd like to order the ${d.packageName} package${
          d.category ? ` (${d.category})` : ""
        }. Here's a bit about my project: `
      : "",
  };
}

export function OrderForm({ defaults = {}, onDone }: { defaults?: OrderDefaults; onDone?: () => void }) {
  const [form, setForm] = useState<Form>(() => initialForm(defaults));
  const [saving, setSaving] = useState(false);
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    setForm(initialForm(defaults));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults.packageName, defaults.category, defaults.budget]);

  const set = (key: keyof Form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please add your name and email.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      category: form.category,
      package_name: form.package_name,
      budget: form.budget,
      message: form.message.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error("We couldn't send that. Please try WhatsApp or email instead.");
      return;
    }
    toast.success("Request received — we'll reply shortly.");
    setForm(initialForm(defaults));
    onDone?.();
  }

  const waText = `Hi Grownexa20! ${
    form.package_name ? `I'm interested in the ${form.package_name} package. ` : ""
  }${form.message || ""}`;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="of-name">Your name *</Label>
          <Input id="of-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="of-email">Email *</Label>
          <Input
            id="of-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="of-phone">Phone / WhatsApp</Label>
          <Input
            id="of-phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="of-budget">Budget range</Label>
          <Input
            id="of-budget"
            value={form.budget}
            onChange={set("budget")}
            placeholder="e.g. $500 – $1,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="of-category">Service area</Label>
          <select
            id="of-category"
            value={form.category}
            onChange={set("category")}
            className="h-10 w-full rounded-md border border-input bg-secondary px-3 text-sm"
          >
            <option value="">Not sure yet</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="of-package">Package</Label>
          <Input
            id="of-package"
            value={form.package_name}
            onChange={set("package_name")}
            placeholder="Optional"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="of-message">Project details</Label>
        <Textarea
          id="of-message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us what you need, your deadline and any links."
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-gradient-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : null}
        Send request
      </button>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-sm">
        {settings?.["whatsapp"] ? (
          <a
            href={whatsappLink(settings["whatsapp"], waText)}
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 hover:text-foreground"
          >
            <MessageCircle className="size-4 text-brand-pink" /> WhatsApp us
          </a>
        ) : null}
        {settings?.["email"] ? (
          <a
            href={`mailto:${settings["email"]}?subject=${encodeURIComponent(
              form.package_name ? `Order: ${form.package_name}` : "Project enquiry",
            )}`}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 hover:text-foreground"
          >
            <Mail className="size-4 text-brand-cyan" /> Email us
          </a>
        ) : null}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        No online checkout. After we confirm scope we send payment details for PayPal, Cash App,
        Zelle or Venmo.
      </p>
    </form>
  );
}

export function OrderDialog({
  defaults,
  children,
}: {
  defaults?: OrderDefaults;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {defaults?.packageName ? `Order — ${defaults.packageName}` : "Start a project"}
          </DialogTitle>
          <DialogDescription>
            Send the details and we'll reply by email or WhatsApp to confirm scope, timeline and
            payment.
          </DialogDescription>
        </DialogHeader>
        <OrderForm defaults={defaults ?? {}} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
