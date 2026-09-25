import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "bool" | "category" | "list";
};

type Row = Record<string, unknown> & { id: string };

export function CrudTable({
  table,
  queryKey,
  fields,
  titleKey,
  subtitleKey,
}: {
  table: "services" | "packages" | "portfolio_items" | "reviews" | "faqs" | "statistics";
  queryKey: string;
  fields: Field[];
  titleKey: string;
  subtitleKey?: string;
}) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as Row[];
    },
  });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const blank = () => {
    const r: Record<string, unknown> = {};
    for (const f of fields)
      r[f.key] = f.type === "bool" ? true : f.type === "number" ? 0 : f.type === "list" ? [] : f.type === "category" ? CATEGORIES[0] : "";
    return r;
  };

  async function save() {
    if (!editing) return;
    const { id, created_at: _c, updated_at: _u, ...payload } = editing as Row;
    const q = id
      ? supabase.from(table).update(payload as never).eq("id", id)
      : supabase.from(table).insert(payload as never);
    const { error } = await q;
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  const set = (k: string, v: unknown) => setEditing((e) => ({ ...e, [k]: v }));

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing(blank())}>
          <Plus className="size-4" /> Add new
        </Button>
      </div>
      <div className="space-y-2">
        {data.length === 0 ? <p className="text-sm text-muted-foreground">No items yet.</p> : null}
        {data.map((r) => (
          <div key={r.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{String(r[titleKey] ?? "")}</p>
              {subtitleKey ? <p className="truncate text-xs text-muted-foreground">{String(r[subtitleKey] ?? "")}</p> : null}
            </div>
            <div className="flex shrink-0 gap-1">
              {"is_active" in r && !r["is_active"] ? <span className="self-center text-xs text-muted-foreground">hidden</span> : null}
              {"is_published" in r && !r["is_published"] ? <span className="self-center text-xs text-muted-foreground">draft</span> : null}
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing({ ...r })}>
                <Pencil className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(r.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.["id"] ? "Edit" : "Add"}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              {fields.map((f) => {
                const v = editing[f.key];
                return (
                  <div key={f.key} className="space-y-1.5">
                    <Label>{f.label}</Label>
                    {f.type === "textarea" ? (
                      <Textarea value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                    ) : f.type === "list" ? (
                      <Textarea
                        placeholder="One per line"
                        value={((v as string[]) ?? []).join("\n")}
                        onChange={(e) => set(f.key, e.target.value.split("\n"))}
                        onBlur={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                      />
                    ) : f.type === "bool" ? (
                      <div><Switch checked={!!v} onCheckedChange={(c) => set(f.key, c)} /></div>
                    ) : f.type === "category" ? (
                      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    ) : (
                      <Input
                        type={f.type === "number" ? "number" : "text"}
                        value={String(v ?? "")}
                        onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
              <Button className="w-full" onClick={save}>Save</Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
