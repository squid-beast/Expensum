import { Link } from "react-router-dom";

export default function BBLogo() {
  return (
    <Link to="/" className="flex items-center gap-0.5" aria-label="Budget Buddy home">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-lg font-bold text-gray-900">
        B
      </span>
      <span className="text-lg font-bold text-foreground">B</span>
    </Link>
  );
}
