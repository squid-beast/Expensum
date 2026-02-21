import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import BBLogo from "./BBLogo";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function LandingFooter() {
  return (
    <motion.footer
      className="border-t border-border px-4 py-8"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <motion.div variants={fadeUp}>
          <BBLogo />
        </motion.div>

        <motion.div className="flex gap-6 text-sm text-muted-foreground" variants={fadeUp}>
          {[
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </motion.div>

        <motion.p className="text-xs text-muted-foreground" variants={fadeUp}>
          &copy; {new Date().getFullYear()} Expensum
        </motion.p>
      </div>
    </motion.footer>
  );
}
