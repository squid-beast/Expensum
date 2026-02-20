import { Link } from "react-router-dom";

export default function BBLogo() {
  return (
    <Link to="/" className="flex items-center" aria-label="  home">
      <span className="text-xl tracking-tight text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
        Expen
      </span>
      <span className="text-xl tracking-tight text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
        Sum
      </span>
    </Link>
  );
}
