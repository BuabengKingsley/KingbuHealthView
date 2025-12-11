import React, { useState } from 'react';
import { Auth } from './components/auth/Auth';
import { Header } from './components/layout/Header';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { UTIScanner } from './components/patient/UTIScanner';
import { AppointmentBooking } from './components/patient/AppointmentBooking';
import { ChatBot } from './components/shared/ChatBot';
import { NewsFeed } from './components/shared/NewsFeed';
import { User, UserRole } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    if (!user) return <Auth onLogin={handleLogin} />;

    switch (currentView) {
      case 'dashboard':
        return user.role === UserRole.DOCTOR 
          ? <DoctorDashboard user={user} onNavigate={setCurrentView} />
          : <PatientDashboard user={user} onNavigate={setCurrentView} />;
      case 'scan':
        return <UTIScanner />;
      case 'chat':
        return <ChatBot />;
      case 'news':
        return <NewsFeed />;
      case 'appointments':
        return <AppointmentBooking onNavigate={setCurrentView} />;
      default:
        return user.role === UserRole.DOCTOR 
          ? <DoctorDashboard user={user} onNavigate={setCurrentView} />
          : <PatientDashboard user={user} onNavigate={setCurrentView} />;
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