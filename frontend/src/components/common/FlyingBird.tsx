import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import lottieReact from "lottie-react";

// lottie-react CJS wrapper: actual component is at .default
const Lottie = (lottieReact as unknown as { default: typeof lottieReact }).default ?? lottieReact;

export default function FlyingBird() {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    import("@/assets/lottie/flying-bird.json").then((mod) => {
      setData((mod as { default?: object }).default ?? mod);
    });
  }, []);

  if (!data) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{ x: "110vw", y: "30vh" }}
      animate={{
        x: "-10vw",
        y: ["30vh", "15vh", "40vh", "20vh", "30vh"],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="w-20 h-20 opacity-70">
        <Lottie
          animationData={data}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </motion.div>
  );
}
