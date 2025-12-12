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
  // Extended Profile
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  height?: string; // stored as string for input flexibility e.g. "5'11" or "180cm"
  weight?: string;
  bloodType?: string;
  emergencyContact?: string;
}

export interface ScanResult {
  id: string | number;
  date: string;
  time: string;
  imageUrl?: string;
  severity: 'Low' | 'Medium' | 'High';
  status: string;
  riskColor: 'emerald' | 'amber' | 'red';
  reviewStatus: 'Pending' | 'Reviewed';
  details: string;
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