import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const progress = useMotionValue(0);

  const scale = useTransform(progress, [0, 1], [1, 14]);
  const opacity = useTransform(progress, [0, 0.55, 0.92], [1, 1, 0]);
  const blurNum = useTransform(progress, [0, 1], [0, 16]);
  const filter = useTransform(blurNum, (b) => `blur(${b}px)`);
  const bgOpacity = useTransform(progress, [0, 0.75, 1], [1, 1, 0]);
  const hintOpacity = useTransform(progress, [0, 0.15], [1, 0]);

  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      progress.set(p);
      if (!fired && p >= 0.99) {
        fired = true;
        window.scrollTo(0, 0);
        onDone();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onDone, progress]);

  useLayoutEffect(() => {
    const compute = () => {
      const zoom = zoomRef.current;
      const o = oRef.current;
      if (!zoom || !o) return;
      const zb = zoom.getBoundingClientRect();
      const ob = o.getBoundingClientRect();
      const x = ob.left - zb.left + ob.width / 2;
      const y = ob.top - zb.top + ob.height / 2;
      setOrigin(`${(x / zb.width) * 100}% ${(y / zb.height) * 100}%`);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div ref={sectionRef} style={{ position: "relative" }} className="h-[180vh] w-full bg-[#0a1628]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b35] to-[#0a1628]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        <motion.div
          ref={zoomRef}
          style={{ scale, opacity, filter, transformOrigin: origin }}
          className="relative z-10 text-center px-6"
        >
          <div className="mb-8">
            <span
              className="inline-block px-4 py-1.5 rounded-full border border-[#d4af37]/40 text-[#d4af37] tracking-[0.3em] uppercase text-xs"
              style={{ fontFamily: "Inter" }}
            >
              BODAL'S INTERNATIONAL
            </span>
          </div>

          <h1
            className="text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2.5rem, 9vw, 8rem)", fontWeight: 700 }}
          >
            <div>WE CARE,</div>
            <div>
              WE C<span ref={oRef} className="text-[#d4af37]">O</span>MMIT,
            </div>
            <div>WE CONNECT</div>
          </h1>

          <div
            className="mt-10 flex items-center justify-center gap-3 text-white/50 tracking-[0.2em] uppercase text-xs"
            style={{ fontFamily: "Inter" }}
          >
            <span className="h-px w-12 bg-[#d4af37]/60" />
            <span>Premium Indian Exports · Global Trade</span>
            <span className="h-px w-12 bg-[#d4af37]/60" />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2 text-xs tracking-[0.3em] uppercase z-20"
        >
          <span style={{ fontFamily: "Inter" }}>Scroll to enter</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}
