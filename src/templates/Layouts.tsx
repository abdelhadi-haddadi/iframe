
import { motion } from "motion/react";
import { CompositionData } from "../types";
import { PhoneMockup, LaptopMockup } from "../components/DeviceMockups";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface LayoutProps {
  data: CompositionData;
}

export const LuxuryLayout = ({ data }: LayoutProps) => {
  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden grain-noise font-hero selection:bg-indigo-500/30">
      {/* Cinematic Lighting & Atmospheric Background */}
      <div 
        className="absolute w-[1200px] h-[1200px] -right-[100px] -top-[200px] blur-[150px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${data.lights.glowColor}33, transparent 70%)`,
          opacity: data.lights.intensity * 0.3
        }}
      />
      <div 
        className="absolute w-[800px] h-[800px] -left-[100px] -bottom-[100px] blur-[120px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${data.lights.glowColor}22, transparent 60%)`,
          opacity: data.lights.intensity * 0.2
        }}
      />
      
      {/* Sculptural Outline Circles (Apple Style) */}
      <div className="absolute w-[900px] h-[900px] -left-[5%] -bottom-[15%] border border-white/[0.05] rounded-full pointer-events-none z-0" />
      <div className="absolute w-[1200px] h-[1200px] left-[10%] -top-[35%] border border-white/[0.05] rounded-full pointer-events-none z-0 opacity-40" />
      <div className="absolute w-[600px] h-[600px] right-[5%] top-[15%] border border-white/[0.02] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full h-full px-20 lg:px-24 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-16 items-center">
          
          {/* Left Block: Editorial Text */}
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-5 flex flex-col"
          >
            {/* Small Logo Square */}
            {data.brand.logoUrl ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center mb-16 backdrop-blur-2xl bg-white/[0.02] shadow-2xl group hover:border-white/20 transition-all duration-500"
              >
                 <img src={data.brand.logoUrl} alt="logo" className="w-8 h-8 object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ) : (
              <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center mb-16 backdrop-blur-2xl bg-white/[0.02]">
                 <div className="w-3 h-3 rounded-full border border-white/30" />
              </div>
            )}

            {/* Huge Serif Title */}
            <h1 
              className="text-[110px] lg:text-[140px] font-hero leading-[0.8] tracking-[-0.06em] mb-16 text-white font-medium italic"
              style={{ fontFamily: data.brand.typography.primary }}
            >
              {data.title}
            </h1>

            {/* Underlined Feature List */}
            <div className="flex flex-col gap-10">
              {data.features.slice(0, 3).map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 1 }}
                  className="w-fit border-b border-white/10 pb-4 group cursor-default"
                >
                  <span 
                    className="text-2xl lg:text-3xl font-hero font-light text-white/30 group-hover:text-white transition-all duration-700 ease-out inline-block translate-y-0 group-hover:-translate-y-1"
                    style={{ fontFamily: data.brand.typography.secondary }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Area: Layered Mockups */}
          <div className="col-span-12 lg:col-span-7 relative flex items-center justify-end">
             {/* Desktop Mockup */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, x: 100, y: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full z-10 pr-12 lg:pr-20"
             >
                <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-[0_100px_160px_-40px_rgba(0,0,0,1)] bg-[#050505] group transition-all duration-1000 hover:scale-[1.01] hover:border-white/20">
                  <LaptopMockup>
                    <img src={data.screenshots.desktop} className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 ease-in-out" />
                  </LaptopMockup>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                </div>
             </motion.div>

             {/* Floating iPhone Overlapping (Premium Realism) */}
             <motion.div 
                initial={{ opacity: 0, x: 100, y: 120 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.9, duration: 1.5, type: "spring", bounce: 0.2 }}
                className="absolute -bottom-8 right-0 lg:right-10 w-[240px] lg:w-[280px] z-20"
             >
                <div className="p-3.5 bg-gradient-to-br from-[#222] to-[#080808] rounded-[56px] shadow-[0_80px_140px_-30px_rgba(0,0,0,1)] border border-white/20 backdrop-blur-3xl group">
                  <div className="relative pt-6 pb-2 px-2.5 rounded-[44px] overflow-hidden bg-[#000] aspect-[390/844]">
                     {/* Dynamic Island */}
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10 border border-white/10" />
                     <img src={data.screenshots.mobile} className="w-full h-full object-cover rounded-[36px] opacity-90 group-hover:opacity-100 transition-opacity duration-1000" />
                     <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] pointer-events-none" />
                     {/* Realistic Gloss */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
                </div>
             </motion.div>

             {/* Layered Crop Overlay (The right edge accent) */}
             <motion.div 
                initial={{ opacity: 0, x: 150 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.2, duration: 2 }}
                className="absolute -right-[40%] top-1/2 -translate-y-1/2 w-[600px] border-l border-white/[0.03] overflow-hidden hidden xl:block pointer-events-none"
             >
                <img src={data.screenshots.desktop} className="w-full h-auto blur-3xl scale-150 transform translate-x-40 opacity-40 rotate-6" />
             </motion.div>
          </div>
        </div>
      </div>

      {/* Cinematic Metadata Footer */}
      <div className="absolute bottom-12 left-20 right-20 flex justify-between items-center z-20">
         <div className="flex gap-20 opacity-30 text-[11px] uppercase tracking-[0.7em] font-bold text-white">
            <span className="hover:opacity-100 transition-opacity cursor-default">{data.domain || 'PLATFORM.IO'}</span>
            <span className="hover:opacity-100 transition-opacity cursor-default">{data.instagram || '@CREATIVE'}</span>
         </div>
         <div className="h-[1px] flex-1 mx-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="opacity-30 text-[11px] uppercase tracking-[0.7em] font-bold text-white whitespace-nowrap">
            EDITION / {data.brand.name} / © 2026
         </div>
      </div>
    </div>
  );
};

export const EditorialLayout = ({ data }: LayoutProps) => {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-24 bg-[#FAFAFA] text-black overflow-hidden font-serif">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        <div className="w-full max-w-7xl grid grid-cols-12 gap-16 relative z-10">
           <motion.div className="col-span-12 mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <p className="text-[10px] uppercase tracking-[0.8em] font-bold mb-6 opacity-30 ml-1">Case Portfolio / 01</p>
             <h1 
               className="text-[14vw] leading-[0.7] tracking-tighter opacity-[0.03] absolute -top-16 -left-12 select-none pointer-events-none whitespace-nowrap italic font-serif"
               style={{ fontFamily: data.brand.typography.primary }}
             >
               {data.brand.name}
             </h1>
           </motion.div>

           <div className="col-span-12 lg:col-span-4 flex flex-col justify-center gap-16 pt-12">
              <div className="space-y-10">
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="text-7xl mb-10 leading-[1.1] tracking-tight font-medium italic"
                  style={{ fontFamily: data.brand.typography.primary }}
                >
                  {data.title}
                </motion.h2>
                <div className="w-12 h-px bg-black/10" />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl opacity-60 leading-relaxed font-sans font-light"
                  style={{ fontFamily: data.brand.typography.secondary }}
                >
                  {data.description}
                </motion.p>
              </div>

              <div className="flex flex-col gap-4">
                {data.features.map((f, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 border-l-2 border-black/5 pl-6 py-1 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: data.brand.typography.secondary }}
                  >
                    {f}
                  </motion.div>
                ))}
              </div>
           </div>

           <div className="col-span-12 lg:col-span-8 relative flex items-center justify-end h-full py-12">
              <motion.div 
                className="w-[90%] relative z-10 shadow-[0_80px_120px_rgba(0,0,0,0.12)] rounded-3xl overflow-hidden border border-black/5" 
                initial={{ scale: 1.05, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={data.screenshots.desktop} className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-1000" />
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-6 w-[240px] z-20 shadow-[0_60px_100px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden border-8 border-white" 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.2 }}
              >
                 <img src={data.screenshots.mobile} className="w-full h-auto" />
              </motion.div>
           </div>
        </div>

        <div className="absolute bottom-12 left-20 right-20 flex justify-between items-center opacity-30 text-[10px] uppercase tracking-[0.6em] font-bold">
           <div className="flex gap-16">
             <span>{data.domain || 'SHOWCASE.COM'}</span>
             <span>{data.instagram || '@STUDIO'}</span>
           </div>
           <div className="flex items-center gap-8">
              <span>Curated Layout</span>
              <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
              <span>© 2026 Archive</span>
           </div>
        </div>
      </div>
    );
};
export const CinemaLayout = ({ data }: LayoutProps) => {
  return (
    <div className="relative w-full h-full bg-[#080808] overflow-hidden grain-noise font-hero selection:bg-indigo-500/30">
      {/* Cinematic Lighting & Atmospheric Background */}
      <div 
        className="absolute w-[1000px] h-[1000px] -right-[200px] -top-[300px] blur-[140px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${data.lights.glowColor}44, transparent 70%)`,
          opacity: data.lights.intensity * 0.25
        }}
      />
      
      {/* Sculptural Background Circles (Apple Style Outlines) */}
      <div className="absolute w-[800px] h-[800px] -left-[10%] -bottom-[20%] border border-white/5 rounded-full pointer-events-none z-0" />
      <div className="absolute w-[1100px] h-[1100px] left-[5%] -top-[40%] border border-white/5 rounded-full pointer-events-none z-0 opacity-50" />
      <div className="absolute w-[600px] h-[600px] right-[10%] top-[10%] border border-white/[0.03] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full h-full px-20 lg:px-24 py-20 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Brand & Editorial Content */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-5 flex flex-col"
          >
            {/* Minimal Square Logo */}
            {data.brand.logoUrl ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center mb-20 backdrop-blur-3xl bg-white/[0.03] shadow-2xl overflow-hidden group hover:border-white/20 transition-colors"
              >
                 <img src={data.brand.logoUrl} alt="logo" className="w-9 h-9 object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ) : (
              <div className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center mb-20 backdrop-blur-3xl bg-white/[0.03]">
                 <div className="w-4 h-4 rounded-full border border-white/20" />
              </div>
            )}

            {/* Giant Editorial Headline */}
            <h1 
              className="text-[100px] lg:text-[130px] font-hero leading-[0.82] tracking-[-0.05em] mb-20 text-white font-medium italic"
              style={{ fontFamily: data.brand.typography.primary }}
            >
              {data.title}
            </h1>

            {/* Underlined Feature List (Apple Style Typography) */}
            <div className="flex flex-col gap-10">
              {data.features.slice(0, 3).map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                  className="w-fit border-b border-white/20 pb-4 group cursor-default"
                >
                  <span 
                    className="text-2xl lg:text-3xl font-hero font-light text-white/40 group-hover:text-white transition-all duration-500 ease-out inline-block translate-y-0 group-hover:-translate-y-1"
                    style={{ fontFamily: data.brand.typography.secondary }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Dynamic Layered Mockups */}
          <div className="col-span-12 lg:col-span-7 relative flex items-center justify-end">
             {/* Main Laptop Presentation */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.98, x: 80, y: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[95%] z-10"
             >
                <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-[0_120px_180px_-40px_rgba(0,0,0,1)] bg-[#030303] group transition-transform duration-1000 hover:scale-[1.02]">
                  <img src={data.screenshots.desktop} className="w-full h-auto block grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </div>
             </motion.div>

             {/* Overlapping Floating iPhone (Premium Realism) */}
             <motion.div 
                initial={{ opacity: 0, x: 120, y: 150 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7, duration: 1.4, type: "spring", bounce: 0.25 }}
                className="absolute bottom-16 -left-12 w-[240px] z-20"
             >
                <div className="p-3 bg-gradient-to-br from-[#1c1c1e] to-[#0a0a0a] rounded-[52px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)] border border-white/15 backdrop-blur-xl">
                  <div className="relative pt-6 pb-2 px-2 rounded-[42px] overflow-hidden bg-[#050505] aspect-[390/844]">
                     {/* Dynamic Island Reflection */}
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10 ring-1 ring-white/10" />
                     <img src={data.screenshots.mobile} className="w-full h-full object-cover rounded-[34px] opacity-90 hover:opacity-100 transition-opacity duration-700" />
                     <div className="absolute inset-0 rounded-[34px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
                  </div>
                </div>
             </motion.div>

             {/* Minimalist Layered Crop Overlay (Behance Style) */}
             <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute -right-[30%] top-1/2 -translate-y-1/2 w-[550px] border-l border-white/5 overflow-hidden hidden xl:block pointer-events-none"
             >
                <img src={data.screenshots.desktop} className="w-full h-auto blur-xl scale-125 transform translate-x-32 opacity-50" />
             </motion.div>
          </div>
        </div>
      </div>

      {/* Cinematic Footer Metadata */}
      <div className="absolute bottom-12 left-16 right-16 flex justify-between items-center z-20">
         <div className="flex gap-16 opacity-30 text-[10px] uppercase tracking-[0.6em] font-bold text-white">
            <span className="hover:opacity-100 transition-opacity cursor-default">{data.domain || 'SHOWCASE.NET'}</span>
            <span className="hover:opacity-100 transition-opacity cursor-default">{data.instagram || '@STUDIO.AI'}</span>
         </div>
         <div className="h-[1px] flex-1 mx-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="opacity-25 text-[10px] uppercase tracking-[0.6em] font-bold text-white whitespace-nowrap">
            PREMIUM CASE / © 2026 / 8K RENDER
         </div>
      </div>
    </div>
  );
};

export const SaasLayout = ({ data }: LayoutProps) => {
  return (
    <div className="relative w-full h-full bg-[#FAFBFF] text-slate-900 overflow-hidden flex items-center justify-center p-20 font-sans">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-indigo-100/50 rounded-full blur-[160px]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[160px]" />
      
      <div className="w-full max-w-7xl grid grid-cols-12 gap-20 relative z-10 items-center">
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-12">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Product Engineering</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-7xl font-bold tracking-tight leading-[1.05] text-slate-900"
              style={{ fontFamily: data.brand.typography.primary }}
            >
              Building the <span className="text-indigo-600">Future</span> of {data.brand.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-slate-500 leading-relaxed max-w-md font-light"
              style={{ fontFamily: data.brand.typography.secondary }}
            >
              {data.description}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.features.slice(0, 3).map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group flex items-center gap-6 p-5 rounded-2xl bg-white/50 border border-slate-200 shadow-sm backdrop-blur-md hover:border-indigo-200 hover:bg-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                   <ArrowRight className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400">Optimization {i+1}</p>
                   <p className="text-md font-semibold text-slate-800">{f}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 relative flex items-center justify-center perspective-1000">
           <motion.div 
            initial={{ opacity: 0, rotateY: 10, x: 50 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12),0_30px_60px_-30px_rgba(0,0,0,0.15)] rounded-2xl border border-white overflow-hidden bg-white"
          >
            <img src={data.screenshots.desktop} className="w-full h-auto grayscale-[10%] hover:grayscale-0 transition-all duration-1000" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 100, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.3 }}
            className="absolute -bottom-10 -left-16 w-[260px] rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] border-8 border-white overflow-hidden z-20"
          >
            <img src={data.screenshots.mobile} className="w-full h-auto" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-12 left-16 right-16 flex items-center justify-between opacity-50 text-[10px] uppercase tracking-[0.5em] font-bold text-slate-400">
        <div className="flex gap-16">
          <span>{data.domain || 'PLATFORM.IO'}</span>
          <span>{data.instagram || '@SAASTOOL'}</span>
        </div>
        <div className="flex items-center gap-10">
          <span>V02.04.26</span>
          <div className="w-10 h-px bg-slate-200" />
          <span>Product Showcase</span>
        </div>
      </div>
    </div>
  );
};
