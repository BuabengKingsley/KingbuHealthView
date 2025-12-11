import React, { useState } from 'react';
import { UserRole, User } from '../../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: isLogin ? (email.includes('doctor') ? 'Dr. Amina Okeke' : 'Kofi Mensah') : name,
        email,
        role: isLogin ? (email.includes('doctor') ? UserRole.DOCTOR : UserRole.PATIENT) : role,
      };
      
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans animate-fadeIn">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[500px] z-10 bg-white relative">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">Kingbu<span className="text-blue-600">HealthView</span></span>
          </div>

          <div className="mb-10">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              {isLogin ? 'Access your personal health dashboard securely.' : 'Create your secure health profile today to get started.'}
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-5 animate-slideUp">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium" placeholder="e.g. Zola Ndiaye" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => setRole(UserRole.PATIENT)}
                        className={`cursor-pointer rounded-xl border p-3.5 flex items-center justify-center text-sm font-bold transition-all duration-200 ${role === UserRole.PATIENT ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                      >
                        Patient
                      </div>
                      <div 
                        onClick={() => setRole(UserRole.DOCTOR)}
                        className={`cursor-pointer rounded-xl border p-3.5 flex items-center justify-center text-sm font-bold transition-all duration-200 ${role === UserRole.DOCTOR ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                      >
                        Doctor
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium" placeholder="you@example.com" />
              </div>

              <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium" placeholder="••••••••" />
              </div>

              <div className="pt-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 duration-200 font-heading tracking-wide">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       Processing...
                    </span>
                  ) : (isLogin ? 'Sign in' : 'Create account')}
                </button>
              </div>
            </form>

            <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-400 font-medium">Quick Demo Access</span>
                </div>
              </div>
               <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => { setEmail('patient@test.com'); setPassword('123456'); }} className="flex justify-center items-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-semibold rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all">
                    Patient Demo
                  </button>
                  <button onClick={() => { setEmail('doctor@test.com'); setPassword('123456'); }} className="flex justify-center items-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-semibold rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all">
                    Doctor Demo
                  </button>
               </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              {isLogin ? 'New to KingbuHealthView?' : 'Already have an account?'}
              <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-blue-600 hover:text-blue-700 ml-1 transition-colors underline-offset-2 hover:underline">
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 h-full w-full">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 opacity-90"></div>
           {/* Abstract shapes */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-20 z-10 animate-fadeIn">
           <div className="max-w-xl">
             <h1 className="font-heading text-5xl font-bold mb-6 leading-tight tracking-tight">Your Health.<br/>Reimagined with AI.</h1>
             <p className="text-xl text-blue-100 leading-relaxed font-light">Experience the future of personal healthcare. Instant UTI analysis, smart insights, and seamless doctor connection—all in one secure place.</p>
             
             <div className="mt-12 grid grid-cols-2 gap-6">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors duration-300">
                 <div className="text-3xl mb-3">⚡️</div>
                 <div className="font-heading font-bold text-lg">Instant Analysis</div>
                 <div className="text-sm text-blue-200 mt-1 font-medium">Get AI-powered results in seconds</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors duration-300">
                 <div className="text-3xl mb-3">🛡️</div>
                 <div className="font-heading font-bold text-lg">Secure & Private</div>
                 <div className="text-sm text-blue-200 mt-1 font-medium">Enterprise-grade data protection</div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};