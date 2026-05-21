import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWebsite } from "../../contexts/WebsiteContext";
import defaultLogo from "@/assets/logo.png";

function buildLogoUrl(logo: string | undefined | null): string | null {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `/uploads/${logo}`;
}

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const { settings } = useWebsite();
  const sectionRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const progress = useMotionValue(0);

  const logoUrl = buildLogoUrl(settings?.logo);
  const logoSrc = logoUrl || defaultLogo;
  const companyName = settings?.company_name || "BODAL'S INTERNATIONAL";

  /* ── Preload logo ── */
  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
  }, [logoSrc]);

  /* ═══════════════════════════════════════════════════════
   *  ACT 1 — Slogan zoom  (progress 0 → 0.50)
   * ═══════════════════════════════════════════════════════ */
  const sloganScale = useTransform(progress, [0, 0.50], [1, 14]);
  const sloganOpacity = useTransform(progress, [0, 0.35, 0.50], [1, 1, 0]);
  const sloganBlur = useTransform(progress, [0, 0.50], [0, 16]);
  const sloganFilter = useTransform(sloganBlur, (b) => `blur(${b}px)`);
  const sloganBgOpacity = useTransform(progress, [0, 0.42, 0.50], [1, 1, 0]);
  const hintOpacity = useTransform(progress, [0, 0.15], [1, 0]);

  /* ═══════════════════════════════════════════════════════
   *  ACT 2 — Logo zoom  (progress 0.45 → 1.0)
   *  Same style as the slogan — appears centered, then
   *  zooms in with blur until it fades out.
   * ═══════════════════════════════════════════════════════ */
  const logoBgOpacity = useTransform(progress, [0.42, 0.50, 0.88, 1.0], [0, 1, 1, 0]);
  const logoFadeIn = useTransform(progress, [0.45, 0.58], [0, 1]);
  const logoScale = useTransform(progress, [0.58, 1.0], [1, 12]);
  const logoBlur = useTransform(progress, [0.58, 1.0], [0, 14]);
  const logoFilter = useTransform(logoBlur, (b) => `blur(${b}px)`);
  const logoZoomOpacity = useTransform(progress, [0.58, 0.80, 1.0], [1, 1, 0]);

  // Combined: fade-in * zoom-out opacity
  const logoCombinedOpacity = useTransform(
    [logoFadeIn, logoZoomOpacity] as any,
    ([fadeIn, zoomOp]: number[]) => fadeIn * zoomOp
  );

  // Hint for logo stage
  const logoHintOpacity = useTransform(progress, [0.52, 0.60, 0.68], [0, 1, 0]);

  // Overall overlay
  const overlayOpacity = useTransform(progress, [0.92, 1.0], [1, 0]);

  /* ── Compute zoom origin toward "O" ── */
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
        window.scrollTo(0, 0);
        onDone();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onDone, progress]);

  return (
    <div ref={sectionRef} style={{ position: "relative", zIndex: 100 }} className="w-full">
      <div style={{ height: "350vh" }} />

      <motion.div style={{ opacity: overlayOpacity }} className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">

        {/* ── ACT 1: Slogan ── */}
        <motion.div style={{ opacity: sloganBgOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b35] to-[#0a1628]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        <motion.div
          ref={zoomRef}
          style={{
            scale: sloganScale,
            opacity: sloganOpacity,
            filter: sloganFilter,
            transformOrigin: origin,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center text-center px-6"
        >
          <div>
            <div className="mb-8">
              <span
                className="inline-block px-4 py-1.5 rounded-full border border-[#d4af37]/40 text-[#d4af37] tracking-[0.3em] uppercase text-xs"
                style={{ fontFamily: "Inter" }}
              >
                BODAL'S INTERNATIONAL
              </span>
            </div>

            <div
              role="heading"
              aria-level={1}
              className="text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2.5rem, 9vw, 8rem)", fontWeight: 700 }}
            >
              <div>WE CARE,</div>
              <div>
                WE C<span ref={oRef} className="text-[#d4af37]">O</span>MMIT,
              </div>
              <div>WE CONNECT</div>
            </div>

            <div
              className="mt-10 flex items-center justify-center gap-3 text-white/50 tracking-[0.2em] uppercase text-xs"
              style={{ fontFamily: "Inter" }}
            >
              <span className="h-px w-12 bg-[#d4af37]/60" />
              <span>Premium Indian Exports · Global Trade</span>
              <span className="h-px w-12 bg-[#d4af37]/60" />
            </div>
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

        {/* ── ACT 2: Logo zoom (same style as slogan) ── */}
        <motion.div style={{ opacity: logoBgOpacity }} className="absolute inset-0 z-20 bg-[#0a1628]">
          {/* Ambient glow */}
          <motion.div
            style={{ opacity: logoFadeIn }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]"
          />

          <motion.div
            style={{
              scale: logoScale,
              opacity: logoCombinedOpacity,
              filter: logoFilter,
              transformOrigin: "center center",
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="flex flex-col items-center gap-5">
              <img
                src={logoSrc}
                alt={companyName}
                className="max-w-[min(70vw,320px)] max-h-[min(50vh,320px)] object-contain drop-shadow-2xl"
                draggable={false}
              />
              <div className="text-center">
                <div
                  className="text-white tracking-[0.15em]"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "clamp(1.1rem, 2.8vw, 2rem)" }}
                >
                  {companyName}
                </div>
                <div
                  className="mx-auto mt-3 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"
                  style={{ width: "clamp(80px, 20vw, 200px)" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: logoHintOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2 text-xs tracking-[0.3em] uppercase"
          >
            <span style={{ fontFamily: "Inter" }}>Scroll to reveal homepage</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
            />
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
}
