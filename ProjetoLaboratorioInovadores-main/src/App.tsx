/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Users, CheckCircle, LayoutGrid, User, Shield, Radio, BellRing, PhoneCall } from 'lucide-react';
import { UserRole, UserProfile, EmergencyContact, Occurrence, Aggressor, SecurityEventLog, RiskZone } from './types';
import { INITIAL_USER, INITIAL_CONTACTS, INITIAL_OCCURRENCES, INITIAL_AGGRESSORS, INITIAL_LOGS, RISK_ZONES } from './mockData';

// Component imports
import MapComponent from './components/MapComponent';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import ContactsTab from './components/ContactsTab';
import CheckinTab from './components/CheckinTab';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import EmergencyAlertOverlay from './components/EmergencyAlertOverlay';

export default function App() {
  // Navigation Screens & Tabs States
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'home' | 'contacts' | 'checkin' | 'dashboard' | 'profile'>('home');

  // Core Persistent State
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(INITIAL_OCCURRENCES);
  const [aggressors, setAggressors] = useState<Aggressor[]>(INITIAL_AGGRESSORS);
  const [systemLogs, setSystemLogs] = useState<SecurityEventLog[]>(INITIAL_LOGS);
  
  // Interactive Simulation variables
  const [currentLocationName, setCurrentLocationName] = useState<string>('PE-090, Imbiribeira - Recife');
  const [isEmergencyAlertActive, setIsEmergencyAlertActive] = useState<boolean>(false);
  const [isCheckinRouteActive, setIsCheckinRouteActive] = useState<boolean>(false);
  const [activeRouteDest, setActiveRouteDest] = useState<string>('');
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);
  
  // Realtime Notification Event alerts simulator
  const [incomingNotification, setIncomingNotification] = useState<{ id: string; title: string; text: string; urgent: boolean } | null>(null);

  // Initialize and load from LocalStorage if populated
  useEffect(() => {
    const savedUser = localStorage.getItem('safetyfem_user');
    const savedContacts = localStorage.getItem('safetyfem_contacts');
    const savedOccurrences = localStorage.getItem('safetyfem_occurrences');
    const savedAggressors = localStorage.getItem('safetyfem_aggressors');
    const savedLogs = localStorage.getItem('safetyfem_logs');

    if (savedUser) setUserProfile(JSON.parse(savedUser));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedOccurrences) setOccurrences(JSON.parse(savedOccurrences));
    if (savedAggressors) setAggressors(JSON.parse(savedAggressors));
    if (savedLogs) setSystemLogs(JSON.parse(savedLogs));
  }, []);

  // Sync back state helpers
  const appendLog = (action: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') => {
    const newLog: SecurityEventLog = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      action,
      userEmail: userProfile.email,
      severity
    };
    const updated = [newLog, ...systemLogs];
    setSystemLogs(updated);
    localStorage.setItem('safetyfem_logs', JSON.stringify(updated));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('safetyfem_user', JSON.stringify(profile));
    appendLog('Atualizou dados cadastrais de perfil');
  };

  const handleAddContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      id: Math.random().toString(),
      ...contact
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    localStorage.setItem('safetyfem_contacts', JSON.stringify(updated));
    appendLog(`Adicionou contato de emergência: ${contact.name}`);
  };

  const handleRemoveContact = (id: string) => {
    const target = contacts.find(c => c.id === id);
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem('safetyfem_contacts', JSON.stringify(updated));
    if (target) {
      appendLog(`Removeu contato de emergência: ${target.name}`, 'WARNING');
    }
  };

  const handleAddOccurrence = (occ: Omit<Occurrence, 'id' | 'date'>) => {
    const newOcc: Occurrence = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      ...occ
    };
    const updated = [newOcc, ...occurrences];
    setOccurrences(updated);
    localStorage.setItem('safetyfem_occurrences', JSON.stringify(updated));
    appendLog(`Registrou nova ocorrência policial no setor ${occ.sector}`, 'WARNING');
  };

  const handleAddAggressor = (aggr: Omit<Aggressor, 'id'>) => {
    const newAggr: Aggressor = {
      id: Math.random().toString(),
      ...aggr
    };
    const updated = [newAggr, ...aggressors];
    setAggressors(updated);
    localStorage.setItem('safetyfem_aggressors', JSON.stringify(updated));
    appendLog(`Expediu cadastro de agressor institucional: ${aggr.name}`, 'WARNING');
  };

  // Login handler
  const handleLoginSuccess = (email: string, role: UserRole) => {
    const updatedUser = {
      ...userProfile,
      email,
      role,
      name: role === UserRole.ADMIN_OPERADOR ? 'Plantonista Oficial DEAM' : 'Usuária de Demonstrativa'
    };
    setUserProfile(updatedUser);
    localStorage.setItem('safetyfem_user', JSON.stringify(updatedUser));
    setCurrentScreen('app');
    appendLog(`Sessão autenticada via credencial de nível ${role}`);
  };

  // Toggle Emergency Panic Button (RF01)
  const triggerEmergencyPanic = () => {
    setIsEmergencyAlertActive(true);
    appendLog('BOTÃO DE EMERGÊNCIA DISPARADO IMEDIATAMENTE!', 'CRITICAL');
  };

  const cancelEmergencyPanic = () => {
    setIsEmergencyAlertActive(false);
    appendLog('Botão de pânico desativado pelo PIN de segurança', 'INFO');
  };

  const handleCheckinStarted = (dest: string, eta: string) => {
    setIsCheckinRouteActive(true);
    setActiveRouteDest(dest);
    appendLog(`Iniciou rota de check-in integrado. Destino: ${dest}, Chegada: ${eta}`);
  };

  const handleCheckinEnded = (wasSuccessful: boolean) => {
    setIsCheckinRouteActive(false);
    if (wasSuccessful) {
      appendLog(`Concluiu trajeto até ${activeRouteDest} com segurança.`);
    } else {
      appendLog(`Falha de check-in: tempo de tolerância exaurido rumo a ${activeRouteDest}!`, 'CRITICAL');
    }
  };

  // Simulator Events
  const triggerSimulatedAgressorProximity = () => {
    setIncomingNotification({
      id: Math.random().toString(),
      title: '⚠ PERIGO METROPOLITANO DETECTADO',
      text: 'Agressor cadastrado (Carlos Roberto) com ordem de restrição foi detectado em sua proximidade imediata (rastro <250m na PE-090). Busque uma Base de Apoio!',
      urgent: true
    });
    appendLog('ALERTA SEGURO: Agressor em zona de restrição!', 'CRITICAL');
  };

  const triggerSimulatedPoliceAlert = () => {
    setIncomingNotification({
      id: Math.random().toString(),
      title: '🚨 Ronda Preventiva Integrada',
      text: 'Uma viatura civil da Patrulha Maria da Penha está circulando em seu quadrante atual de Imbiribeira. Fique tranquila.',
      urgent: false
    });
    appendLog('Sinal de proximidade de ronda policial despachado', 'INFO');
  };

  const handleSimulateDirectPhoneCall = (contact: EmergencyContact) => {
    alert(`Ligando de emergência para ${contact.name} (${contact.phone}). Sinalizando coordenadas em tempo real...`);
  };

  // Render sub-views depending on active navigation tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden" id="home-tab-scroller">
            
            {/* Protective Active top summary status bar */}
            <div className="bg-white/95 border-b border-rose-50 p-2 text-center text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1.5 shadow-sm shrink-0" id="visual-protection-banner">
              <span className={`h-2 w-2 rounded-full inline-block shrink-0 ${isEmergencyAlertActive ? 'bg-red-600 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              {isEmergencyAlertActive ? (
                <span className="text-red-600 uppercase tracking-widest font-black">Transmissão de socorro ativa</span>
              ) : (
                <span className="text-emerald-700 tracking-wide font-bold">MONITORAMENTO CIVIL CONECTADO (LGPD OK)</span>
              )}
            </div>

            {/* Map Element occupying full canvas */}
            <div className="flex-1 w-full relative" id="integrated-map-canvas-container">
              <MapComponent
                currentLat={-8.12}
                currentLng={-34.908}
                onLocationChange={(lat, lng, address) => {
                  setCurrentLocationName(address);
                }}
                isEmergencyAlertActive={isEmergencyAlertActive}
                occurrences={occurrences}
                riskZones={RISK_ZONES}
                showRiskZones={showRiskZones}
              />

              {/* FLOATING PRIMARY PANIC BUTTON: Gigantic red pulsing buzzer (RF01) */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 pointer-events-auto shrink-0" 
                id="floating-panic-buzzer-outer"
              >
                <button
                  onClick={triggerEmergencyPanic}
                  className="relative w-28 h-28 bg-[#C2113D] hover:bg-[#A10D31] text-white rounded-full flex flex-col items-center justify-center border-4 border-white shadow-2xl active:scale-95 transition-transform duration-200 cursor-pointer"
                  id="btn-emergency-panic-trigger"
                  title="Pressione para disparar chamada de emergência das forças públicas"
                >
                  {/* Flashing rings backgrounds */}
                  <span className="absolute inset-0 bg-red-600/30 rounded-full animate-ping pointer-events-none" />
                  
                  {/* Siren SVG icon with elegant subtle animation */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-11 h-11 mb-0.5 animate-bounce"
                  >
                    <path d="M12 2a1 1 0 0 1 1 1v1.1a7.002 7.002 0 0 1 5.485 5.564L19.227 12H21a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1.773l.742-2.336A7.002 7.002 0 0 1 11 4.1V3a1 1 0 0 1 1-1zm0 14h-3.86a2.001 2.001 0 0 0 3.86 1.15A2 2 0 0 0 12 16z" />
                  </svg>
                  
                  <span className="text-[10px] font-black uppercase tracking-wider leading-tight">
                    EMERGÊNCIA
                  </span>
                </button>
              </div>

            </div>

          </div>
        );
      case 'contacts':
        return <ContactsTab contacts={contacts} onAddContact={handleAddContact} onRemoveContact={handleRemoveContact} />;
      case 'checkin':
        return (
          <CheckinTab
            onCheckinStarted={handleCheckinStarted}
            onCheckinEnded={handleCheckinEnded}
            onAutoTriggerEmergency={triggerEmergencyPanic}
          />
        );
      case 'dashboard':
        return (
          <DashboardTab
            occurrences={occurrences}
            onAddOccurrence={handleAddOccurrence}
            aggressors={aggressors}
            onAddAggressor={handleAddAggressor}
            isEmergencyAlertActive={isEmergencyAlertActive}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onLogout={() => {
              setCurrentScreen('landing');
              setActiveTab('home');
            }}
            systemLogs={systemLogs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 lg:p-6 text-slate-100 font-sans selection:bg-rose-500 select-none overflow-x-hidden relative" id="mainframe-container">
      
      {/* Decorative full body cosmic dark slate wallpaper style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,17,61,0.08)_0%,rgba(15,17,26,1)_80%)] pointer-events-none" />

      {/* Renders LandingPage overlay */}
      {currentScreen === 'landing' && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <LandingPage onStart={() => setCurrentScreen('login')} />
        </div>
      )}

      {/* Renders LoginScreen overlay */}
      {currentScreen === 'login' && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onBypass={() => {
              setCurrentScreen('app');
              appendLog('Solução acessada via bypass de Teste Rápido');
            }}
          />
        </div>
      )}

      {/* Active emergency overlay showing blinking siren timeline logs */}
      {isEmergencyAlertActive && (
        <EmergencyAlertOverlay
          onCancel={cancelEmergencyPanic}
          userAddress={currentLocationName}
        />
      )}

      {/* Centered Mobile App Screen */}
      <div 
        className="relative z-10 w-full max-w-[410px] h-screen sm:h-[844px] bg-[#FFF8FA] sm:rounded-[48px] sm:border-[10px] border-slate-950 sm:shadow-2xl overflow-hidden flex flex-col justify-between"
        id="smartphone-chassis-frame"
      >
        {/* 1. TOP STATUS BAR/NOTCH (Figma hardware detail) */}
        <div className="hidden sm:flex h-8 bg-slate-950 text-white w-full px-6 justify-between items-center text-[10px] select-none shrink-0 relative" id="notch-hardware-overlay">
          <span className="font-bold tracking-wide">11:20</span>
          {/* Central screen notch cutout */}
          <div className="w-24 h-4.5 bg-slate-950 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
          <div className="flex items-center gap-1.5 font-bold" id="notch-right-icons">
            <span>5G</span>
            <span>📶</span>
            <span>🔋 100%</span>
          </div>
        </div>


            {/* 2. IN-APP APP HEADER BAR (Top bar inside mock frame) */}
            <div className="bg-white border-b border-rose-50 p-4 shrink-0 shadow-sm" id="applet-top-header">
              <div className="flex items-center justify-between" id="header-brand-badges">
                
                {/* Brand title identical to landing mockup screen 3 */}
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-[#C2113D] text-white rounded-lg">
                    {/* SVG Shield with Heart inside */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                      <path d="M11.645 20.91l-.007-.003-.003-.001a15.54 15.54 0 01-6.733-6.233C3.39 12.16 3 9.947 3 7.72c0-2.613 2.112-4.72 4.708-4.72 1.487 0 2.822.684 3.702 1.751C12.29 3.684 13.625 3 15.112 3c2.596 0 4.708 2.107 4.708 4.72 0 2.227-.39 4.44-1.902 6.953a15.542 15.542 0 01-6.733 6.233l-.003.001-.007.003L12 21l-.355-.09z" />
                    </svg>
                  </span>
                  <h3 className="text-base font-extrabold tracking-widest text-[#9c0a2f] uppercase">
                    SAFETYFEM
                  </h3>
                </div>

                {/* Protective Active badge identical to page 3 green glowing pill */}
                <div className="px-2.5 py-0.5 bg-[#FFF1F3] border border-rose-100 rounded-full flex items-center gap-1 select-none">
                  <span className={`h-1.5 w-1.5 rounded-full inline-block ${isEmergencyAlertActive ? 'bg-red-500 animate-ping' : 'bg-[#C2113D] animate-pulse'}`} />
                  <span className="text-[8px] font-black uppercase text-[#C2113D]">PROTEÇÃO ATIVA</span>
                </div>
              </div>

              {/* Contacts Quick trigger shortcuts layout in header bar */}
              <div className="mt-3.5 flex items-center justify-between" id="contacts-quick-trigger-strip">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Contatos Rápidos
                </span>

                {/* Pink initial contacts bubble circles */}
                <div className="flex gap-1.5" id="header-contacts-bubbles-strip">
                  {contacts.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSimulateDirectPhoneCall(c)}
                      className="w-7 h-7 rounded-full bg-[#FFF1F3] border border-rose-100 text-[#C2113D] font-extrabold text-[10px] flex items-center justify-center cursor-pointer shadow-sm hover:bg-[#FFE2E6] active:scale-90"
                      title={`Discagem rápida para ${c.name}`}
                    >
                      {c.avatarInitial}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. CORE SELECTED VIEWPORT PANEL */}
            <div className="flex-1 w-full bg-white relative flex flex-col min-h-0" id="smartphone-core-viewport">
              {renderTabContent()}
            </div>

            {/* 4. APP SYSTEM BOTTOM TAB MENU (Page 3 layout) */}
            <div className="bg-white border-t border-rose-50 h-16 w-full flex items-center justify-around px-3 shrink-0 shadow-[0_-4px_12px_rgba(156,10,47,0.03)]" id="applet-bottom-tabs-panel">
              
              {/* HOME Tab btn */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${activeTab === 'home' ? 'text-[#C2113D] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                id="btn-tab-home"
              >
                <Home className="w-5.5 h-5.5" strokeWidth={activeTab === 'home' ? 2.8 : 2} />
                <span className={`text-[8px] mt-1 font-bold tracking-wide uppercase ${activeTab === 'home' ? 'font-black' : ''}`}>
                  HOME
                </span>
              </button>

              {/* CONTATOS Tab btn */}
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${activeTab === 'contacts' ? 'text-[#C2113D] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                id="btn-tab-contacts"
              >
                <Users className="w-5.5 h-5.5" strokeWidth={activeTab === 'contacts' ? 2.8 : 2} />
                <span className={`text-[8px] mt-1 font-bold tracking-wide uppercase ${activeTab === 'contacts' ? 'font-black' : ''}`}>
                  CONTATOS
                </span>
              </button>

              {/* CHECK-IN Tab btn */}
              <button
                onClick={() => setActiveTab('checkin')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${activeTab === 'checkin' ? 'text-[#C2113D] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                id="btn-tab-checkin"
              >
                <CheckCircle className="w-5.5 h-5.5" strokeWidth={activeTab === 'checkin' ? 2.8 : 2} />
                <span className={`text-[8px] mt-1 font-bold tracking-wide uppercase ${activeTab === 'checkin' ? 'font-black' : ''}`}>
                  CHECK-IN
                </span>
              </button>

              {/* PAINEL Tab btn */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-[#C2113D] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                id="btn-tab-painel"
              >
                <LayoutGrid className="w-5.5 h-5.5" strokeWidth={activeTab === 'dashboard' ? 2.8 : 2} />
                <span className={`text-[8px] mt-1 font-bold tracking-wide uppercase ${activeTab === 'dashboard' ? 'font-black' : ''}`}>
                  PAINEL
                </span>
              </button>

              {/* PERFIL Tab btn */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${activeTab === 'profile' ? 'text-[#C2113D] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                id="btn-tab-perfil"
              >
                <User className="w-5.5 h-5.5" strokeWidth={activeTab === 'profile' ? 2.8 : 2} />
                <span className={`text-[8px] mt-1 font-bold tracking-wide uppercase ${activeTab === 'profile' ? 'font-black' : ''}`}>
                  PERFIL
                </span>
              </button>

            </div>

            {/* 5. PHYSICAL HOME INDICATOR BAR (Figma iOS detail) */}
            <div className="hidden sm:flex h-5 bg-white w-full justify-center items-center shrink-0 border-t border-slate-50 select-none pb-1.5" id="home-indicator-overlay">
              <div className="w-32 h-1 bg-slate-900 rounded-full" />
            </div>

          </div>

      {/* Floating alert notification modal for direct test response of mobile users */}
      {incomingNotification && (
        <div className="fixed bottom-24 left-3 right-3 max-w-sm mx-auto z-40 bg-rose-950/95 border border-rose-800 text-white p-4 rounded-2xl shadow-xl flex flex-col gap-2.5 animate-bounce">
          <div className="flex items-center gap-2 font-bold">
            <BellRing className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs uppercase tracking-wide">{incomingNotification.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-200">{incomingNotification.text}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setIncomingNotification(null)}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[9px] font-bold uppercase tracking-wider rounded-lg text-center"
            >
              Confirmar Recebido
            </button>
            <button
              onClick={() => {
                setIncomingNotification(null);
                triggerEmergencyPanic();
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-[9px] font-black uppercase tracking-wider rounded-lg text-center text-white"
            >
              🚨 Chamar Defesa
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
