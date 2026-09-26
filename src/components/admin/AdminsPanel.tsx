import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { addAdmin, listAdmins, removeAdmin } from "@/lib/admins.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminsPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listAdmins);
  const add = useServerFn(addAdmin);
  const remove = useServerFn(removeAdmin);
  const { data = [] } = useQuery({ queryKey: ["admins"], queryFn: () => list() });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await add({ data: { email, password } });
      toast.success("Admin added — they can sign in now");
      setEmail(""); setPassword("");
      qc.invalidateQueries({ queryKey: ["admins"] });
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  }

  async function del(id: string) {
    if (!confirm("Remove admin access?")) return;
    try { await remove({ data: { userId: id } }); qc.invalidateQueries({ queryKey: ["admins"] }); }
    catch (err) { toast.error((err as Error).message); }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="glass rounded-2xl p-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5"><Label htmlFor="ae">New admin email</Label><Input id="ae" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="ap">Password (min 8)</Label><Input id="ap" type="text" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button disabled={busy}>Add admin</Button>
      </form>
      <div className="space-y-2">
        {data.map((a) => (
          <div key={a.id} className="glass flex items-center justify-between rounded-xl px-4 py-3 text-sm">
            <span>{a.email} {a.isMe ? <span className="text-muted-foreground">(you)</span> : null}</span>
            {!a.isMe && <Button size="icon" variant="ghost" aria-label="Remove admin" onClick={() => del(a.id)}><Trash2 className="size-4" /></Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
