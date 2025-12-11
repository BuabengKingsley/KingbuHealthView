import React from 'react';
import { User } from '../../types';

interface DashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const DoctorDashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">Dr. Dashboard</h1>
           <p className="text-slate-500 mt-1 font-medium">Overview of your patient activity.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
          <span>+</span> Invite Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
           <div className="absolute right-0 top-0 h-24 w-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Patients</h3>
               <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+12%</span>
             </div>
             <p className="font-heading text-4xl font-extrabold text-slate-900 mt-3">142</p>
           </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
           <div className="absolute right-0 top-0 h-24 w-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Pending Reviews</h3>
               <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold">Action Needed</span>
             </div>
             <p className="font-heading text-4xl font-extrabold text-slate-900 mt-3">5</p>
           </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
           <div className="absolute right-0 top-0 h-24 w-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Today's Appointments</h3>
               <span className="text-slate-400 text-[10px] font-bold">Oct 24</span>
             </div>
             <p className="font-heading text-4xl font-extrabold text-slate-900 mt-3">8</p>
           </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm flex justify-between items-center">
          <h3 className="font-heading font-bold text-slate-900 text-lg">Recent Patient Scans</h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">AI Analysis</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {[
                { name: 'Chioma Adebayo', date: 'Oct 24, 10:30 AM', severity: 'High', status: 'Pending' },
                { name: 'Tunde Bakare', date: 'Oct 24, 09:15 AM', severity: 'Low', status: 'Reviewed' },
                { name: 'Amara Diallo', date: 'Oct 23, 04:45 PM', severity: 'Medium', status: 'Pending' },
              ].map((patient, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 border border-white shadow-sm">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-500 font-medium">ID: #{2049 + idx}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{patient.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      patient.severity === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 
                      patient.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {patient.severity} Risk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {patient.status === 'Pending' ? (
                       <span className="flex items-center gap-1.5 text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded w-fit text-xs">
                         <span className="block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                       </span>
                    ) : (
                       <span className="text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded text-xs">Reviewed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};