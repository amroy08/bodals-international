import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Download, Maximize2, X, Eye, FileText } from "lucide-react";

export function Brochure() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const totalPages = 11;
  const pageImage = (page: number) => `/brochure/page-${page}.png`;
  const pdfUrl = "/brochure/brochure.pdf";

  const handleNext = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSelect = (page: number) => {
    if (page === currentPage) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  // Center active thumbnail in the strip
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeElement = thumbnailStripRef.current.querySelector(
        `[data-page-index="${currentPage}"]`
      ) as HTMLElement;

      if (activeElement) {
        const strip = thumbnailStripRef.current;
        const stripWidth = strip.offsetWidth;
        const elementLeft = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;

        strip.scrollTo({
          left: elementLeft - stripWidth / 2 + elementWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentPage]);

  // Handle keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, isLightboxOpen]);

  // Framer Motion Slider Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : dir < 0 ? "-100%" : "0%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : dir > 0 ? "-100%" : "0%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 },
      },
    }),
  };

  return (
    <section 
      className="py-16 sm:py-24 lg:py-32 bg-[#fafaf7] relative overflow-hidden border-t border-b border-[#0a1628]/5"
      aria-label="Company Corporate Brochure"
    >
      {/* Decorative background grid and blurs */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#0a1628_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4"
          >
            Digital Literature
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#0a1628] tracking-tight mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}
          >
            Company <span className="text-[#d4af37]">Brochure</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#717182] text-base"
            style={{ fontFamily: "Inter" }}
          >
            Explore our interactive catalog showcasing our diverse business divisions, high-grade products, global supply networks, and compliance credentials.
          </motion.p>
        </div>

        {/* Brochure Core Interactive Area */}
        <div className="flex flex-col items-center gap-8">
          {/* Main Book/Slider Container */}
          <div className="relative w-full max-w-[480px] sm:max-w-[520px] aspect-[1/1.414] group flex items-center justify-center">
            {/* Soft Shadow behind the pages */}
            <div className="absolute inset-0 bg-[#0a1628]/5 blur-2xl rounded-2xl scale-[0.97] translate-y-4" />

            {/* Slider frame */}
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#0a1628]/10 bg-white shadow-2xl flex items-center justify-center">
              {/* Inner binding shadow (A4 middle bind look if double page, but portrait is a neat left-edge subtle line) */}
              <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-r from-black/10 via-black/3 to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-l from-black/5 to-transparent z-10 pointer-events-none" />

              {/* Page transitions */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={pageImage(currentPage)}
                    alt={`Bodal Brochure Page ${currentPage}`}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />

                  {/* Hover eye/zoom effect */}
                  <div className="absolute inset-0 bg-[#0a1628]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white">
                    <div className="bg-[#0a1628]/80 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm font-medium">
                      <Eye className="w-4 h-4 text-[#d4af37]" />
                      Click to Zoom
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick action: page size maximize button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#0a1628] hover:text-[#d4af37] p-2.5 rounded-full shadow-lg border border-[#0a1628]/5 z-20 backdrop-blur-sm transition duration-200 hover:scale-105"
              title="Fullscreen view"
              aria-label="Fullscreen view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Navigation Arrows */}
            {currentPage > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-[#0a1628] hover:text-[#d4af37] p-3 rounded-full shadow-xl border border-[#0a1628]/5 z-20 transition duration-200 hover:scale-110 active:scale-95"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentPage < totalPages && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-[#0a1628] hover:text-[#d4af37] p-3 rounded-full shadow-xl border border-[#0a1628]/5 z-20 transition duration-200 hover:scale-110 active:scale-95"
                aria-label="Next Page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Page Indicator & Text */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[#0a1628] font-semibold text-sm tracking-wide bg-[#0a1628]/5 px-4 py-1.5 rounded-full" style={{ fontFamily: "Inter" }}>
              Page {currentPage} of {totalPages}
            </span>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageSelect(i + 1)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentPage === i + 1 
                      ? "w-6 bg-[#d4af37]" 
                      : "w-2 bg-[#0a1628]/20 hover:bg-[#0a1628]/45"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons: Download & View Fullscreen */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <a
              href={pdfUrl}
              download="BODALS_INTERNATIONAL_Brochure.pdf"
              className="group flex items-center gap-2.5 bg-[#0a1628] hover:bg-[#12243d] text-white hover:text-[#d4af37] px-6 py-3 rounded-full shadow-xl hover:shadow-2xl font-semibold tracking-wide transition duration-300 hover:-translate-y-0.5"
              style={{ fontFamily: "Inter" }}
            >
              <Download className="w-4 h-4 text-[#d4af37] group-hover:translate-y-0.5 transition-transform" />
              Download Full Brochure
              <span className="text-xs text-white/50 font-normal ml-1">(PDF)</span>
            </a>

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="flex items-center gap-2.5 bg-white hover:bg-[#fafaf7] text-[#0a1628] border border-[#0a1628]/10 hover:border-[#0a1628]/20 px-6 py-3 rounded-full shadow-md font-semibold tracking-wide transition duration-300 hover:-translate-y-0.5"
              style={{ fontFamily: "Inter" }}
            >
              <Maximize2 className="w-4 h-4 text-[#d4af37]" />
              Fullscreen Lightbox
            </button>
          </div>

          {/* Thumbnail Strip Container */}
          <div className="w-full max-w-4xl mt-8">
            <div className="text-xs uppercase tracking-wider text-[#717182] font-semibold mb-3 text-center" style={{ fontFamily: "Inter" }}>
              Quick Navigation
            </div>
            
            {/* Scrollable Thumbnail Strip */}
            <div 
              ref={thumbnailStripRef}
              className="flex items-center gap-3 overflow-x-auto py-3 px-4 bg-white border border-[#0a1628]/5 rounded-2xl shadow-inner scrollbar-thin scrollbar-thumb-gray-200"
              style={{ scrollbarWidth: "thin" }}
            >
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                const isSelected = currentPage === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    data-page-index={pageNumber}
                    onClick={() => handlePageSelect(pageNumber)}
                    className={`relative flex-shrink-0 aspect-[1/1.414] h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                      isSelected 
                        ? "border-[#d4af37] shadow-lg scale-105 z-10" 
                        : "border-[#0a1628]/10 hover:border-[#0a1628]/30 hover:scale-[1.02]"
                    }`}
                  >
                    <img 
                      src={pageImage(pageNumber)}
                      alt={`Thumb ${pageNumber}`}
                      className="w-full h-full object-cover select-none"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected 
                        ? "bg-black/20 text-[#d4af37]" 
                        : "bg-black/40 hover:bg-black/20 text-white opacity-0 hover:opacity-100"
                    }`}>
                      {pageNumber}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal (Full screen overlay) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a1628]/95 flex flex-col items-center justify-between p-4 md:p-6 backdrop-blur-lg"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Header */}
            <div className="w-full max-w-7xl flex items-center justify-between text-white z-10 py-2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <span className="font-semibold tracking-wide" style={{ fontFamily: "Inter" }}>
                  Bodal International Brochure (Page {currentPage} of {totalPages})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={pdfUrl}
                  download="BODALS_INTERNATIONAL_Brochure.pdf"
                  className="bg-white/10 hover:bg-[#d4af37] text-white hover:text-[#0a1628] p-2 rounded-full transition duration-200"
                  onClick={(e) => e.stopPropagation()}
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="bg-white/10 hover:bg-red-500/80 hover:text-white p-2 rounded-full transition duration-200"
                  aria-label="Close Fullscreen View"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Image & Arrows Container */}
            <div 
              className="relative w-full max-w-4xl flex-grow flex items-center justify-center my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev button */}
              {currentPage > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:-left-16 bg-white/10 hover:bg-[#d4af37] text-white hover:text-[#0a1628] p-3 rounded-full backdrop-blur-md transition duration-200"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
              )}

              {/* High-res Image display */}
              <div className="relative max-h-[80vh] aspect-[1/1.414] overflow-hidden rounded-xl bg-white shadow-2xl border border-white/10">
                <img
                  src={pageImage(currentPage)}
                  alt={`Bodal Brochure High-Res Page ${currentPage}`}
                  className="w-full h-full object-contain select-none"
                />
              </div>

              {/* Next button */}
              {currentPage < totalPages && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:-right-16 bg-white/10 hover:bg-[#d4af37] text-white hover:text-[#0a1628] p-3 rounded-full backdrop-blur-md transition duration-200"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              )}
            </div>

            {/* Lightbox Footer Navigation dots */}
            <div className="w-full flex flex-col items-center gap-2 text-white/70 z-10 py-2">
              <div className="text-xs uppercase tracking-widest font-medium">Use Left/Right Keyboard Arrows to Navigate</div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageSelect(i + 1);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentPage === i + 1 
                        ? "w-6 bg-[#d4af37]" 
                        : "w-2 bg-white/20 hover:bg-white/50"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
