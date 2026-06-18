import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import weddingMempelai from "@/assets/_elemen-undangan.png";

export default function BrideGroom() {
  const config = useConfig();
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <motion.section
      id="mempelai"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={staggerContainer()}
      className="relative min-h-screen bg-[url('assets/_wedding-bg.jpeg')] bg-cover bg-center bg-no-repeat flex flex-col items-center py-12 overflow-hidden"
    >
      {/* ELEMEN TRANSISI: Biar potongan background atas (Hero) ga patah */}
      <div className="absolute top-0 left-0 z-20 w-full h-28 bg-gradient-to-b from-white to-transparent pointer-events-none via-white/40" />

      {/* Container utama max-w-md biar presisi mobile-first dengan gap rapat */}
      <div className="flex relative z-10 flex-col gap-4 items-center px-6 w-full max-w-md text-center">
        {/* =========================================================
            1. BISMILLAH
           ========================================================= */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-1 w-full select-none"
        >
          <p className="font-serif text-3xl font-medium tracking-wide leading-normal text-gray-800 sm:text-4xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </motion.div>

        {/* Ayat / Teks Pengantar */}
        <motion.p
          variants={fadeUp}
          className="px-4 mb-3 font-sans text-xs leading-relaxed text-gray-700/90"
        >
          Maha suci Allah yang telah menciptakan makhluk-Nya
          berpasangan-pasangan. Ya Allah perkenankanlah kami, untuk melaksanakan
          Sunnah Rasul-Mu dalam membentuk keluarga yang sakinah, mawaddah,
          warahmah.
        </motion.p>

        {/* =========================================================
            2. SEPARATOR / PEMBATAS LOVE
           ========================================================= */}
        <motion.div
          variants={scaleIn}
          className="w-full max-w-[180px] flex items-center justify-center gap-3 mx-auto mb-6 select-none opacity-60"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#81a9bb]" />
          <Heart className="w-3.5 h-3.5 text-[#81a9bb]" fill="currentColor" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#81a9bb]" />
        </motion.div>

        {/* =========================================================
            3. MEMPELAI WANITA - BRIDE (With Card Wrapper)
           ========================================================= */}
        <div className="flex flex-col items-center mb-4 w-full">
          {/* Frame Foto Lingkaran */}
          <motion.div
            variants={scaleIn}
            className="w-44 h-44 rounded-full p-1.5 bg-white shadow-md border border-white/60 mb-4 relative z-20"
          >
            <div className="overflow-hidden w-full h-full rounded-full border-2 border-white bg-slate-100">
              <img
                src={weddingMempelai}
                alt={config.brideFullName}
                className="object-cover object-center w-full h-full scale-105"
              />
            </div>
          </motion.div>

          {/* Wrapper Bungkusan Nama & Silsilah */}
          <motion.div
            variants={fadeUp}
            className="space-y-2.5 w-full px-5 py-5 rounded-2xl border border-white/60 shadow-xs backdrop-blur-xs bg-white/75 relative z-10 -mt-10 pt-12"
          >
            <h3 className="font-serif text-3xl text-[#81a9bb] tracking-wide font-medium">
              {config.brideFullName || "Fulanah Bin Fulan"}
            </h3>
            <p className="font-serif text-xl font-medium tracking-wide text-gray-700">
              {config.brideArabicName || "فلانة بنت فلان"}
            </p>
            <div className="mx-auto w-8 h-px bg-[#81a9bb]/30" />
            <p className="text-[11px] text-gray-500 font-sans tracking-wide leading-normal">
              Putri {config.brideChildOrder || "pertama"} dari <br />
              <span className="font-medium text-gray-700">
                Bapak {config.brideFather || "Fulan"} dan Ibu{" "}
                {config.brideMother || "Fulanah"}
              </span>
            </p>
          </motion.div>
        </div>

        {/* Ampersand (&) Pembatas Tengah */}
        <motion.div
          variants={scaleIn}
          className="font-serif text-2xl text-[#81a9bb]/70 italic my-1 select-none"
        >
          &
        </motion.div>

        {/* =========================================================
            4. MEMPELAI PRIA - GROOM (With Card Wrapper)
           ========================================================= */}
        <div className="flex flex-col items-center mt-2 w-full">
          {/* Frame Foto Lingkaran */}
          <motion.div
            variants={scaleIn}
            className="w-44 h-44 rounded-full p-1.5 bg-white shadow-md border border-white/60 mb-4 relative z-20"
          >
            <div className="overflow-hidden w-full h-full rounded-full border-2 border-white bg-slate-100">
              <img
                src={weddingMempelai}
                alt={config.groomFullName}
                className="object-cover object-center w-full h-full scale-105"
              />
            </div>
          </motion.div>

          {/* Wrapper Bungkusan Nama & Silsilah */}
          <motion.div
            variants={fadeUp}
            className="space-y-2.5 w-full px-5 py-5 rounded-2xl border border-white/60 shadow-xs backdrop-blur-xs bg-white/75 relative z-10 -mt-10 pt-12"
          >
            <h3 className="font-serif text-3xl text-[#81a9bb] tracking-wide font-medium">
              {config.groomFullName || "Fulan Bin Fulan"}
            </h3>
            <p className="font-serif text-xl font-medium tracking-wide text-gray-700">
              {config.groomArabicName || "فلان بن فلان"}
            </p>
            <div className="mx-auto w-8 h-px bg-[#81a9bb]/30" />
            <p className="text-[11px] text-gray-500 font-sans tracking-wide leading-normal">
              Putra {config.groomChildOrder || "bungsu"} dari <br />
              <span className="font-medium text-gray-700">
                Bapak {config.groomFather || "Fulan"} dan Ibu{" "}
                {config.groomMother || "Fulanah"}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
