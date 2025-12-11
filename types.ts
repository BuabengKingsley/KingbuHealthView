export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ScanResult {
  id: string;
  date: string;
  imageUrl: string;
  analysis: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Reviewed';
}

export interface Appointment {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
}