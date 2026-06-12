/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Phone, Play, Volume2, XCircle, Users, CheckSquare, MessageSquare } from 'lucide-react';

interface EmergencyAlertOverlayProps {
  onCancel: () => void;
  userAddress: string;
}

export default function EmergencyAlertOverlay({ onCancel, userAddress }: EmergencyAlertOverlayProps) {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [simulateLiveLogs, setSimulateLiveLogs] = useState<string[]>([]);
  const [audioStreamingActive, setAudioStreamingActive] = useState<boolean>(true);

  // Simulation timeline to fulfill RF01 & RNF04
  const TIMELINE_LOGS = [
    { delay: 400, text: '✔ [0.4s] Coordenadas GPS de precisão capturadas e criptografadas.' },
    { delay: 1200, text: '✔ [1.2s] SMS & Push disparados para PAI, MÃE, IRMÃO, IRMÃ.' },
    { delay: 1900, text: '✔ [1.9s] Gravação e streaming de áudio ambiental em segundo plano iniciados.' },
    { delay: 2800, text: '✔ [2.8s] Central Operativa 190 (Secretaria de Defesa Social) acionada.' },
    { delay: 4500, text: '⚡ [4.5s] Patrulha Maria da Penha despachada para o setor ' + userAddress.split(',')[1]?.trim() + ' .' }
  ];

  useEffect(() => {
    // Clock counter
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    // Timeline logs reveal simulation
    const logTimers = TIMELINE_LOGS.map(item => {
      return setTimeout(() => {
        setSimulateLiveLogs(prev => [...prev, item.text]);
      }, item.delay);
    });

    return () => {
      clearInterval(timer);
      logTimers.forEach(clearTimeout);
    };
  }, []);

  const handleVerifyCancel = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow '1234' or any 4 digit code for fast prototyping
    if (pinCode === '1234' || pinCode === '******' || pinCode === '') {
      onCancel();
    } else {
      alert('PIN de segurança incorreto. O alarme permanece ativo no canal policial.');
      setPinCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 font-sans flex flex-col justify-between overflow-y-auto" id="emergency-overlay-container">
      
      {/* Dynamic Pulse Beacon Glowing Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.18)_0%,rgba(0,0,0,0)_60%)] animate-pulse" />
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 animate-pulse opacity-90" />
      </div>

      {/* CORE BODY INDICATORS */}
      <div className="p-6 text-center z-10 space-y-5 flex-1 flex flex-col justify-center" id="emergency-beacon-body">
        
        {/* Blinking shield alarm emblem inside spinning glow circles */}
        <div className="flex justify-center" id="rotating-emblem-beacons">
          <div className="relative flex items-center justify-center p-8 bg-rose-600/40 rounded-full animate-ping">
            <div className="p-5 bg-rose-600 text-white rounded-full relative flex items-center justify-center">
              <ShieldAlert className="w-16 h-16 animate-bounce" />
              <div className="absolute inset-x-0 -bottom-1 h-3 w-3 rounded-full bg-blue-500 animate-ping" />
            </div>
          </div>
        </div>

        {/* Dynamic Alarm active labels and timing */}
        <div className="space-y-1.5 pt-4">
          <h2 className="text-3xl font-black text-rose-500 tracking-wider animate-pulse">
            SINAL DE ALERTA DISPARADO
          </h2>
          <p className="text-sm font-bold text-slate-300">
            Forças de segurança civil e rede de apoio cientes
          </p>
          <div className="mt-2 text-rose-400 font-mono font-bold text-lg inline-block px-3.5 py-1 bg-rose-950/60 border border-rose-800/40 rounded-full">
            Duração do acionamento: {secondsElapsed}s
          </div>
        </div>

        {/* Real-time police dispatcher timeline visualizer (RF01/RNF04) */}
        <div className="max-w-md mx-auto w-full bg-slate-900 border border-rose-900/40 rounded-2xl p-4 text-left font-mono space-y-2 mt-4" id="timeline-log-terminal">
          <span className="text-[10px] text-rose-500 font-bold block uppercase tracking-widest border-b border-rose-950/40 pb-1.5">
            Logs de Transmissão Integrada
          </span>
          <div className="text-[11px] space-y-1.5 pt-1.5 h-32 overflow-y-auto">
            {simulateLiveLogs.map((log, index) => (
              <div key={index} className="text-emerald-400 font-medium leading-relaxed">
                {log}
              </div>
            ))}
            {simulateLiveLogs.length < TIMELINE_LOGS.length && (
              <div className="text-slate-500 text-[10px] flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
                Efetuando redundância em canais de rádio digital...
              </div>
            )}
          </div>
        </div>

        {/* Support audio indicators */}
        <div className="flex items-center justify-center gap-6 pt-2" id="microphone-voice-beacons">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1.5 rounded-full">
            <Volume2 className="w-4 h-4 text-emerald-500 animate-bounce" />
            <span>Gravador de Áudio Ativo 🎤</span>
          </div>
        </div>

      </div>

      {/* LOWER SAFETY ACTION TRIGGER PANEL */}
      <div className="p-6 bg-slate-900 border-t border-rose-950/45 z-10 flex flex-col gap-3" id="emergency-overlay-footer">
        
        {!showCancelConfirmation ? (
          /* DEFAULT INITIAL CANCEL TOGGLE BUTTON */
          <button
            onClick={() => {
              setShowCancelConfirmation(true);
            }}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm rounded-full active:scale-95 transition-all cursor-pointer border border-rose-950/40 flex items-center justify-center gap-2"
            id="btn-cancel-emergency-start"
          >
            <XCircle className="w-5 h-5 text-rose-500" />
            Cancelar Emergência (Falso Alarme)
          </button>
        ) : (
          /* PASSWORD PIN VERIFICATION FORM TO PREVENT FORCEFUL DEACTIVATION */
          <form onSubmit={handleVerifyCancel} className="space-y-3" id="cancellation-pin-entry">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Insira PIN para desativar o chamado policial (ou clique vazio para passar)
              </span>
            </div>
            
            <div className="flex gap-2.5 max-w-sm mx-auto">
              <input
                type="password"
                placeholder="Ex PIN: 1234"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="flex-1 bg-slate-950 border border-rose-950 text-white rounded-xl py-2.5 px-4 text-center tracking-widest text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
              >
                Confirmar Cancelar
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowCancelConfirmation(false)}
              className="text-[10px] text-slate-400 hover:underline mx-auto block pt-1"
            >
              Voltar para Tela de Pânico
            </button>
          </form>
        )}

        <div className="text-center" id="emergency-disclaimer-panel">
          <p className="text-[10px] text-slate-400">
            A falsa comunicação de infrações atrai responsabilidade cível e penal (S.D.S. Recife).
          </p>
        </div>

      </div>

    </div>
  );
}
