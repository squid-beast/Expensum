import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { expenseService } from "@/services/expenseService";
import type { ExpenseComment } from "@/types/expense.types";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

interface Props {
  expenseId: number;
}

export default function ExpenseCommentSection({ expenseId }: Props) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<ExpenseComment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchComments = async () => {
    const data = await expenseService.getComments(expenseId);
    setComments(data);
    setLoaded(true);
  };

  const toggle = () => {
    if (!open && !loaded) {
      fetchComments();
    }
    setOpen(!open);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await expenseService.addComment(expenseId, content.trim());
      setContent("");
      fetchComments();
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <MessageSquare className="h-3 w-3" />
        {comments.length > 0 ? comments.length : "Comment"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2"
          >
            <div className="space-y-2 pl-2 border-l-2 border-border">
              {comments.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="font-medium">{c.authorName}: </span>
                  <span className="text-muted-foreground">{c.content}</span>
                </div>
              ))}

              <form onSubmit={handleSubmit} className="flex gap-1.5">
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add comment..."
                  maxLength={500}
                  className="h-7 text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={loading || !content.trim()}
                >
                  Post
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
