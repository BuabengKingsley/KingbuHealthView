import React from 'react';
import { User, UserRole } from '../../types';

interface NavButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative inline-flex items-center px-3 pt-1 text-sm font-semibold h-full transition-all duration-300 ${
      active
        ? 'text-blue-600'
        : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full transform transition-transform duration-300 ease-out ${active ? 'scale-x-100' : 'scale-x-0'}`} />
  </button>
);

interface MobileNavBtnProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const MobileNavBtn: React.FC<MobileNavBtnProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${active ? 'bg-blue-50 text-blue-600 scale-105 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-[10px] font-bold tracking-wide font-heading">{label}</span>
  </button>
);

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onNavigate }) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Kingbu<span className="text-blue-600">HealthView</span></span>
            </div>
          </div>
          
          {user && (
            <div className="hidden sm:flex sm:space-x-4 items-center h-full">
              <NavButton active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>Dashboard</NavButton>
              {user.role === UserRole.PATIENT && (
                 <>
                   <NavButton active={currentView === 'scan'} onClick={() => onNavigate('scan')}>New Scan</NavButton>
                   <NavButton active={currentView === 'appointments'} onClick={() => onNavigate('appointments')}>Appointments</NavButton>
                 </>
              )}
              <NavButton active={currentView === 'news'} onClick={() => onNavigate('news')}>Health News</NavButton>
              <NavButton active={currentView === 'chat'} onClick={() => onNavigate('chat')}>AI Assistant</NavButton>
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 h-8">
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-sm ring-2 ring-slate-50">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-slate-800 leading-none">{user.name}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1 font-heading">{user.role}</span>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </>
            ) : (
              <span className="text-sm font-medium text-slate-500">Guest Access</span>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      {user && (
        <div className="sm:hidden border-t border-slate-200 flex justify-around p-2 bg-white/95 backdrop-blur-lg pb-safe">
           <MobileNavBtn icon="🏠" label="Home" active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
           {user.role === UserRole.PATIENT && (
             <>
                <MobileNavBtn icon="📸" label="Scan" active={currentView === 'scan'} onClick={() => onNavigate('scan')} />
                <MobileNavBtn icon="📅" label="Book" active={currentView === 'appointments'} onClick={() => onNavigate('appointments')} />
             </>
           )}
           <MobileNavBtn icon="📰" label="News" active={currentView === 'news'} onClick={() => onNavigate('news')} />
           <MobileNavBtn icon="💬" label="Chat" active={currentView === 'chat'} onClick={() => onNavigate('chat')} />
        </div>
      )}
    </header>
  );
};