/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Video, Phone, Plus, UserPlus, Trash2, ShieldAlert } from 'lucide-react';
import { EmergencyContact } from '../types';

interface ContactsTabProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

export default function ContactsTab({ contacts, onAddContact, onRemoveContact }: ContactsTabProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddContact({
      name: name.toUpperCase(),
      relationship,
      phone,
      avatarInitial: name.trim().charAt(0).toUpperCase() || '?'
    });

    // Reset fields
    setName('');
    setRelationship('');
    setPhone('');
    setShowAddForm(false);
  };

  const handleSimulateCall = (contactName: string, type: 'video' | 'voice') => {
    alert(`Simulação: Iniciando chamada de ${type === 'video' ? 'Vídeo Protetor 📹' : 'Voz de Emergência 📞'} em tempo real com ${contactName}.`);
  };

  return (
    <div className="w-full flex-1 bg-white p-5 flex flex-col font-sans overflow-y-auto" id="contacts-tab-root">
      
      {/* Header with Add Button exactly styled like mockup with Back Arrow and plus circle */}
      <div className="flex items-center justify-between mb-6" id="contacts-header-wrapper">
        <h2 className="text-2xl font-black text-[#0F172A]" id="contacts-title">
          Contatos
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-10 h-10 bg-[#FFF1F3] text-[#C2113D] rounded-full flex items-center justify-center shadow-sm hover:bg-[#FFE2E6] active:scale-95 transition-all cursor-pointer"
          title="Cadastrar novo contato de emergência"
          id="btn-add-contact-toggle"
        >
          <Plus className="w-5 h-5 font-black" />
        </button>
      </div>

      {showAddForm && (
        <form 
          onSubmit={handleSubmit} 
          className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 mb-6 space-y-3.5"
          id="add-contact-form"
        >
          <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" /> Novo Contato de Confiança
          </h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: TIA HELENA"
                className="w-full bg-white text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-400 capitalize"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Parentesco / Vínculo</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Ex: Tia, Vizinha, Amiga de Faculdade"
                className="w-full bg-white text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Telefone Celular</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (81) 9"
                className="w-full bg-white text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 bg-[#C2113D] hover:bg-[#A10D31] text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer"
            >
              Adicionar Contato
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* RNF06 Usability Alert: explains standard quick contacts utility */}
      <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100 flex items-start gap-2.5 mb-5" id="contacts-info-notice">
        <ShieldAlert className="w-4 h-4 text-[#C2113D] mt-0.5 shrink-0" />
        <div className="text-[10px] text-slate-600 leading-normal">
          <p className="font-semibold text-rose-800">Canais de Emergência Ativos</p>
          Em caso de perigo ou pânico imediato, além destas pessoas cadastradas, a Secretaria de Defesa Social recebe sua transmissão de áudio, vídeo e localização em tempo real no prazo de 3 segundos (RNF04).
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs" id="contacts-empty-state">
          Nenhum contato cadastrado. Clique no botão "+" acima para cadastrar novos anjos protetores.
        </div>
      ) : (
        /* List of emergency contacts with matching pink circular avatar aesthetics */
        <div className="space-y-4 flex-1" id="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between pb-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Pink elegant avatar with initial character */}
                <div className="w-14 h-14 rounded-full bg-[#FFF1F3] border border-rose-100 text-[#C2113D] font-extrabold text-lg flex items-center justify-center shadow-sm shrink-0">
                  {contact.avatarInitial}
                </div>
                
                <div>
                  <h4 className="text-base font-black text-slate-800 tracking-wide uppercase">
                    {contact.name}
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold capitalize mt-0.5">
                    {contact.relationship}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {contact.phone}
                  </p>
                </div>
              </div>

              {/* Action shortcuts matching exact UI: Quick Video Call and Phone Call */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleSimulateCall(contact.name, 'video')}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center border border-slate-100 hover:border-rose-100 transition-all cursor-pointer shadow-sm active:scale-90"
                  title={`Videochamada protegida com ${contact.name}`}
                >
                  <Video className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleSimulateCall(contact.name, 'voice')}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center border border-slate-100 hover:border-rose-100 transition-all cursor-pointer shadow-sm active:scale-90"
                  title={`Telefonar para ${contact.name}`}
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* Non-mock addition delete trigger to demonstrate responsiveness */}
                <button
                  onClick={() => onRemoveContact(contact.id)}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center border border-slate-100 hover:border-rose-200 transition-all cursor-pointer shadow-sm active:scale-90"
                  title="remover contato de segurança"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
