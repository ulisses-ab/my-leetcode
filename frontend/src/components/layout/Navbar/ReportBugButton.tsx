import { useState } from "react";
import { Bug, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/api";
import { playOpen } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

export function ReportBugButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await api.post("/feedback/bug", { title: title.trim(), description: description.trim() });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setTitle("");
        setDescription("");
      }, 2000);
    } catch {
      setError("Failed to send report. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setTitle("");
      setDescription("");
      setError(null);
      setSent(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Report a bug"
          onClick={() => { if (useSoundStore.getState().enabled) playOpen(); }}
          className="inline-flex h-9 w-9 items-center justify-center border-2 border-bb-border/55 bg-bb-surface/72 text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors"
        >
          <Bug className="size-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug size={15} className="text-bb-muted-strong" />
            Report a bug
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-2 py-8 text-bb-success">
            <CheckCircle size={32} />
            <p className="font-display text-sm uppercase tracking-tight">Report sent — thank you!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="bug-title" className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
                Title
              </Label>
              <Input
                id="bug-title"
                placeholder="Short description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bug-description" className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
                Description
              </Label>
              <textarea
                id="bug-description"
                placeholder="Steps to reproduce, expected vs actual behaviour…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full resize-none border-2 border-bb-border/55 bg-bb-surface/72 px-3 py-2 font-sans text-sm text-bb-ink placeholder:text-bb-muted/70 focus:outline-2 focus:outline-offset-2 focus:outline-bb-accent focus:border-bb-accent transition-colors"
              />
            </div>
            {error && (
              <p className="font-mono text-xs text-bb-error">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!title.trim() || sending}>
                {sending ? "Sending…" : "Send report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
