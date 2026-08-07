import { motion, MotionValue, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import introBg from "@/assets/intro_bg.jpg";
import logoImg from "@/assets/logo_gold.png";

const FONT_BASE: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 900,
  fontSize: "clamp(2.2rem, 9vw, 9rem)",
  lineHeight: 1,
  letterSpacing: "-0.02em",
  whiteSpace: "nowrap" as const,
  userSelect: "none" as const,
};

export function IntroAnimation({ progress, onDone }: { progress: MotionValue<number>; onDone: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [oCenter, setOCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  /* ════════════════════════════════════════════════
   *  FULL TIMELINE (400vh scroll):
   *
   *  ACT 1 (0.00 → 0.55)
   *    Slogan readable on white background
   *    Text zooms toward O in COMMIT (scale 1 → 22)
   *
   *  ACT 2 (0.05 → 0.70)
   *    Logo starts completely invisible (opacity 0)
   *    As user scrolls on O, logo fades in (opacity 0 → 1.0)
   *    Logo scale emerges from O portal (scale 0.08 → 1.0)
   *
   *  ACT 3 (0.65 → 0.78)
   *    Text/O fades away
   *    Full-screen background image EXPANDS to fill screen
   *    White logo remains visible directly on top of dark background
   *
   *  ACT 4 (0.93 → 1.00)
   *    Logo and background dissolve → website revealed
   * ════════════════════════════════════════════════ */

  // ── ACT 1 & 2: Text zoom
  const textScale = useTransform(progress, [0, 0.80], [1, 22]);
  const textOpacity = useTransform(progress, [0, 0.65, 0.80], [1, 1, 0]);
  const textBlurVal = useTransform(progress, [0.65, 0.80], [0, 16]);
  const textFilter = useTransform(textBlurVal, (b) => `blur(${b}px)`);

  // zoom origin state stored in ref to avoid re-renders
  const zoomOriginRef = useRef("50% 50%");
  const [zoomOrigin, setZoomOrigin] = [
    zoomOriginRef.current,
    (v: string) => { zoomOriginRef.current = v; }
  ];

  // Scroll hint
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  // ── ACT 2: Logo fades in as you scroll, starting at 0 opacity
  const logoFadeIn = useTransform(progress, [0.05, 0.40, 0.68], [0, 0.3, 1]);

  // ── ACT 2: Logo scale: starts tiny (0.08) inside the O and grows big (1.0)
  const logoScale = useTransform(progress, [0.05, 0.75], [0.08, 1.0]);

  // ── ACT 3: Full-screen background image appears
  const fullBgOpacity = useTransform(progress, [0.65, 0.78], [0, 1]);

  // ── ACT 4: Logo + background fade out together at the very end
  const logoAndBgFadeOut = useTransform(progress, [0.93, 1.0], [1, 0]);

  // Combined logo opacity: fades in during O zoom, fades out at end
  const logoCombined = useTransform(
    [logoFadeIn, logoAndBgFadeOut] as any,
    ([fi, fo]: number[]) => Math.min(fi as number, fo as number)
  );

  // Overall overlay
  const overlayOpacity = useTransform(progress, [0.96, 1.0], [1, 0]);

  /* ── Compute zoom origin and absolute coordinates toward O ── */
  useLayoutEffect(() => {
    const compute = () => {
      const container = textContainerRef.current;
      const o = oRef.current;
      if (!container || !o) return;

      // Temporarily remove transform to measure unscaled layout
      const prevTransform = container.style.transform;
      container.style.transform = "none";

      const cb = container.getBoundingClientRect();
      const ob = o.getBoundingClientRect();

      // Restore transform
      container.style.transform = prevTransform;

      const ox = ob.left - cb.left + ob.width / 2;
      const oy = ob.top - cb.top + ob.height / 2;
      setZoomOrigin(`${(ox / cb.width) * 100}% ${(oy / cb.height) * 100}%`);
      setOCenter({ x: ox, y: oy });
      
      // Force update the motion value by re-reading ref
      if (textContainerRef.current) {
        textContainerRef.current.style.transformOrigin = zoomOriginRef.current;
      }
    };
    
    // Compute immediately
    compute();
    
    // Recalculate after fonts load to ensure layout shifts are resolved
    if (document.fonts) {
      document.fonts.ready.then(compute);
    }
    
    // Safeguard delay computation
    const t = setTimeout(compute, 200);

    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      clearTimeout(t);
    };
  }, []);

  /* ── Scroll handler ── */
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section || fired) return;
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      progress.set(p);
      if (p >= 0.99) {
        fired = true;

        // Disable smooth scroll temporarily to avoid smooth scrolling/lag to 0
        const htmlStyle = document.documentElement.style;
        const prevScrollBehavior = htmlStyle.scrollBehavior;
        htmlStyle.scrollBehavior = "auto";
        window.scrollTo(0, 0);

        onDone();

        // Restore scroll behavior in next tick
        setTimeout(() => {
          htmlStyle.scrollBehavior = prevScrollBehavior;
        }, 50);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onDone, progress]);

  return (
    <div ref={sectionRef} style={{ position: "relative", zIndex: 100 }} className="w-full">
      {/* Scroll space — shorter on mobile for faster intro */}
      <div className="h-[200vh] sm:h-[280vh]" />

      <motion.div style={{ opacity: overlayOpacity }} className="fixed inset-0 z-[100] overflow-hidden">

        {/* ── LAYER 0: Full-screen background video (handshake video)
              Plays continuously from progress 0, filling the entire screen ── */}
        <div className="absolute inset-0 z-[1]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/intro_bg.mp4" type="video/mp4" />
          </video>
          {/* Elegant dark overlay so the white text and logo pop beautifully */}
          <div className="absolute inset-0 bg-[#0a1628]/65" />
        </div>

        {/* ── LAYER 1 (ACT 3): Full-screen gold world map image
              Appears at progress 0.65, filling the entire screen on top of the video ── */}
        <motion.div
          style={{ opacity: fullBgOpacity }}
          initial={{ opacity: 0 }}
          className="absolute inset-0 z-[5]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${introBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Elegant dark overlay so the white logo pops beautifully against the gold map */}
          <div className="absolute inset-0 bg-[#0a1628]/75" />
        </motion.div>

        {/* ── LAYER 2 (ACT 1 & 2): Slogan text — zooms toward O ── */}
        <motion.div
          style={{ opacity: textOpacity, filter: textFilter }}
          className="absolute inset-0 z-[10]"
        >
          <motion.div
            ref={textContainerRef}
            style={{ scale: textScale, transformOrigin: zoomOriginRef.current }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.10em" }}>

              {/* LINE 1: WE CARE, */}
              <div style={{
                ...FONT_BASE,
                color: "white",
              }}>
                WE CARE,
              </div>

              {/* LINE 2: WE COMMIT, */}
              <div style={{
                ...FONT_BASE,
                color: "white",
              }}>
                WE C<span ref={oRef}>O</span>MMIT,
              </div>

              {/* LINE 3: WE CONNECT */}
              <div style={{
                ...FONT_BASE,
                color: "white",
              }}>
                WE CONNECT
              </div>

            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-gray-400 text-xs tracking-[0.35em] uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
            Scroll to enter
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent"
          />
        </motion.div>

        {/* ── LAYER 3 (ACT 2 & 3): Transparent Logo
              Emerges directly centered on the O portal and scales up from it ── */}
        {oCenter.x > 0 && (
          <motion.div
            style={{
              position: "absolute",
              left: oCenter.x,
              top: oCenter.y,
              x: "-50%",
              y: "-50%",
              scale: logoScale,
              opacity: logoCombined,
              zIndex: 30,
            }}
            className="pointer-events-none"
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                src={logoImg}
                alt="Bodals International"
                style={{
                  width: "min(75vw, 550px)",
                  height: "auto",
                  maxHeight: "min(42vh, 260px)",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
