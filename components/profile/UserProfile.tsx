import React, { useState, useRef } from 'react';
import { User, UserRole } from '../../types';

interface UserProfileProps {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
  onNavigate: (view: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'health' | 'security'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form state with user data or defaults
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender || 'Prefer not to say',
    dateOfBirth: user.dateOfBirth || '',
    height: user.height || '',
    weight: user.weight || '',
    bloodType: user.bloodType || '',
    emergencyContact: user.emergencyContact || '',
    avatarUrl: user.avatarUrl
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onUpdateUser(formData);
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form to current user props
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || 'Prefer not to say',
      dateOfBirth: user.dateOfBirth || '',
      height: user.height || '',
      weight: user.weight || '',
      bloodType: user.bloodType || '',
      emergencyContact: user.emergencyContact || '',
      avatarUrl: user.avatarUrl
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Header / Breadcrumb */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className={`absolute inset-0 h-32 bg-gradient-to-br ${user.role === UserRole.DOCTOR ? 'from-purple-600 to-indigo-700' : 'from-blue-600 to-blue-700'}`}></div>
            
            <div className="relative z-10 mt-12 mb-4 group">
              <div 
                onClick={triggerFileInput}
                className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center relative ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
              >
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${user.role === UserRole.DOCTOR ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                    {formData.name?.[0] || user.name?.[0]}
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <h2 className="font-heading text-2xl font-bold text-slate-900">{formData.name}</h2>
            <p className="text-slate-500 font-medium">{user.email}</p>
            
            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === UserRole.DOCTOR ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              {user.role} Account
            </div>

            <div className="w-full mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2">
               <div className="text-center">
                 <span className="block font-bold text-slate-900 text-lg">14</span>
                 <span className="text-[10px] text-slate-400 uppercase font-bold">Scans</span>
               </div>
               <div className="text-center border-l border-slate-100">
                 <span className="block font-bold text-slate-900 text-lg">3</span>
                 <span className="text-[10px] text-slate-400 uppercase font-bold">Visits</span>
               </div>
               <div className="text-center border-l border-slate-100">
                 <span className="block font-bold text-slate-900 text-lg">98%</span>
                 <span className="text-[10px] text-slate-400 uppercase font-bold">Complete</span>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-heading font-bold text-slate-900 mb-4">Account Security</h3>
            <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                   <span className="text-sm font-bold text-slate-700">Change Password</span>
                 </div>
                 <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
               <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                   <span className="text-sm font-bold text-slate-700">2FA Settings</span>
                 </div>
                 <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
            </div>
          </div>
        </div>

        {/* Right Content - Tabs & Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
            {['personal', 'health', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {activeTab === 'personal' ? 'Personal Details' : activeTab === 'health' ? 'Health Metrics' : 'Security Settings'}
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Profile
                </button>
              )}
            </div>

            <form className="space-y-6">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                     <input type="text" name="name" disabled={!isEditing} value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                     <input type="email" name="email" disabled={!isEditing} value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                     <input type="tel" name="phone" disabled={!isEditing} value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
                     <input type="date" name="dateOfBirth" disabled={!isEditing} value={formData.dateOfBirth} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5 md:col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Emergency Contact</label>
                     <input type="text" name="emergencyContact" disabled={!isEditing} value={formData.emergencyContact} onChange={handleInputChange} placeholder="Name and Relationship" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Height</label>
                     <input type="text" name="height" disabled={!isEditing} value={formData.height} onChange={handleInputChange} placeholder="e.g. 175 cm / 5'9" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Weight</label>
                     <input type="text" name="weight" disabled={!isEditing} value={formData.weight} onChange={handleInputChange} placeholder="e.g. 70 kg / 154 lbs" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Blood Type</label>
                     <select name="bloodType" disabled={!isEditing} value={formData.bloodType} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all appearance-none">
                       <option value="">Select Type</option>
                       <option value="A+">A+</option>
                       <option value="A-">A-</option>
                       <option value="B+">B+</option>
                       <option value="B-">B-</option>
                       <option value="AB+">AB+</option>
                       <option value="AB-">AB-</option>
                       <option value="O+">O+</option>
                       <option value="O-">O-</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                     <select name="gender" disabled={!isEditing} value={formData.gender} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all appearance-none">
                       <option value="Prefer not to say">Prefer not to say</option>
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                     </select>
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                     <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     <div>
                       <h4 className="font-bold text-amber-800 text-sm">Sensitive Information</h4>
                       <p className="text-xs text-amber-700 mt-1">Changes to security settings may require email verification.</p>
                     </div>
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
                     <input type="password" disabled={!isEditing} placeholder="••••••••••••" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all" />
                   </div>
                   
                   {isEditing && (
                     <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                          <input type="password" placeholder="Enter new password" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Confirm New Password</label>
                          <input type="password" placeholder="Confirm new password" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                     </>
                   )}
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 animate-fadeIn">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};