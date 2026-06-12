/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserRole, EmergencyContact, Occurrence, Aggressor, RiskZone, SecurityEventLog } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Usuária de Demonstrativa',
  email: 'teste@safetyfem.com.br',
  phone: '+55 (81) 99123-4567',
  role: UserRole.USER,
  frequentAddresses: [
    { label: 'Casa', address: 'Rua São Jerônimo, 142 - Imbiribeira, Recife - PE', lat: 8.1189, lng: -34.9048 },
    { label: 'Trabalho', address: 'Av. Governador Agamenon Magalhães, 500 - Santo Amaro, Recife - PE', lat: 8.0539, lng: -34.8728 },
    { label: 'Faculdade', address: 'Rua Acadêmico Hélio Ramos - Várzea, Recife - PE', lat: 8.0543, lng: -34.9525 }
  ]
};

export const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: 'c1', name: 'PAI', relationship: 'Pai', phone: '+55 (81) 98888-1111', avatarInitial: 'P' },
  { id: 'c2', name: 'MÃE', relationship: 'Mãe', phone: '+55 (81) 98888-2222', avatarInitial: 'M' },
  { id: 'c3', name: 'IRMÃO', relationship: 'Irmão', phone: '+55 (81) 98888-3333', avatarInitial: 'I' },
  { id: 'c4', name: 'IRMÃ', relationship: 'Irmã', phone: '+55 (81) 98888-4444', avatarInitial: 'I' }
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: 'o-101',
    sector: 'Imbiribeira',
    date: '2026-05-22',
    description: 'Tentativa de abordagem suspeita relatada na passarela do metrô Shopping.',
    status: 'Resolvida',
    severity: 'Alta',
    latitude: 50,
    longitude: 48
  },
  {
    id: 'o-102',
    sector: 'Afogados',
    date: '2026-05-22',
    description: 'Aproximação não autorizada de agressor cadastrado sob medida de afastamento.',
    status: 'Não resolvida',
    severity: 'Alta',
    latitude: 42,
    longitude: 38
  },
  {
    id: 'o-103',
    sector: 'Santo Amaro',
    date: '2026-05-21',
    description: 'Importunação verbal em parada de ônibus de alta circulação.',
    status: 'Resolvida',
    severity: 'Média',
    latitude: 31,
    longitude: 62
  },
  {
    id: 'o-104',
    sector: 'Boa Viagem',
    date: '2026-05-20',
    description: 'Acompanhamento persistente suspeito em via residencial escura.',
    status: 'Pendente',
    severity: 'Alta',
    latitude: 65,
    longitude: 45
  },
  {
    id: 'o-105',
    sector: 'Várzea',
    date: '2026-05-19',
    description: 'Alerta preventivo acionado via botão silencioso por importunação no transporte.',
    status: 'Resolvida',
    severity: 'Baixa',
    latitude: 25,
    longitude: 25
  },
  {
    id: 'o-106',
    sector: 'Ibura',
    date: '2026-05-18',
    description: 'Agressões verbais em local público com chamado direcionado à Polícia Militar.',
    status: 'Pendente',
    severity: 'Média',
    latitude: 72,
    longitude: 30
  }
];

export const INITIAL_AGGRESSORS: Aggressor[] = [
  {
    id: 'a-1',
    name: 'Carlos Roberto de Oliveira',
    cpf: '243.***.***-18',
    riskLevel: 'Crítico',
    protectiveMeasureDetails: 'Medida 2341/26: Afastamento mínimo de 500 metros da usuária e do local de trabalho.',
    activeDistanceLimit: 500,
    lastKnownLocationName: 'Boa Viagem (Tornozeleira ID #091-B)'
  },
  {
    id: 'a-2',
    name: 'José Amaro da Silva Santos',
    cpf: '453.***.***-09',
    riskLevel: 'Alto',
    protectiveMeasureDetails: 'Medida 1104/26: Proibição de contato por qualquer meio de comunicação ou proximidade menor de 300 metros.',
    activeDistanceLimit: 300,
    lastKnownLocationName: 'Afogados (Rastreamento Ativo)'
  },
  {
    id: 'a-3',
    name: 'Francisco Costa Ribeiro',
    cpf: '110.***.***-56',
    riskLevel: 'Moderado',
    protectiveMeasureDetails: 'Medida 0402/26: Proibição de frequentar locais comuns cadastrados pela vítima.',
    activeDistanceLimit: 200,
    lastKnownLocationName: 'Guabiraba'
  }
];

export const RISK_ZONES: RiskZone[] = [
  { id: 'rz1', name: 'Região do Centro - Recife Antigo (Alto Fluxo)', radius: 32, lat: 30, lng: 70, incidentCount: 14, status: 'Fluxo Alto' },
  { id: 'rz2', name: 'Entorno da Estação Tancredo Neves (Crucial)', radius: 24, lat: 48, lng: 52, incidentCount: 22, status: 'Alta Concentração' },
  { id: 'rz3', name: 'Acesso Norte de Olinda e Entorno (Geral)', radius: 20, lat: 15, lng: 80, incidentCount: 8, status: 'Zona Habitual' },
  { id: 'rz4', name: 'Divisa Água Fria / Arruda (Zona com Alertas)', radius: 26, lat: 35, lng: 30, incidentCount: 15, status: 'Alta Concentração' }
];

export const INITIAL_LOGS: SecurityEventLog[] = [
  { id: 'log-1', timestamp: '2026-05-22T11:00:21Z', action: 'Autenticação de Usuária no Portal Segurado', userEmail: 'teste@safetyfem.com.br', severity: 'INFO' },
  { id: 'log-2', timestamp: '2026-05-22T11:05:40Z', action: 'Atualização de Contato de Confiança: IRMÃ', userEmail: 'teste@safetyfem.com.br', severity: 'INFO' },
  { id: 'log-3', timestamp: '2026-05-22T11:15:10Z', action: 'Consulta institucional do cadastro de agressores', userEmail: 'teste@safetyfem.com.br', severity: 'WARNING' }
];
