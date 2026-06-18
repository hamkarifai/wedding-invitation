import { useEffect, useState } from "react"; // Ditambahkan React hooks
import { motion } from "framer-motion";
import weddingMempelai from "@/assets/_elemen-undangan.png";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  useReducedMotionFlag,
} from "@/lib/motion";

const LandingPage = ({ onOpenInvitation }) => {
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");

  // State untuk menyimpan nama tamu secara dinamis
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    // Mengambil parameter '?to=' dari URL browser
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to");
    if (toParam) {
      setGuestName(decodeURIComponent(toParam));
    }
  }, []);

  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="visible"
      className="flex overflow-hidden relative justify-center items-center min-h-screen bg-slate-100"
    >
      {/* Decorative Background untuk area desktop */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 via-[#81a9bb]/5" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 bg-[#81a9bb]/10 hidden md:block" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 bg-[#81a9bb]/10 hidden md:block" />

      {/* KOTAK MOCKUP MOBILE (Frame HP di Tengah) */}
      <div className="relative w-full max-w-md h-screen md:h-[92vh] md:rounded-3xl md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] bg-[url('assets/_wedding-bg.jpeg')] bg-cover bg-center bg-no-repeat overflow-hidden border border-white/40">
        {/* Overlay halus di dalam kotak HP agar gambar bg tidak menubruk teks */}
        {/* <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-0" /> */}

        {/* Konten Utama di dalam Frame HP */}
        <div className="flex relative z-10 flex-col gap-6 justify-center items-center px-6 py-12 w-full h-full text-center">
          {/* Top Decorative Line */}
          <div className="flex gap-3 justify-center items-center">
            <div className="w-12 h-px bg-[#81a9bb]/80" />
            <div className="w-2 h-2 bg-[#81a9bb] rounded-full" />
            <div className="w-12 h-px bg-[#81a9bb]/80" />
          </div>

          {/* Couple Names & Guest Info Wrapper */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            className="space-y-5 w-full"
          >
            {/* Couple Names */}
            <motion.div variants={fadeUp} className="space-y-3">
              <img
                src={weddingMempelai}
                alt="Andy & Ida"
                className="object-cover mx-auto w-full max-w-[160px] h-[225px]"
              />
              <h1 className="font-serif text-4xl leading-tight text-[#81a9bb] sm:text-5xl">
                Andy
                <span className="mx-2 text-[#81a9bb] sm:mx-3">&</span>
                Ida
              </h1>
              <div className="mx-auto w-16 h-px bg-[#81a9bb]" />
            </motion.div>

            {/* AREA BARU: Kepada Nama Tamu Dinamis & Maaf Typo */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center pt-1 w-full"
            >
              <div className="w-full max-w-[280px] px-4 py-4 rounded-xl bg-white/80 shadow-sm border border-white/60 backdrop-blur-sm space-y-1.5">
                <p className="text-[10px] tracking-wider text-gray-400 font-medium">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <h2 className="px-1 text-base font-semibold text-gray-800 capitalize line-clamp-2">
                  {guestName || "Nama Tamu"}
                </h2>
                <div className="w-6 h-px bg-[#81a9bb]/40 mx-auto" />
                <p className="text-[9px] text-gray-400/90 italic leading-tight px-1">
                  *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Open Invitation Button */}
          <motion.div variants={fadeUp} className="w-full max-w-xs">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenInvitation}
              className="relative px-6 py-3 w-full font-medium text-white bg-[#81a9bb] rounded-xl shadow-md transition-all duration-200 group hover:bg-[#6c91a3]"
            >
              <span className="flex relative z-10 gap-2 justify-center items-center">
                <span>Buka Undangan</span>
                <motion.span
                  animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { repeat: Infinity, duration: LOOP.nudge }
                  }
                >
                  →
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6c91a3] to-[#81a9bb]/80 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
