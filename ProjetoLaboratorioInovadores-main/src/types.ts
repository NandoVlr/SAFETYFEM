/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  USER = 'USER',
  ADMIN_OPERADOR = 'ADMIN_OPERADOR'
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  frequentAddresses: {
    label: string;
    address: string;
    lat: number;
    lng: number;
  }[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  avatarInitial: string;
}

export interface CustomRoute {
  id: string;
  destinationName: string;
  etaTime: string; // e.g., '10:00'
  durationMinutes: number;
  startedAt?: string;
  isActive: boolean;
  checkpointsConfirmations: {
    id: string;
    name: string;
    timeOffset: number; // minutes
    isConfirmed: boolean;
  }[];
}

export interface Occurrence {
  id: string;
  sector: string; // e.g., 'Imbiribeira', 'Afogados'
  date: string;
  description: string;
  status: 'Resolvida' | 'Não resolvida' | 'Pendente';
  severity: 'Alta' | 'Média' | 'Baixa';
  latitude: number;
  longitude: number;
}

export interface Aggressor {
  id: string;
  name: string;
  cpf: string;
  riskLevel: 'Crítico' | 'Alto' | 'Moderado';
  protectiveMeasureDetails: string;
  activeDistanceLimit: number; // in meters, e.g., 500m
  lastKnownLocationName: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface RiskZone {
  id: string;
  name: string;
  radius: number; // visual scale representation
  lat: number;
  lng: number;
  incidentCount: number;
  status: 'Alta Concentração' | 'Fluxo Alto' | 'Zona Habitual';
}
