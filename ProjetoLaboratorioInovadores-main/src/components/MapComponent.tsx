/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Users, Radio, AlertOctagon, Plus, MapPinOff, Navigation } from 'lucide-react';
import { Occurrence, RiskZone } from '../types';

interface MapComponentProps {
  currentLat: number;
  currentLng: number;
  onLocationChange?: (lat: number, lng: number, addressName: string) => void;
  isEmergencyAlertActive: boolean;
  occurrences: Occurrence[];
  riskZones: RiskZone[];
  showRiskZones: boolean;
  onAddOccurrenceAtLocation?: (lat: number, lng: number) => void;
}

export default function MapComponent({
  currentLat,
  currentLng,
  onLocationChange,
  isEmergencyAlertActive,
  occurrences,
  riskZones,
  showRiskZones,
  onAddOccurrenceAtLocation
}: MapComponentProps) {
  // Map interactive state
  const [zoomLevel, setZoomLevel] = useState<number>(3); // 1 = outer, 5 = close-up
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<'all' | 'safe' | 'risk'>('all');
  
  // Patrol Car Simulation
  const [patrolPosition, setPatrolPosition] = useState<{ x: number; y: number }>({ x: 10, y: 10 });
  const [patrolActive, setPatrolActive] = useState<boolean>(false);
  const [etaText, setEtaText] = useState<string>('');

  // Local state for dragging the user pin directly
  const [userMapCoords, setUserMapCoords] = useState<{ x: number; y: number }>({ x: 48, y: 55 });

  // Safety stations mapped visually
  const supportStations = [
    { id: 'st1', name: 'Delegacia Especializada da Mulher (Santo Amaro)', x: 62, y: 28 },
    { id: 'st2', name: 'Posto de Segurança Integrada (Imbiribeira)', x: 46, y: 58 },
    { id: 'st3', name: 'Base Guarda Municipal (Boa Viagem)', x: 65, y: 78 }
  ];

  // Whenever zoom changes, adjust visual representation
  const zoomScale = zoomLevel === 1 ? 0.6 : zoomLevel === 2 ? 0.8 : zoomLevel === 3 ? 1.0 : zoomLevel === 4 ? 1.3 : 1.7;

  // Track the patrol movement if emergency is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmergencyAlertActive) {
      setPatrolActive(true);
      // Reset position to be far away initially
      setPatrolPosition({ x: 15, y: 20 });
      setEtaText('Viatura acionada: ETA 2m 45s');

      interval = setInterval(() => {
        setPatrolPosition(prev => {
          const dx = userMapCoords.x - prev.x;
          const dy = userMapCoords.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 3) {
            setEtaText('Viatura da Patrulha Maria da Penha no local!');
            clearInterval(interval);
            return userMapCoords;
          }
          
          // Move towards user position
          const step = 2.5;
          setEtaText(`Patrulha em deslocamento acelerado (Distância: ${Math.round(distance * 15)}m)`);
          return {
            x: prev.x + (dx / distance) * step,
            y: prev.y + (dy / distance) * step
          };
        });
      }, 1000);
    } else {
      setPatrolActive(false);
      setEtaText('');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmergencyAlertActive, userMapCoords]);

  // Handle map click for adding dynamic occurrence or relocating
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Shift map coordinates representing zoom/center offsets
    const mapX = Math.max(5, Math.min(95, mapCenter.x + (clickX - 50) / zoomScale));
    const mapY = Math.max(5, Math.min(95, mapCenter.y + (clickY - 50) / zoomScale));

    // Relocate active user to clicked spot to simulate walking / relocation
    setUserMapCoords({ x: mapX, y: mapY });
    
    // Simulate reverse geocoding
    let addressLabel = 'Rua Bernardo de Campos, Imbiribeira - PE';
    if (mapY < 35) {
      addressLabel = 'Av. Governador Agamenon Magalhães, Santo Amaro';
    } else if (mapY > 70) {
      addressLabel = 'Av. Boa Viagem, Próximo ao Mar';
    } else if (mapX < 40) {
      addressLabel = 'Rua do Acre, Afogados';
    }

    if (onLocationChange) {
      onLocationChange(-8.05 + (mapY / 1000), -34.90 + (mapX / 1000), addressLabel);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(5, prev + 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1, prev - 1));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - dragStart.x);
    const dy = Math.abs(e.clientY - dragStart.y);
    if (dx > 5 || dy > 5) {
      setIsDragging(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col rounded-2xl border border-rose-100 shadow-sm" id="map-container-wrapper">
      {/* Search Header Action Panel */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap gap-2 pointer-events-auto" id="map-controls-panel">
        <div className="flex bg-white/95 backdrop-blur shadow-md rounded-full px-3 py-1.5 items-center gap-1.5 text-xs text-slate-700 font-medium">
          <Navigation className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span className="truncate max-w-[170px]" title="Endereço simulado">
            {userMapCoords.y < 35 ? 'Santo Amaro' : userMapCoords.y > 70 ? 'Boa Viagem' : userMapCoords.x < 40 ? 'Afogados' : 'Imbiribeira, PE-090'}
          </span>
        </div>

        {/* Filters Toggle */}
        <div className="flex bg-white/95 backdrop-blur shadow-md rounded-full p-1 gap-1 ml-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${filterType === 'all' ? 'bg-rose-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Tudo
          </button>
          <button
            onClick={() => setFilterType('safe')}
            className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${filterType === 'safe' ? 'bg-emerald-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Bases
          </button>
          <button
            onClick={() => setFilterType('risk')}
            className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${filterType === 'risk' ? 'bg-amber-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Zonas
          </button>
        </div>
      </div>

      {/* Floating emergency patrol status indicator */}
      {isEmergencyAlertActive && (
        <div className="absolute top-14 left-3 right-3 z-10 bg-rose-600 border border-rose-500 text-white rounded-lg p-2.5 shadow-lg flex items-center gap-2.5 animate-bounce">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs uppercase tracking-wide">ALERTA DISPARADO</p>
            <p className="text-[10px] opacity-90 truncate">{etaText}</p>
          </div>
          <Shield className="w-5 h-5 text-rose-100 animate-spin" />
        </div>
      )}

      {/* Interactive Map Canvas using SVG */}
      <div 
        className="w-full flex-1 touch-none relative" 
        style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          onClick={handleMapClick}
          style={{
            transform: `scale(${zoomScale})`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: `${mapCenter.x}% ${mapCenter.y}%`
          }}
        >
          {/* DEFINITIONS FOR STYLING AND DECORATION */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" strokeWidth="0.15" />
            </pattern>
            {/* Risk Zone Red Heat Gradient */}
            <radialGradient id="riskGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            {/* Safe zone green gradient */}
            <radialGradient id="safeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width="100" height="100" fill="#F8FAFC" />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* WATER BODIES SIMULATION: Rio Capibaribe & Rio Beberibe & Ocean */}
          {/* Capibaribe river curves */}
          <path
            d="M -10 42 Q 15 38 35 45 T 70 55 T 110 52"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* River branch */}
          <path
            d="M 35 45 Q 40 65 52 82 T 65 110"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* LANDMARK MARGIN LABELS (SIMULATED OSM LABELS) */}
          <text x="3" y="10" className="fill-slate-300 font-mono" fontSize="2">ZONA NORTE</text>
          <text x="75" y="94" className="fill-slate-300 font-mono" fontSize="2">AV. BOA VIAGEM</text>
          <text x="12" y="58" className="fill-slate-300 font-mono" fontSize="2">AFOGADOS</text>
          <text x="45" y="65" className="fill-slate-400 font-sans font-semibold" fontSize="1.8">PE-090</text>
          <text x="48" y="22" className="fill-slate-300 font-mono" fontSize="2">SANTO AMARO</text>

          {/* STREET GRID SIMULATION (Lines representing real streets) */}
          {/* PE-090 Primary Road */}
          <path
            d="M -10 56 L 110 56"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Av. Agamenon Magalhaes */}
          <path
            d="M 58 -10 L 58 110"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          {/* Radial Streets */}
          <line x1="10" y1="10" x2="90" y2="90" stroke="#F1F5F9" strokeWidth="0.4" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#F1F5F9" strokeWidth="0.4" />
          <path d="M 22 20 Q 35 30 45 15" fill="none" stroke="#E2E8F0" strokeWidth="0.4" />
          <path d="M 68 80 Q 75 62 92 70" fill="none" stroke="#E2E8F0" strokeWidth="0.4" />

          {/* 1. HEAT RISK ZONES (RF04) */}
          {showRiskZones && filterType !== 'safe' && riskZones.map(zone => (
            <g key={zone.id}>
              {/* Pulsating danger radius */}
              <circle
                cx={zone.lng}
                cy={zone.lat}
                r={zone.radius * (isEmergencyAlertActive ? 1.2 : 1)}
                fill="url(#riskGrad)"
                className={isEmergencyAlertActive ? 'animate-ping' : ''}
                style={{ transformOrigin: `${zone.lng}px ${zone.lat}px`, transition: 'all 0.5s' }}
              />
              <circle
                cx={zone.lng}
                cy={zone.lat}
                r={1.2}
                fill="#EF4444"
              />
              {zoomLevel >= 3 && (
                <text
                  x={zone.lng}
                  y={zone.lat - 3}
                  fontSize="1.6"
                  className="fill-rose-700 font-semibold text-center"
                  textAnchor="middle"
                >
                  ⚠ {zone.status}
                </text>
              )}
            </g>
          ))}

          {/* 2. REGISTRADAS OCCURRENCES INDIVIDUALS (RF07) - ONLY if matching filters */}
          {filterType !== 'safe' && occurrences.map(occ => (
            <g key={occ.id} className="cursor-help">
              <circle
                cx={occ.longitude}
                cy={occ.latitude}
                r="2.5"
                fill={occ.status === 'Pendente' ? '#F59E0B' : occ.status === 'Resolvida' ? '#10B981' : '#EF4444'}
                fillOpacity="0.2"
              />
              <circle
                cx={occ.longitude}
                cy={occ.latitude}
                r="0.8"
                fill={occ.status === 'Pendente' ? '#D97706' : occ.status === 'Resolvida' ? '#059669' : '#DC2626'}
              />
              {zoomLevel >= 3 && (
                <text
                  x={occ.longitude}
                  y={occ.latitude + 2.4}
                  fontSize="1.2"
                  className="fill-slate-600 font-medium"
                  textAnchor="middle"
                >
                  {occ.sector} ({occ.severity === 'Alta' ? 'Crítico' : 'Alerta'})
                </text>
              )}
            </g>
          ))}

          {/* 3. SAFETY STATION PLACES (RF10/RF11/Support) */}
          {filterType !== 'risk' && supportStations.map(station => (
            <g key={station.id}>
              {/* Radiating safety wave */}
              <circle
                cx={station.x}
                cy={station.y}
                r="6"
                fill="url(#safeGrad)"
              />
              <circle
                cx={station.x}
                cy={station.y}
                r="1"
                fill="#059669"
              />
              <polygon
                points={`${station.x},${station.y - 1.8} ${station.x + 1.2},${station.y + 0.8} ${station.x - 1.2},${station.y + 0.8}`}
                fill="#10B981"
              />
              {zoomLevel >= 3 && (
                <text
                  x={station.x}
                  y={station.y - 2.2}
                  fontSize="1.4"
                  className="fill-emerald-800 font-bold"
                  textAnchor="middle"
                >
                  🛡 {station.name.substring(0, 20)}...
                </text>
              )}
            </g>
          ))}

          {/* 4. EMERGENCY PATROL CAR SIMULATION IN ACTION */}
          {patrolActive && (
            <g>
              {/* Ring wave from patrol */}
              <circle
                cx={patrolPosition.x}
                cy={patrolPosition.y}
                r="4.5"
                className="animate-ping fill-blue-500/20"
                style={{ transformOrigin: `${patrolPosition.x}px ${patrolPosition.y}px` }}
              />
              {/* Outer icon indicator representation */}
              <rect
                x={patrolPosition.x - 2}
                y={patrolPosition.y - 1.5}
                width="4"
                height="3"
                rx="1"
                fill="#3B82F6"
              />
              {/* Blue/Red flashing top bar bar */}
              <rect x={patrolPosition.x - 1.2} y={patrolPosition.y - 2} width="1.2" height="0.6" fill="#EF4444" />
              <rect x={patrolPosition.x} y={patrolPosition.y - 2} width="1.2" height="0.6" fill="#3B82F6" />
              
              <text
                x={patrolPosition.x}
                y={patrolPosition.y - 3}
                fontSize="1.3"
                className="fill-blue-600 font-black animate-bounce"
                textAnchor="middle"
              >
                🚓 PATRULHA
              </text>
            </g>
          )}

          {/* 5. PRIMARY ACTIVE USER LOCATION PIN (RF03) */}
          <g>
            {/* Core Pulse circle when Emergency Button is activated (Red) vs regular protective green waves */}
            <circle
              cx={userMapCoords.x}
              cy={userMapCoords.y}
              r={isEmergencyAlertActive ? 12 : 5}
              fill={isEmergencyAlertActive ? '#E11D48' : '#EC4899'}
              fillOpacity={isEmergencyAlertActive ? 0.35 : 0.15}
              className={isEmergencyAlertActive ? 'animate-pulse' : ''}
              style={{ transformOrigin: `${userMapCoords.x}px ${userMapCoords.y}px`, transition: 'all 0.3s' }}
            />
            {isEmergencyAlertActive && (
              <circle
                cx={userMapCoords.x}
                cy={userMapCoords.y}
                r="24"
                fill="none"
                stroke="#E11D48"
                strokeWidth="0.5"
                className="animate-ping"
                style={{ transformOrigin: `${userMapCoords.x}px ${userMapCoords.y}px` }}
              />
            )}

            {/* Droppable Pin icon representing User position */}
            <g transform={`translate(${userMapCoords.x - 2}, ${userMapCoords.y - 4}) scale(0.12)`}>
              <path
                d="M15 0C6.71 0 0 6.71 0 15c0 10.5 15 25 15 25s15-14.5 15-25c0-8.29-6.71-15-15-15zm0 21c-3.13 0-5.73-2.6-5.73-5.73C9.27 12.14 11.87 10 15 10c3.13 0 5.73 2.14 5.73 5.27C20.73 18.4 18.13 21 15 21z"
                fill={isEmergencyAlertActive ? '#BE123C' : '#1D4ED8'}
              />
            </g>

            {/* Shield tag overlay of Protection label */}
            <rect
              x={userMapCoords.x - 9}
              y={userMapCoords.y - 7.5}
              width="18"
              height="3.2"
              rx="0.8"
              fill={isEmergencyAlertActive ? '#991B1B' : '#047857'}
            />
            <text
              x={userMapCoords.x}
              y={userMapCoords.y - 5.2}
              fontSize="1.6"
              className="fill-white font-extrabold"
              textAnchor="middle"
              style={{ letterSpacing: '0.05em' }}
            >
              {isEmergencyAlertActive ? 'EM EMERGÊNCIA' : 'VOCÊ ESTÁ SEGURA'}
            </text>
          </g>
        </svg>

        {/* Zoom Action HUD controllers */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10 pointer-events-auto" id="zoomer-hud">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white/95 backdrop-blur hover:bg-slate-100 text-slate-700 font-bold rounded-lg shadow-md border border-slate-200 flex items-center justify-center transition-all text-lg active:scale-95"
            title="Aproximar mapa"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white/95 backdrop-blur hover:bg-slate-100 text-slate-700 font-bold rounded-lg shadow-md border border-slate-200 flex items-center justify-center transition-all text-lg active:scale-95"
            title="Afastar mapa"
          >
            -
          </button>
        </div>

        {/* Simulated map watermarks exactly like user screenshot */}
        <div className="absolute bottom-1 left-2 z-10 text-[9px] text-slate-400 bg-white/60 px-1 rounded select-none pointer-events-none flex items-center gap-1">
          <span className="font-semibold text-blue-600">🗺 Leaflet</span> | © OpenStreetMap contributors
        </div>
      </div>

      {/* Manual Coordinates Override Tooltip at bottom to explain simulator behavior */}
      <div className="bg-rose-50 border-t border-rose-100 p-2.5 text-center text-[10px] text-slate-600 font-medium leading-normal flex items-center justify-center gap-2">
        <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
        <span>
          Clique no mapa para testar a proteção em qualquer setor. O botão vermelho do centro ativa o alarme de segurança.
        </span>
      </div>
    </div>
  );
}
