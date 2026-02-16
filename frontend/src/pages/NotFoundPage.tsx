import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { Button } from "@/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted mb-4">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
}
