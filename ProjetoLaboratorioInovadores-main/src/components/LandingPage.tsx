/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#FFF5F6] via-[#FFF2F4] to-[#FFEBEF] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
      id="landing-container"
    >
      {/* Decorative ambient subtle circles in background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-300/10 blur-3xl pointer-events-none" />

      {/* Main emblem brand icon with smooth floating animation */}
      <div 
        className="flex justify-center mb-6 animate-pulse" 
        id="emblem-wrapper"
      >
        <div className="relative bg-[#C2113D] text-white p-5 rounded-3xl shadow-xl shadow-rose-900/10 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
          {/* Custom SVG shield heart matching screenshot */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16"
          >
            <path d="M11.645 20.91l-.007-.003-.003-.001a15.54 15.54 0 01-6.733-6.233C3.39 12.16 3 9.947 3 7.72c0-2.613 2.112-4.72 4.708-4.72 1.487 0 2.822.684 3.702 1.751C12.29 3.684 13.625 3 15.112 3c2.596 0 4.708 2.107 4.708 4.72 0 2.227-.39 4.44-1.902 6.953a15.542 15.542 0 01-6.733 6.233l-.003.001-.007.003L12 21l-.355-.09z" />
          </svg>
          <div className="absolute inset-0 bg-white/10 rounded-3xl pointer-events-none" />
        </div>
      </div>

      {/* App Branding Typography */}
      <h1 
        className="text-[44px] sm:text-[54px] font-black tracking-widest text-[#9c0a2f] m-0 mb-1 font-sans"
        id="landing-title"
      >
        SAFETYFEM
      </h1>
      <p 
        className="text-slate-600 text-sm sm:text-base font-medium max-w-sm leading-relaxed mb-12 font-sans"
        id="landing-subtitle"
      >
        Tecnologia Integrada para a Proteção da Mulher
      </p>

      {/* Rounded Pill Button matching the user's screenshot */}
      <div className="relative group transition-transform" id="landing-button-wrapper">
        <button
          onClick={onStart}
          id="btn-solucao-tecnologica"
          className="px-10 py-3.5 bg-white hover:bg-rose-50 border-2 border-[#C2113D] text-[#C2113D] font-bold text-sm sm:text-base rounded-full shadow-lg shadow-rose-950/5 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Solução Tecnológica
        </button>
      </div>

      {/* Decorative soft bottom shield emblem exactly like bottom-left watermark */}
      <div 
        className="absolute bottom-10 left-10 opacity-10 select-none pointer-events-none hidden sm:block" 
        id="bottom-watermark-shield"
      >
        <div className="w-16 h-16 bg-[#C2113D] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
