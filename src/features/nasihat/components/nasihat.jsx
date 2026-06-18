import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useMotionPreset, staggerContainer } from "@/lib/motion";

export default function Nasihat() {
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <section
      id="nasihat"
      className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center py-20"
    >
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-6 max-w-md text-center"
      >
        {/* Section Header */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <motion.div
            variants={scaleIn}
            className="w-12 h-12 rounded-full bg-[#81a9bb]/10 flex items-center justify-center mx-auto text-[#81a9bb]"
          >
            <BookOpen className="w-6 h-6" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-[#81a9bb]"
          >
            Nasihat Pernikahan
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="space-y-6 px-6 py-8 rounded-2xl border border-white bg-white/80 shadow-md backdrop-blur-xs"
          >
            {/* Arabic Verse */}
            <p className="font-serif text-xl leading-loose text-gray-800 dir-rtl">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا
              لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ
              إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
            </p>

            <div className="w-8 h-px bg-[#81a9bb]/40 mx-auto" />

            {/* Translation */}
            <p className="text-xs text-gray-600 leading-relaxed italic">
              &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
              menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
              kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
              di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu
              benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
            </p>

            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              — QS. Ar-Rum: 21 —
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
