/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onBypass: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBypass }: LoginScreenProps) {
  const [email, setEmail] = useState<string>('teste@safetyfem.com.br');
  const [password, setPassword] = useState<string>('******');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Por favor, informe um endereço de e-mail.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    
    // Check credentials logic
    setTimeout(() => {
      setIsSubmitting(false);
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('governo') || email.toLowerCase().includes('policia')) {
        onLoginSuccess(email, UserRole.ADMIN_OPERADOR);
      } else {
        onLoginSuccess(email, UserRole.USER);
      }
    }, 800);
  };

  const handleQuickSelection = (role: UserRole) => {
    if (role === UserRole.ADMIN_OPERADOR) {
      setEmail('institucional@safetyfem.gov.br');
      onLoginSuccess('institucional@safetyfem.gov.br', UserRole.ADMIN_OPERADOR);
    } else {
      setEmail('teste@safetyfem.com.br');
      onLoginSuccess('teste@safetyfem.com.br', UserRole.USER);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8FA] flex flex-col items-center justify-start py-8 px-4 font-sans overflow-auto select-none" id="login-container-root">
      
      {/* Brand Icon Location Header */}
      <div className="flex flex-col items-center text-center mt-6 mb-8" id="login-brand-header">
        <div className="relative mb-3 flex items-center justify-center">
          {/* Crimson PIN with heart cutout exactly representing screenshot style */}
          <div className="bg-[#C2113D] text-white p-4 rounded-full shadow-lg flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-extrabold tracking-wide text-[#9c0a2f] uppercase">
          SAFETYFEM
        </h2>
        <p className="text-slate-500 text-xs font-semibold max-w-[280px] mt-1 leading-snug">
          Tecnologia Integrada para a Proteção da Mulher
        </p>

        {/* Quick Test Bypass Button directly matching the screenshot style */}
        <button
          onClick={onBypass}
          className="mt-5 px-5 py-2.5 bg-white border border-[#C2113D] text-[#C2113D] rounded-full text-xs font-bold hover:bg-rose-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          id="btn-login-bypass-solution"
        >
          <span className="text-rose-600">❤</span> Solução Tecnológica (Teste Rápido)
        </button>
      </div>

      {/* Main Login Form card */}
      <div 
        className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-950/5 p-6 sm:p-8" 
        id="login-form-card"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-tight">
          Conecte-se com Segurança
        </h3>
        <p className="text-slate-500 text-xs mt-1 mb-6">
          Insira as credenciais de sua conta protetora
        </p>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl mb-4 border border-rose-200" id="login-error-message">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="login-action-form">
          {/* E-mail Input Field */}
          <div>
            <label className="block text-slate-700 text-xs font-bold mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-slate-700 text-xs font-bold mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Help center Link */}
          <div className="flex items-center justify-between text-xs pt-1.5 pb-2" id="login-form-options">
            <label className="flex items-center gap-1.5 text-slate-500 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              Lembrar-me
            </label>
            <button
              type="button"
              onClick={() => alert('Para redefinir sua senha, entre em contato direto com a Central da Secretaria de Defesa Social no número 190.')}
              className="text-[#9c0a2f] font-bold hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Form Submit button exactly representing "Entrar com Segurança" burgundy style */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C2113D] hover:bg-[#A10D31] text-white font-bold text-sm rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full"></span>
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5" />
                Entrar com Segurança
              </>
            )}
          </button>
        </form>

        {/* Informative credentials section block (RF11 Demonstration selector helper) */}
        <div className="mt-6 pt-5 border-t border-slate-100" id="login-institutional-roles-helper">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center mb-3">
            Simulador de Perfis de Acesso (RF11)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSelection(UserRole.USER)}
              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-800 rounded-lg transition-all text-center shrink-0 cursor-pointer"
              title="Acessar com perfil padrão da usuária sob proteção ativa"
            >
              👩 Usuária (Padrão)
            </button>
            <button
              onClick={() => handleQuickSelection(UserRole.ADMIN_OPERADOR)}
              className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg transition-all text-center shrink-0 cursor-pointer"
              title="Acessar painel operacional das Forças de Segurança Pública"
            >
              👮 Gestor Público
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer support policy notices matching LGPD laws */}
      <div className="mt-8 text-center" id="login-policy-footer">
        <p className="text-[10px] text-slate-400">
          Proteção em total conformidade com a LGPD (Lei nº 13.709/18).
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
          SAFETYFEM Versão Estável 4.1 • Secretaria de Defesa Social
        </p>
      </div>

    </div>
  );
}
