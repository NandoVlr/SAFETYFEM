/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Clock, MapPin, AlertTriangle, Play, X, Shield, PlusCircle, Volume2 } from 'lucide-react';
import { CustomRoute } from '../types';

interface CheckinTabProps {
  onCheckinStarted: (destination: string, eta: string) => void;
  onCheckinEnded: (wasSuccessful: boolean) => void;
  onAutoTriggerEmergency: () => void;
}

export default function CheckinTab({ onCheckinStarted, onCheckinEnded, onAutoTriggerEmergency }: CheckinTabProps) {
  const [destination, setDestination] = useState<string>('Casa');
  const [etaTime, setEtaTime] = useState<string>('18:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [activeRoute, setActiveRoute] = useState<CustomRoute | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [showStatusSuccessModal, setShowStatusSuccessModal] = useState<boolean>(false);
  
  // Simulated checkpoints along the route
  const [checkpoints, setCheckpoints] = useState([
    { id: 'cp1', name: 'Entrada da Estação de Metrô', isConfirmed: true, timeOffset: 3 },
    { id: 'cp2', name: 'Faixa Pedestre da Av. Principal', isConfirmed: false, timeOffset: 8 },
    { id: 'cp3', name: 'Rua São Jerônimo Entrada', isConfirmed: false, timeOffset: 12 }
  ]);

  // Timer logic for active journey
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRoute && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Auto fail trigger if countdown ends (no safe checkout)
            handleAutoFailedJourneyAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRoute, secondsRemaining]);

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !etaTime) return;

    // Convert minutes based representation for standard simulation
    const totalSeconds = durationMinutes * 60;
    
    const route: CustomRoute = {
      id: Math.random().toString(),
      destinationName: destination,
      etaTime,
      durationMinutes,
      isActive: true,
      checkpointsConfirmations: checkpoints
    };

    setActiveRoute(route);
    setSecondsRemaining(totalSeconds);
    onCheckinStarted(destination, etaTime);
  };

  const handleConfirmArrival = () => {
    onCheckinEnded(true);
    setActiveRoute(null);
    setShowStatusSuccessModal(true);
    setTimeout(() => setShowStatusSuccessModal(false), 3000);
  };

  const handleExtendJourneyTime = () => {
    // Add 5 minutes to active countdown
    setSecondsRemaining(prev => prev + 300);
    setDurationMinutes(prev => prev + 5);
    alert('Simulador: Período de segurança estendido em mais 5 minutos. Status atualizado nos canais públicos de monitoramento.');
  };

  const handleAutoFailedJourneyAlert = () => {
    setActiveRoute(null);
    onCheckinEnded(false);
    onAutoTriggerEmergency(); // Instantly fire the general alarm
    alert('Alerta Crítico: Limite de tempo de rota excedido sem confirmação de segurança! Forças de segurança e contatos de confiança alertados com urgência (RF06).');
  };

  const toggleCheckpoint = (id: string) => {
    setCheckpoints(prev =>
      prev.map(cp => (cp.id === id ? { ...cp, isConfirmed: !cp.isConfirmed } : cp))
    );
  };

  // Format countdown string
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex-1 bg-white p-5 flex flex-col font-sans overflow-y-auto" id="checkin-tab-root">
      
      {/* Title Header with Back Arrow style */}
      <h2 className="text-2xl font-black text-[#0F172A] mb-6" id="checkin-tab-title">
        Check-in Inteligente
      </h2>

      {/* Success Modal Toast Overlay */}
      {showStatusSuccessModal && (
        <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 p-4 rounded-2xl mb-5 flex items-center gap-3 animate-bounce" id="success-checkin-modal">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Trajeto Concluído com Sucesso!</p>
            <p className="text-xs text-emerald-700/90 leading-tight">Suas conexões e autoridades foram informadas de sua chegada tranquila.</p>
          </div>
        </div>
      )}

      {!activeRoute ? (
        /* SETUP ROUTE VIEW */
        <div className="space-y-5" id="checkin-setup-form-wrapper">
          <div className="bg-[#FFF5F6] border border-rose-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
            <p className="font-bold text-[#C2113D] mb-1 flex items-center gap-1.5 text-sm">
              <Compass className="w-4 h-4" /> Cadastre seu Destino do Dia
            </p>
            Defina seu destino (trabalho, residência, faculdade) e o horário máximo esperado de chegada. Se o tempo expirar antes de você confirmar sua chegada, o sistema enviará um sinal de perseguição de forma autônoma para seus guardiões de emergência.
          </div>

          <form onSubmit={handleStartJourney} className="space-y-4" id="checkin-registration-form">
            {/* Destino input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 text-xs font-bold uppercase tracking-wide">Destino do Trajeto</label>
                {destination && (
                  <button type="button" onClick={() => setDestination('')} className="text-slate-400 hover:text-slate-600 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-4.5 h-4.5 text-[#C2113D]" />
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Casa, Trabalho, Faculdade de Direito"
                  className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                  required
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {['Casa', 'Trabalho', 'Faculdade', 'Parada do Ônibus'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDestination(preset)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-full text-[10px] font-bold transition-all border border-slate-200"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Time Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wide mb-1">Horário Previsto</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="time"
                    value={etaTime}
                    onChange={(e) => setEtaTime(e.target.value)}
                    className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wide mb-1">Duração Estimada</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                >
                  <option value={1}>1 Minuto (Para Demonstration)</option>
                  <option value={10}>10 Minutos</option>
                  <option value={20}>20 Minutos</option>
                  <option value={30}>30 Minutos</option>
                  <option value={60}>1 Hora</option>
                </select>
              </div>
            </div>

            {/* Checkpoints checklist sub-module */}
            <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Simular Checkpoints da Rota</span>
              <div className="space-y-2">
                {checkpoints.map(cp => (
                  <label key={cp.id} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={cp.isConfirmed}
                      onChange={() => toggleCheckpoint(cp.id)}
                      className="rounded border-slate-300 text-rose-500 focus:ring-rose-400"
                    />
                    <span>{cp.name} (Aprox. +{cp.timeOffset}m)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Iniciar trajeto burgundy button exactly like mockup */}
            <button
              type="submit"
              className="w-full py-4 bg-[#C2113D] hover:bg-[#A10D31] text-white font-extrabold text-sm rounded-full shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-rose-950/5"
              id="btn-iniciar-trajeto"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              Iniciar trajeto
            </button>
          </form>
        </div>
      ) : (
        /* MONITORING ACTIVE JOURNEY VIEW */
        <div className="space-y-6 flex-1 flex flex-col justify-between" id="checkin-active-status-wrapper">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 block mb-1">
              • TRAJETO PROTEGIDO ATIVO •
            </span>
            <h3 className="text-slate-800 font-extrabold text-lg">
              Rumo a: <span className="text-[#C2113D]">{activeRoute.destinationName}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Vínculos de confiança monitorando em tempo real • Horário Limite: {activeRoute.etaTime}
            </p>
          </div>

          {/* GIANT COUNTDOWN CLOCK TIMER SIMULATOR */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-slate-100 rounded-3xl shrink-0">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Tempo de Tolerância Restante</span>
            <div className="text-5xl font-black text-slate-800 font-mono tracking-wider flex items-center gap-1">
              <span>{formatTime(secondsRemaining)}</span>
            </div>
            {secondsRemaining < 60 && (
              <span className="text-red-600 font-bold text-xs mt-2 animate-bounce flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Responda logo para prevenir alarme institucional!
              </span>
            )}
          </div>

          {/* Active Checkpoints checklist visualizer */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Verificação de Checkpoints</span>
            <div className="space-y-2">
              {checkpoints.map(cp => (
                <div key={cp.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                  <span className="font-semibold text-slate-700">{cp.name}</span>
                  <button
                    onClick={() => toggleCheckpoint(cp.id)}
                    className={`px-3 py-1 rounded-full font-bold text-[9px] transition-all ${cp.isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {cp.isConfirmed ? '✓ Confirmado' : 'Marcar Confirmado'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Multi Action Controller Buttons */}
          <div className="space-y-3" id="checkin-flow-controls">
            <button
              onClick={handleConfirmArrival}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-full shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-confirmar-chegada"
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              Confirmar Chegada (Tudo Bem)
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExtendJourneyTime}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all border border-slate-200"
                title="Estender rota por atraso comum de transporte"
              >
                + 5m (Atraso)
              </button>
              <button
                onClick={handleAutoFailedJourneyAlert}
                className="py-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-xl transition-all border border-rose-200"
                title="Sinto-me insegura agora - disparar chamado"
              >
                Disparar Alerta Antiaproximação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
