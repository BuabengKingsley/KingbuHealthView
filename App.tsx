import React, { useState } from 'react';
import { Auth } from './components/auth/Auth';
import { Header } from './components/layout/Header';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { UTIScanner } from './components/patient/UTIScanner';
import { AppointmentBooking } from './components/patient/AppointmentBooking';
import { ChatBot } from './components/shared/ChatBot';
import { NewsFeed } from './components/shared/NewsFeed';
import { UserProfile } from './components/profile/UserProfile';
import { User, UserRole, ScanResult } from './types';

// Initial Mock Data moved from Dashboard
const INITIAL_SCANS: ScanResult[] = [
  { 
    id: 101, 
    date: 'Oct 24, 2023', 
    time: '09:30 AM', 
    severity: 'Low', 
    status: 'Normal Results', 
    riskColor: 'emerald',
    reviewStatus: 'Reviewed',
    details: 'Leukocytes negative, Nitrites negative.'
  },
  { 
    id: 102, 
    date: 'Oct 20, 2023', 
    time: '04:15 PM', 
    severity: 'Medium', 
    status: 'Monitor Closely', 
    riskColor: 'amber',
    reviewStatus: 'Pending',
    details: 'Trace Leukocytes detected.'
  },
  { 
    id: 103, 
    date: 'Oct 15, 2023', 
    time: '11:00 AM', 
    severity: 'High', 
    status: 'Action Recommended', 
    riskColor: 'red',
    reviewStatus: 'Reviewed',
    details: 'Positive for Nitrites and Leukocytes.'
  },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [scans, setScans] = useState<ScanResult[]>(INITIAL_SCANS);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleSaveScan = (newScan: ScanResult) => {
    setScans(prev => [newScan, ...prev]);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const renderView = () => {
    if (!user) return <Auth onLogin={handleLogin} />;

    switch (currentView) {
      case 'dashboard':
        return user.role === UserRole.DOCTOR 
          ? <DoctorDashboard user={user} onNavigate={setCurrentView} />
          : <PatientDashboard user={user} onNavigate={setCurrentView} scans={scans} />;
      case 'profile':
        return <UserProfile user={user} onUpdateUser={handleUpdateUser} onNavigate={setCurrentView} />;
      case 'scan':
        return <UTIScanner onSaveScan={handleSaveScan} />;
      case 'chat':
        return <ChatBot />;
      case 'news':
        return <NewsFeed />;
      case 'appointments':
        return <AppointmentBooking onNavigate={setCurrentView} />;
      default:
        return user.role === UserRole.DOCTOR 
          ? <DoctorDashboard user={user} onNavigate={setCurrentView} />
          : <PatientDashboard user={user} onNavigate={setCurrentView} scans={scans} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {user && (
        <Header 
          user={user} 
          onLogout={handleLogout} 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      )}
      <main className="transition-all duration-300 ease-in-out">
        {renderView()}
      </main>
    </div>
  );
}