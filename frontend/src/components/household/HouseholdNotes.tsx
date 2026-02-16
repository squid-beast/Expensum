import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { householdService } from "@/services/householdService";
import type { HouseholdNote } from "@/types/household.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

interface Props {
  householdId: number;
}

export default function HouseholdNotes({ householdId }: Props) {
  const [notes, setNotes] = useState<HouseholdNote[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = () => {
    householdService.getNotes(householdId).then(setNotes).catch(() => {});
  };

  useEffect(fetchNotes, [householdId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await householdService.addNote(householdId, content.trim());
      setContent("");
      fetchNotes();
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            maxLength={500}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            Post
          </Button>
        </form>

        <div className="max-h-48 overflow-y-auto space-y-2">
          <AnimatePresence>
            {notes.slice(0, 10).map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-sm"
              >
                <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary mt-0.5">
                  {note.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p>
                    <span className="font-medium">{note.authorName}</span>{" "}
                    <span className="text-muted-foreground">{note.content}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTime(note.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">No notes yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
