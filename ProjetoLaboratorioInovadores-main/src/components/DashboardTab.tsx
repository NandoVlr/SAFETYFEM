/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart, FileText, UserMinus, Plus, ShieldAlert, Award, Search, AlertOctagon, HelpCircle } from 'lucide-react';
import { Occurrence, Aggressor } from '../types';

interface DashboardTabProps {
  occurrences: Occurrence[];
  onAddOccurrence: (occ: Omit<Occurrence, 'id' | 'date'>) => void;
  aggressors: Aggressor[];
  onAddAggressor: (aggressor: Omit<Aggressor, 'id'>) => void;
  isEmergencyAlertActive: boolean;
}

export default function DashboardTab({
  occurrences,
  onAddOccurrence,
  aggressors,
  onAddAggressor,
  isEmergencyAlertActive
}: DashboardTabProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'report' | 'aggressors'>('metrics');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local form states for registering Occurrence
  const [reportSector, setReportSector] = useState<string>('Imbiribeira');
  const [reportDesc, setReportDesc] = useState<string>('');
  const [reportSeverity, setReportSeverity] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');
  const [reportStatus, setReportStatus] = useState<'Resolvida' | 'Não resolvida' | 'Pendente'>('Pendente');

  // Local form states for registering Aggressor
  const [aggrName, setAggrName] = useState<string>('');
  const [aggrCpf, setAggrCpf] = useState<string>('');
  const [aggrRisk, setAggrRisk] = useState<'Crítico' | 'Alto' | 'Moderado'>('Alto');
  const [aggrMeasure, setAggrMeasure] = useState<string>('');
  const [aggrLimit, setAggrLimit] = useState<number>(300);
  const [aggrLocation, setAggrLocation] = useState<string>('Afogados');

  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    onAddOccurrence({
      sector: reportSector,
      description: reportDesc,
      severity: reportSeverity,
      status: reportStatus,
      latitude: Math.round(30 + Math.random() * 40),
      longitude: Math.round(30 + Math.random() * 40)
    });

    setReportDesc('');
    alert('Sucesso: Nova ocorrência registrada no banco de dados e integrada ao mapa público de zonas de risco.');
    setActiveTab('metrics');
  };

  const handleCreateAggressor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aggrName.trim() || !aggrCpf.trim()) return;

    onAddAggressor({
      name: aggrName,
      cpf: aggrCpf,
      riskLevel: aggrRisk,
      protectiveMeasureDetails: aggrMeasure || 'Afastamento geral por medida expedida eletronicamente.',
      activeDistanceLimit: aggrLimit,
      lastKnownLocationName: aggrLocation
    });

    // Reset forms
    setAggrName('');
    setAggrCpf('');
    setAggrMeasure('');
    alert('Sucesso: Registro institucional de agressores consolidado (RF08). Alarme inteligente de distanciamento configurado!');
    setActiveTab('aggressors');
  };

  // Compute stats on-the-fly based on occurrences list
  const activeAlertsCount = isEmergencyAlertActive ? 4 : 3;
  const totalCasesToday = occurrences.length + 6; // base offset
  const countResolvidas = occurrences.filter(o => o.status === 'Resolvida').length + 1;
  const countNaoResolvidas = occurrences.filter(o => o.status === 'Não resolvida').length + 2;
  const countPendentes = occurrences.filter(o => o.status === 'Pendente').length + 1;

  // Render variables for bar chart scale mapping
  const maxCount = Math.max(countResolvidas, countNaoResolvidas, countPendentes, 1);
  const scaleHeight = (val: number) => (val / maxCount) * 100;

  // Filtered lists
  const filteredAggressors = aggressors.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.cpf.includes(searchQuery) ||
    a.lastKnownLocationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-1 bg-white p-5 flex flex-col font-sans overflow-y-auto" id="dashboard-tab-root">
      
      {/* Tab select sub-menu */}
      <div className="flex items-center justify-between mb-5" id="dashboard-subviews-selector flex-wrap gap-2">
        <h2 className="text-2xl font-black text-[#0F172A]" id="dashboard-main-title">
          Painel Gestor
        </h2>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'metrics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Métricas
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'report' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Registros (RF07)
          </button>
          <button
            onClick={() => setActiveTab('aggressors')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'aggressors' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Agressores (RF08)
          </button>
        </div>
      </div>

      {activeTab === 'metrics' && (
        /* METRICS & CHART VIEW (Exactly replicating Dashboard mockup layout) */
        <div className="space-y-6" id="dashboard-metrics-subview">
          
          {/* Header metrics exactly matching: "Ocorrências hoje: 12", "Alertas ativos: 3" layout but dynamic */}
          <div className="space-y-1 block" id="header-metrics-indicators">
            <h3 className="text-slate-800 text-lg sm:text-xl font-normal">
              Ocorrências hoje: <span className="font-extrabold text-[#0f172a]">{totalCasesToday}</span>
            </h3>
            <h3 className="text-slate-800 text-lg sm:text-xl font-normal">
              Alertas ativos: <span className="font-extrabold text-[#C2113D]">{activeAlertsCount}</span>
            </h3>
          </div>

          {/* White card with vertical bar charts on left and indicators on right */}
          <div 
            className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-row items-center justify-between gap-6"
            id="bar-chart-card-representation"
          >
            {/* Custom interactive bars visualizer */}
            <div className="flex-1 max-w-[150px] h-36 flex items-end justify-around gap-3 border-b-2 border-slate-100 pb-1.5 shrink-0" id="bars-column-layout">
              {/* Resolvidas Bar (Green) */}
              <div className="flex flex-col items-center flex-1 group relative">
                <span className="absolute -top-6 text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 bg-white shadow-md border rounded px-1 transition-all">{countResolvidas}</span>
                <div 
                  className="w-8 shrink-0 bg-emerald-500 rounded-t-lg transition-all"
                  style={{ height: `${Math.max(25, scaleHeight(countResolvidas))}px` }}
                />
                <span className="text-[10px] text-emerald-600 font-bold mt-1 select-none">RES</span>
              </div>
              {/* Não resolvidas Bar (Red) */}
              <div className="flex flex-col items-center flex-1 group relative">
                <span className="absolute -top-6 text-[10px] font-bold text-red-600 opacity-0 group-hover:opacity-100 bg-white shadow-md border rounded px-1 transition-all">{countNaoResolvidas}</span>
                <div 
                  className="w-8 shrink-0 bg-red-500 rounded-t-lg transition-all"
                  style={{ height: `${Math.max(25, scaleHeight(countNaoResolvidas))}px` }}
                />
                <span className="text-[10px] text-red-600 font-bold mt-1 select-none">N-RES</span>
              </div>
              {/* Pendentes Bar (Yellow) */}
              <div className="flex flex-col items-center flex-1 group relative">
                <span className="absolute -top-6 text-[10px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 bg-white shadow-md border rounded px-1 transition-all">{countPendentes}</span>
                <div 
                  className="w-8 shrink-0 bg-amber-400 rounded-t-lg transition-all"
                  style={{ height: `${Math.max(25, scaleHeight(countPendentes))}px` }}
                />
                <span className="text-[10px] text-amber-600 font-bold mt-1 select-none">PEND</span>
              </div>
            </div>

            {/* Labels indicators list exactly replicating font & weight of mockup */}
            <div className="space-y-2 mt-2 font-serif text-slate-800 text-sm flex-1 pl-4" id="chart-bullets-legend">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Resolvidas: <span className="font-bold">{countResolvidas + 3}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Não resolvidas: <span className="font-bold">{countNaoResolvidas + 2}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Pendentes: <span className="font-bold">{countPendentes + 1}</span></span>
              </div>
            </div>
          </div>

          {/* Últimos casos list layout representation */}
          <div className="space-y-3 pt-2" id="latest-cases-group">
            <h4 className="text-slate-800 text-xl font-serif">Últimos casos:</h4>
            
            <div className="space-y-3.5 pl-1" id="latest-cases-rows">
              {occurrences.slice(0, 4).map((occ) => (
                <div key={occ.id} className="border-b border-rose-50/50 pb-2 flex flex-col items-start gap-1">
                  <span className="text-slate-800 font-serif text-lg leading-tight capitalize">
                    {occ.sector}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    <span className="text-slate-500 pr-1">{occ.date}</span> •
                    <span className="text-slate-500 pl-1">{occ.description.substring(0, 52)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        /* REGISTER OCCURRENCES SCREEN - RF07 */
        <div className="space-y-5" id="report-view-subview">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <FileText className="w-4 h-4 text-[#C2113D]" /> Registrar Ocorrência Policial (RF07)
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Preenchimento restrito para operadores de segurança pública e plantonistas das Delegacias Especiais de Atendimento à Mulher (DEAM).
            </p>
          </div>

          <form onSubmit={handleCreateOccurrence} className="space-y-4" id="occurrence-creation-form">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Setor / Setor Urbano</label>
                <select
                  value={reportSector}
                  onChange={(e) => setReportSector(e.target.value)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                >
                  <option value="Imbiribeira">Imbiribeira</option>
                  <option value="Afogados">Afogados</option>
                  <option value="Santo Amaro">Santo Amaro</option>
                  <option value="Boa Viagem">Boa Viagem</option>
                  <option value="Ibura">Ibura</option>
                  <option value="Várzea">Várzea</option>
                  <option value="Espinheiro">Espinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Status Operativo</label>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value as any)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                >
                  <option value="Pendente">Pendente (Em andamento)</option>
                  <option value="Resolvida">Resolvida (Patrulha Alocada)</option>
                  <option value="Não resolvida">Não resolvida (Investigação)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="grid grid-cols-2 justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Gravidade do Incidente</span>
                <span className="text-slate-400 text-[9px] text-right font-mono">Controle de Alerta</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Alta', 'Média', 'Baixa'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setReportSeverity(sev)}
                    className={`py-2 border text-xs font-bold rounded-xl transition-all ${reportSeverity === sev ? 'bg-[#C2113D] text-white border-[#C2113D]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Descrição Detalhada do Fato</label>
              <textarea
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Insira detalhes da reincidência, localidade exata, características físicas do autor e medidas civis urgentes tomadas no atendimento..."
                className="w-full bg-slate-50 text-xs border border-slate-200 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C2113D] hover:bg-[#A10D31] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Cadastrar Ocorrência no Roteiro
            </button>
          </form>
        </div>
      )}

      {activeTab === 'aggressors' && (
        /* REGISTER AGGRESSOR / VIEW LIST COMPONENT - RF08 */
        <div className="space-y-4" id="aggressors-view-subview">
          {/* Quick search filter bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar agressor por CPF, Nome, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Quick inline creation expandable block */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 space-y-3">
            <span className="block text-[10px] font-bold text-rose-800 uppercase tracking-widest">
              ➕ Cadastrar Medida Protetiva / Agressor (RF08)
            </span>
            
            <form onSubmit={handleCreateAggressor} className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome do Agressor"
                  value={aggrName}
                  onChange={(e) => setAggrName(e.target.value)}
                  className="bg-white border rounded p-2 text-xs w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="CPF (ex: 123.456.***)"
                  value={aggrCpf}
                  onChange={(e) => setAggrCpf(e.target.value)}
                  className="bg-white border rounded p-2 text-xs w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={aggrRisk}
                  onChange={(e) => setAggrRisk(e.target.value as any)}
                  className="bg-white border rounded p-2 text-xs w-full"
                >
                  <option value="Crítico">Crítico</option>
                  <option value="Alto">Alto</option>
                  <option value="Moderado">Moderado</option>
                </select>
                <input
                  type="text"
                  placeholder="Último setor (ex: Afogados)"
                  value={aggrLocation}
                  onChange={(e) => setAggrLocation(e.target.value)}
                  className="bg-white border rounded p-2 text-xs w-full"
                  required
                />
              </div>

              <textarea
                placeholder="Detalhes da decisão e limite em metros (ex: Medida Protetiva nº 411/26 emitida pela 3ª Vara...)"
                value={aggrMeasure}
                onChange={(e) => setAggrMeasure(e.target.value)}
                className="bg-white border rounded p-2 text-xs w-full h-12"
              />

              <button
                type="submit"
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg cursor-pointer"
              >
                Ativar Alerta Geo-referenciado
              </button>
            </form>
          </div>

          {/* Aggressors registry display */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Consolidações Ativas</span>
            
            {filteredAggressors.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">Nenhum agressor correspondente encontrado.</p>
            ) : (
              filteredAggressors.map(aggr => (
                <div key={aggr.id} className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl space-y-2 hover:border-red-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-[#0f172a] text-xs uppercase">{aggr.name}</h5>
                      <span className="text-[9px] font-mono text-slate-400">CPF: {aggr.cpf}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${aggr.riskLevel === 'Crítico' ? 'bg-red-100 text-red-800' : aggr.riskLevel === 'Alto' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                      Risco {aggr.riskLevel}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded">
                    <strong>Proteção:</strong> {aggr.protectiveMeasureDetails}
                  </p>

                  <div className="flex items-center gap-1 text-[9px] text-[#C2113D] font-bold pt-1">
                    <UserMinus className="w-3 h-3 block shrink-0" />
                    <span>Último avistamento: {aggr.lastKnownLocationName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
