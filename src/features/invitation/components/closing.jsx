import { motion } from "framer-motion";
import { Heart, ChevronUp } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import weddingMempelai from "@/assets/_elemen-undangan.png";

export default function Closing() {
  const config = useConfig();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="penutup"
      className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center py-20"
    >
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-6 max-w-md text-center flex flex-col items-center justify-center"
      >
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6 w-full"
        >
          {/* Element Image */}
          <motion.div
            variants={scaleIn}
            className="w-full max-w-[120px] mx-auto select-none opacity-80"
          >
            <img
              src={weddingMempelai}
              alt="Separator"
              className="object-contain w-full h-auto"
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-[#81a9bb]"
          >
            Terima Kasih
          </motion.h2>

          {/* Message */}
          <motion.p
            variants={fadeUp}
            className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto"
          >
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
            kedua mempelai.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-xs text-gray-500 leading-normal"
          >
            Atas kehadiran dan doa restu yang diberikan, kami ucapkan terima
            kasih.
          </motion.p>

          {/* Separator */}
          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-[1px] w-8 bg-[#81a9bb]/30" />
            <Heart className="w-3 h-3 text-[#81a9bb]/60" fill="currentColor" />
            <div className="h-[1px] w-8 bg-[#81a9bb]/30" />
          </motion.div>

          {/* Family Sign-off */}
          <motion.div variants={fadeUp} className="space-y-3 pt-2">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Kami yang berbahagia,
            </p>
            <h3 className="font-serif text-3xl text-[#81a9bb] tracking-wide font-medium">
              {config.groomName} & {config.brideName}
            </h3>
            <p className="text-[10px] text-gray-500 font-sans tracking-wide">
              Beserta seluruh keluarga besar
            </p>
          </motion.div>

          {/* Back to top button */}
          <motion.div variants={scaleIn} className="pt-8">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors text-[10px] uppercase tracking-wider font-semibold shadow-xs"
            >
              <ChevronUp className="w-3.5 h-3.5 text-[#81a9bb]" />
              Kembali ke Atas
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
