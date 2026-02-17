import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import lottieReact from "lottie-react";

// lottie-react CJS wrapper: actual component is at .default
const Lottie = (lottieReact as unknown as { default: typeof lottieReact }).default ?? lottieReact;

let cachedData: object | null = null;

interface CelebrationOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function CelebrationOverlay({
  isVisible,
  onComplete,
}: CelebrationOverlayProps) {
  const [show, setShow] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(cachedData);

  // Load animation data once
  useEffect(() => {
    if (!cachedData) {
      import("@/assets/lottie/celebration.json").then((mod) => {
        cachedData = (mod as { default?: object }).default ?? mod;
        setAnimationData(cachedData);
      });
    }
  }, []);

  useEffect(() => {
    if (isVisible && animationData) setShow(true);
  }, [isVisible, animationData]);

  useEffect(() => {
    if (!isVisible) setShow(false);
  }, [isVisible]);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 300);
  }, [onComplete]);

  if (!show && !isVisible) return null;
  if (!animationData) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="w-72 h-72">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay
              onComplete={handleComplete}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
