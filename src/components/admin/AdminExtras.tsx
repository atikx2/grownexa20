import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { settingRowsQuery, type Lead } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STATUSES = ["new", "contacted", "in progress", "won", "lost"];

export function LeadsPanel() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin_leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  async function update(id: string, patch: Partial<Lead>) {
    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_leads"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_leads"] });
  }

  if (!data.length) return <p className="text-sm text-muted-foreground">No leads yet.</p>;
  return (
    <div className="space-y-3">
      {data.map((l) => (
        <div key={l.id} className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{l.name} <span className="text-xs font-normal text-muted-foreground">· {new Date(l.created_at).toLocaleString()}</span></p>
              <p className="text-sm text-muted-foreground">
                <a href={`mailto:${l.email}`} className="hover:text-foreground">{l.email}</a>
                {l.phone ? ` · ${l.phone}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{[l.category, l.package_name, l.budget].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={l.status} onChange={(e) => update(l.id, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <Button size="icon" variant="ghost" aria-label="Delete lead" onClick={() => remove(l.id)}><Trash2 className="size-4" /></Button>
            </div>
          </div>
          {l.message ? <p className="mt-3 text-sm whitespace-pre-wrap">{l.message}</p> : null}
          <Textarea className="mt-3" placeholder="Private notes" defaultValue={l.admin_notes} onBlur={(e) => e.target.value !== l.admin_notes && update(l.id, { admin_notes: e.target.value })} />
        </div>
      ))}
    </div>
  );
}

export function SettingsPanel() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(settingRowsQuery);
  const [vals, setVals] = useState<Record<string, string>>({});
  useEffect(() => {
    setVals(Object.fromEntries(data.map((r) => [r.key, r.value])));
  }, [data]);

  async function save() {
    for (const r of data) {
      if (vals[r.key] !== r.value) {
        const { error } = await supabase.from("site_settings").update({ value: vals[r.key] ?? "" }).eq("key", r.key);
        if (error) return toast.error(error.message);
      }
    }
    toast.success("Contact details saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    qc.invalidateQueries({ queryKey: ["site_settings_rows"] });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((r) => (
          <div key={r.key} className="space-y-1.5">
            <Label>{r.label || r.key}</Label>
            <Input value={vals[r.key] ?? ""} onChange={(e) => setVals((v) => ({ ...v, [r.key]: e.target.value }))} />
          </div>
        ))}
      </div>
      <Button onClick={save}>Save changes</Button>
    </div>
  );
}
