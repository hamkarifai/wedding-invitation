import { Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import weddingMempelai from "@/assets/_elemen-undangan.png";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  EASE,
  useReducedMotionFlag,
} from "@/lib/motion";

export default function Hero() {
  const config = useConfig();
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(6)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 6,
        color: i % 2 === 0 ? "text-[#81a9bb]/40" : "text-[#6c91a3]/30",
        initialX: typeof window !== "undefined" ? Math.random() * 320 : 0,
        animateX: typeof window !== "undefined" ? Math.random() * 320 : 0,
      })),
    );

    return (
      <div className="overflow-hidden absolute inset-0 z-0 pointer-events-none">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: 450,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -50,
            }}
            transition={{
              duration: LOOP.float,
              repeat: Infinity,
              delay: i * 1.2,
              ease: EASE.out,
            }}
            className="absolute"
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 4}px`,
                height: `${heart.size * 4}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.section
      id="home"
      variants={fade}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-[url('assets/_wedding-bg.jpeg')] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
    >
      {/* Konten Utama */}
      <div className="flex relative z-10 flex-col gap-5 justify-center items-center px-6 py-10 w-full max-w-md h-full min-h-screen text-center">
        {/* 1. Foto Vector Mempelai (Bagian Teratas) */}
        <motion.div variants={scaleIn} className="w-full max-w-[400px] mx-auto">
          <img
            src={weddingMempelai}
            alt="Elemen Pernikahan"
            className="object-contain w-full h-auto drop-shadow-sm"
          />
        </motion.div>

        {/* 2. Tulisan Walimatul Ursy */}
        <motion.div variants={scaleIn} className="inline-block mx-auto mt-1">
          <span className="px-4 py-1 text-[10px] tracking-widest uppercase bg-white/85 text-[#81a9bb] font-semibold rounded-full border border-white/60 shadow-xs backdrop-blur-xs">
            Walimatul &apos;Ursy
          </span>
        </motion.div>

        {/* 3. Nama Mempelai */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="space-y-2 w-full"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-500/90">
            InsyaAllah Kami Akan Menikah
          </p>
          <h2 className="font-serif text-4xl leading-tight text-[#81a9bb] sm:text-5xl tracking-wide font-medium drop-shadow-2xs">
            {config.groomName} & {config.brideName}
          </h2>
          <div className="mx-auto w-12 h-px bg-[#81a9bb]/60" />
        </motion.div>

        {/* 4. Tanggal Kecil (Ringkas & Minimalis) */}
        <motion.div variants={fadeUp} className="w-full max-w-[260px] mx-auto">
          <div className="relative px-4 py-3 space-y-2 rounded-xl border shadow-xs backdrop-blur-xs bg-white/75 border-white/50">
            <div className="flex flex-col gap-1.5 justify-center items-center text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-[#81a9bb]" />
                <span className="text-xs font-medium tracking-wide">
                  {formatEventDate(config.date, "full")}
                </span>
              </div>
            </div>

            <div className="w-4 h-px bg-[#81a9bb]/30 mx-auto" />
          </div>
        </motion.div>

        {/* Countdown Timer
        <CountdownTimer targetDate={config.date} /> */}

        <div className="flex relative justify-center pt-2 w-full">
          {!reduceMotion && <FloatingHearts />}
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.1, 1],
                    rotate: [0, 4, -4, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: LOOP.pulse,
                    repeat: Infinity,
                    ease: EASE.inOut,
                  }
            }
            className="z-10"
          >
            <Heart className="w-8 h-8 text-[#81a9bb]/80" fill="currentColor" />
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          ELEMEN TRANSISI: Memudarkan batas bawah background (Hero)
         ========================================================= */}
      <div className="absolute bottom-0 left-0 z-20 w-full h-28 bg-gradient-to-t from-white to-transparent pointer-events-none via-white/40" />
    </motion.section>
  );
}
