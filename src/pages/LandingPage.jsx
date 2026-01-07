import LoginCard from "@/components/auth/LoginCard";
import React from "react";
import doodleUrl from "../assets/doodle.svg";

const LandingPage = () => {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden bg-linear-to-br from-teal-50 via-sky-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Doodle background */}
      <img
        src={doodleUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-15"
        style={{
          maskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 70%)",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-32 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-600/5" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-600/5" />

      {/* Auth card wrapper */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl shadow-teal-900/5">
          <LoginCard />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
