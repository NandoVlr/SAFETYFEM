/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Settings, Bell, Shield, LogOut, Save, Plus, MapPin, Trash2, Lock, ListTodo } from 'lucide-react';
import { UserProfile, SecurityEventLog, UserRole } from '../types';

interface ProfileTabProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  systemLogs: SecurityEventLog[];
}

export default function ProfileTab({ userProfile, onUpdateProfile, onLogout, systemLogs }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [email, setEmail] = useState<string>(userProfile.email);
  const [phone, setPhone] = useState<string>(userProfile.phone);
  
  // Frequent addresses sub-editing
  const [addresses, setAddresses] = useState(userProfile.frequentAddresses);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newAddr, setNewAddr] = useState<string>('');

  // Active sub-tabs inside user settings profile
  const [subView, setSubView] = useState<'menu' | 'config' | 'notify' | 'audit'>('menu');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      email,
      phone,
      frequentAddresses: addresses
    });
    setIsEditing(false);
    setSubView('menu');
  };

  const handleAddAddress = () => {
    if (!newLabel || !newAddr) return;
    setAddresses(prev => [
      ...prev,
      { label: newLabel, address: newAddr, lat: -8.05, lng: -34.90 }
    ]);
    setNewLabel('');
    setNewAddr('');
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex-1 bg-white p-5 flex flex-col font-sans overflow-y-auto" id="profile-tab-root">
      
      {/* Title Subheading */}
      <div className="flex items-center gap-2 mb-6" id="profile-title-bar">
        {subView !== 'menu' && (
          <button onClick={() => setSubView('menu')} className="mr-1 text-slate-500 hover:text-slate-800 text-xs font-semibold">
            ← Voltar
          </button>
        )}
        <h2 className="text-2xl font-black text-[#0F172A]">
          {subView === 'menu' ? 'Perfil' : subView === 'config' ? 'Configurações' : subView === 'notify' ? 'Notificações' : 'Auditoria de Ações'}
        </h2>
      </div>

      {subView === 'menu' && (
        /* PRIMARY MENU LIST VIEW */
        <div className="space-y-6" id="profile-main-menu">
          {/* Avatar representation card similar to Figma screenshot */}
          <div className="flex flex-col items-center text-center py-4 border-b border-slate-100">
            {/* Pink bubble avatar with "U" */}
            <div className="w-24 h-24 rounded-full bg-[#FFF1F3] border border-rose-100 shadow-sm flex items-center justify-center text-[#C2113D] font-black text-3xl mb-3">
              {userProfile.name.trim().charAt(0).toUpperCase() || 'U'}
            </div>
            
            <h3 className="text-xl font-extrabold text-[#0f172a] leading-tight">
              {userProfile.name}
            </h3>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              {userProfile.email}
            </p>
            
            <div className="mt-2.5 px-3 py-1 bg-[#FFF1F3] text-[#C2113D] text-[10px] font-bold rounded-full uppercase tracking-widest border border-rose-100">
              {userProfile.role === UserRole.ADMIN_OPERADOR ? 'POLICIAL / GESTOR PÚBLICO' : 'USUÁRIA SEGURADA'}
            </div>
          </div>

          {/* Navigational rows mirroring mock screenshot */}
          <div className="space-y-2.5" id="profile-navigation-rows">
            <button
              onClick={() => {
                setSubView('config');
                setIsEditing(true);
              }}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50/50 rounded-2xl transition-all cursor-pointer border border-slate-100 group"
              id="row-configuacoes"
            >
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-white text-[#C2113D]">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-bold text-slate-800">Definições da Conta & Locais</span>
              </div>
              <span className="text-slate-400 text-base font-bold">›</span>
            </button>

            <button
              onClick={() => setSubView('notify')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50/50 rounded-2xl transition-all cursor-pointer border border-slate-100 group"
              id="row-notificacoes"
            >
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-white text-rose-500">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-bold text-slate-800">Alertas de Segurança Recebidos</span>
              </div>
              <span className="text-slate-400 text-base font-bold">›</span>
            </button>

            <button
              onClick={() => setSubView('audit')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50/50 rounded-2xl transition-all cursor-pointer border border-slate-100 group"
              id="row-auditoria"
            >
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-white text-blue-500">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-bold text-slate-800">Registros de Auditoria (RNF10)</span>
              </div>
              <span className="text-slate-400 text-base font-bold">›</span>
            </button>
          </div>

          {/* Privacy statement notice box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-normal">
              <span className="font-bold text-slate-700 block mb-0.5">Sua privacidade protegida</span>
              Seus dados pessoais, contatos de anjos protetores e rotas diárias de check-in são criptografados localmente. Nenhuma autoridade pública tem acesso às suas localizações passadas, apenas à sua localização em tempo real quando o botão de pânico é explicitamente ativado por você.
            </div>
          </div>

          {/* LogOut triggers reset state to login screen */}
          <button
            onClick={onLogout}
            className="w-full py-3.5 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-8"
            id="btn-logout"
          >
            <LogOut className="w-4 h-4" />
            Sair do Dispositivo
          </button>
        </div>
      )}

      {subView === 'config' && (
        /* ACCOUNT EDITING FORM (RF02 - Cadastro de usuária & Endereços) */
        <form onSubmit={handleSaveProfile} className="space-y-5" id="profile-edit-form">
          <div className="space-y-3">
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase mb-1">E-mail Protegido</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Telefone Principal</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Frequent addresses sub-menu block (RF02) */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Endereços Frequentes (RF02)</h4>
            
            {/* List addresses with trash indicator */}
            <div className="space-y-2 mb-4">
              {addresses.map((addr, i) => (
                <div key={i} className="flex items-start justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-[#C2113D] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {addr.label}
                    </p>
                    <p className="text-slate-500 truncate mt-0.5">{addr.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(i)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remover endereço frequente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick addition parameters */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-700 block uppercase">Cadastrar Novo Local Frequente</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Etiqueta (ex: Academia)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <input
                  type="text"
                  placeholder="Endereço Completo"
                  value={newAddr}
                  onChange={(e) => setNewAddr(e.target.value)}
                  className="bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Incluir Endereço
              </button>
            </div>
          </div>

          {/* Action buttons save / cancel */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#C2113D] hover:bg-[#A10D31] text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => setSubView('menu')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {subView === 'notify' && (
        /* SIMULATED NOTIFICATION SYSTEM ALERTS ROW (RF09) */
        <div className="space-y-4" id="profile-notifications-panel">
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-[10px] text-rose-800 leading-normal mb-2">
            Mensagens e circulares emitidas pelas Forças Integradas de Segurança de Recife em tempo real para o seu quadrante de localização.
          </div>

          <div className="space-y-3">
            {[
              { id: 1, title: 'Alerta de Proximidade Espacial', desc: 'Sua proximidade à Estação Tancredo Neves foi correlacionada com uma zona de alta ocorrência de furtos noturnos. Tenha atenção redobrada.', time: 'Hoje, 10:42', urgent: true },
              { id: 2, title: 'Monitoramento Preventivo em Ação', desc: 'Seu trajeto "Casa" foi iniciado às 18:30. Nossos servidores mantêm o cronômetro ativo por 15 minutos adicionais.', time: 'Hoje, 18:30', urgent: false },
              { id: 3, title: 'Circular Pública de Defesa Social', desc: 'Reforço de contingente público na região de Recife Antigo agendado para o final de semana. Bases de apoio operacionais 24h disponíveis.', time: 'Ontem, 20:15', urgent: false }
            ].map(item => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border ${item.urgent ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-800'} text-xs`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold block text-[#0f172a]">{item.title}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{item.time}</span>
                </div>
                <p className="text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subView === 'audit' && (
        /* AUDITABILITY SYSTEM LOGS VIEW (RNF10 - Auditabilidade) */
        <div className="space-y-4" id="profile-audit-panel">
          <p className="text-[10px] text-slate-500 leading-normal bg-slate-50 p-3 border border-slate-100 rounded-xl">
            Para garantir transparência, legitimidade jurídica de provas e em total conformidade com a LGPD, todos os acionamentos de alarme, modificações de dados e requisições de apoio administrativo nesta credencial são auditados em cartórios policiais de forma imutável (logs de segurança).
          </p>

          <div className="bg-slate-950 font-mono text-[10px] text-emerald-400 p-4 rounded-xl shadow-inner border border-slate-800 space-y-2 h-72 overflow-y-auto" id="terminal-logs-screen">
            <span className="text-slate-400 text-[8px] block mb-2">// TERMINAL DE AUDITORIA ATIVO • REGISTROS INVIOLÁVEIS</span>
            {systemLogs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                <span className="text-slate-500 font-bold">[{log.timestamp.substring(11, 19)}]</span>{' '}
                <span className={log.severity === 'CRITICAL' ? 'text-red-500 font-extrabold' : log.severity === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}>
                  [{log.severity}]
                </span>{' '}
                <span className="text-slate-300">{log.action}</span>
                <span className="text-slate-600 block pl-3">Responsável: {log.userEmail}</span>
              </div>
            ))}
            <div className="text-[8px] text-slate-500 animate-pulse pt-2">// Próximo log aguardando requisições...</div>
          </div>
        </div>
      )}

    </div>
  );
}
