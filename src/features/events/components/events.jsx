import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import EventCards from "./events-card";

export default function Events() {
  const config = useConfig();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <section
      id="acara"
      className="min-h-screen relative overflow-hidden bg-white py-20"
    >
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-4 max-w-md"
      >
        {/* Section Header */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-3 mb-12"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-[#81a9bb] text-sm tracking-widest uppercase font-semibold"
          >
            Save the Date
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-serif text-gray-800 leading-tight"
          >
            Rangkaian Acara
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed"
          >
            Dengan memohon rahmat & ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk menghadiri momen bahagia kami.
          </motion.p>

          {/* Decorative Divider */}
          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <div className="h-[1px] w-10 bg-[#81a9bb]/30" />
            <div className="text-[#81a9bb]/80">
              <Heart className="w-3.5 h-3.5" fill="currentColor" />
            </div>
            <div className="h-[1px] w-10 bg-[#81a9bb]/30" />
          </motion.div>
        </motion.div>

        {/* Events Grid / Cards */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <EventCards events={config.agenda || []} />
        </motion.div>
      </motion.div>
    </section>
  );
}
