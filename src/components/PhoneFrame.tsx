import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900/40 p-4 md:p-8 backdrop-blur-2xl">
      {/* Decorative absolute glow or backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Bezel Container */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-neutral-950 rounded-[55px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[4px] border-neutral-800/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-inner">
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-800" />
          <div className="w-1.5 h-1.5 bg-blue-950 rounded-full" />
        </div>

        {/* Screen Highlight Reflection */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none z-40 rounded-[48px]" />

        {/* Inner Screen */}
        <div className="relative flex-1 bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#f8fafc] rounded-[42px] overflow-hidden flex flex-col select-none shadow-2xl">
          {/* Status Bar */}
          <div className="h-11 px-6 pt-3 flex justify-between items-center text-[13px] font-semibold text-slate-800 z-40 select-none">
            <span className="font-display tracking-tight ml-2">{time}</span>
            <div className="flex items-center gap-1.5 mr-2">
              <Signal size={14} className="text-slate-800" />
              <Wifi size={14} className="text-slate-800" />
              <div className="flex items-center gap-0.5">
                <Battery size={16} className="text-slate-800" />
              </div>
            </div>
          </div>

          {/* Child Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            {/* iOS Dynamic wallpaper blobs inside the screen for gorgeous glassmorphism depth */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 -right-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 left-1/4 w-48 h-48 bg-sky-300/30 rounded-full blur-2xl pointer-events-none" />
            
            {children}
          </div>

          {/* Home Indicator */}
          <div className="h-6 w-full flex justify-center items-end pb-1.5 z-40 bg-transparent pointer-events-none">
            <div className="w-32 h-1 bg-neutral-950/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
