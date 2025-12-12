import React, { useState, useEffect } from 'react';
import { User, ScanResult } from '../../types';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  scans: ScanResult[];
}

const EDUCATIONAL_VIDEOS = [
  {
    id: 'tPi99h1DtbU',
    title: 'Understanding UTIs',
    channel: 'Mayo Clinic',
    description: 'Expert insights on Urinary Tract Infection symptoms and prevention strategies.'
  },
  {
    id: '9pDyLODh_bM', 
    title: 'Preventing Infections',
    channel: 'Cleveland Clinic',
    description: 'Key lifestyle changes to reduce the risk of recurring infections.'
  },
  {
    id: 'NOqxTNqUV6k',
    title: 'General Wellness',
    channel: 'Health News',
    description: 'Latest updates on maintaining a healthy lifestyle and immunity.'
  }
];

export const PatientDashboard: React.FC<DashboardProps> = ({ user, onNavigate, scans }) => {
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Hydration State
  const [hydrationCurrent, setHydrationCurrent] = useState(1250); // ml
  const hydrationGoal = 2500; // ml
  const [streakDays, setStreakDays] = useState(12); // Mock streak
  const [showConfetti, setShowConfetti] = useState(false);

  // Video State
  const [currentVideo, setCurrentVideo] = useState(EDUCATIONAL_VIDEOS[0]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedScan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedScan]);

  const handleAddWater = () => {
    setHydrationCurrent(prev => {
        const newValue = prev + 250;
        if (newValue >= hydrationGoal && prev < hydrationGoal) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setStreakDays(s => s + 1); // Increment streak on goal completion (demo logic)
        }
        return newValue;
    });
  };

  const hydrationPercentage = Math.min((hydrationCurrent / hydrationGoal) * 100, 100);

  const handleDownloadPDF = () => {
    if (!selectedScan) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF();

      // Branding Header
      doc.setFillColor(240, 247, 255); // blue-50
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(0, 111, 238); // blue-600
      doc.setFont('helvetica', 'bold');
      doc.text("KingbuHealthView", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFont('helvetica', 'normal');
      doc.text("AI-Powered Medical Analysis", 20, 32);

      // Report Title
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont('helvetica', 'bold');
      doc.text("Scan Analysis Report", 20, 60);

      // Line Separator
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(20, 65, 190, 65);

      // Patient & Scan Info
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105); // slate-600
      
      let yPos = 80;
      doc.setFont('helvetica', 'bold');
      doc.text("Patient Name:", 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(user.name, 60, yPos);
      
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text("Report ID:", 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`#${Number(selectedScan.id) + 200}`, 60, yPos);

      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text("Date & Time:", 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${selectedScan.date} at ${selectedScan.time}`, 60, yPos);

      // Risk Assessment Box
      yPos += 20;
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(20, yPos, 170, 35, 3, 3, 'FD');

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text("Risk Assessment", 30, yPos + 12);

      doc.setFontSize(14);
      const color = selectedScan.riskColor === 'red' ? [220, 38, 38] : selectedScan.riskColor === 'amber' ? [217, 119, 6] : [5, 150, 105];
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(`${selectedScan.severity} Risk`, 30, yPos + 25);

      // Analysis Details
      yPos += 55;
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text("Clinical Findings", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.setFont('helvetica', 'normal');
      
      const fullDetails = `${selectedScan.details}\n\nBased on the colorimetric analysis of the reagent pads, the sample indicates ${selectedScan.severity === 'Low' ? 'normal parameters' : 'potential abnormalities'} requiring further review.\n\nStatus: ${selectedScan.status}\nDoctor Review: ${selectedScan.reviewStatus}`;
      const splitText = doc.splitTextToSize(fullDetails, 170);
      doc.text(splitText, 20, yPos);

      // Disclaimer Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("DISCLAIMER: This report is generated by KingbuHealthView AI for informational purposes only. It does not constitute a definitive medical diagnosis. Please consult a qualified healthcare provider for proper testing and clinical advice.", 20, 280, { maxWidth: 170 });

      // Save
      doc.save(`KingbuHealth_Report_${selectedScan.id}_${selectedScan.date.replace(/,/g, '').replace(/\s/g, '_')}.pdf`);

    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">Good Morning, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-1 font-medium">Your daily health summary and actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('appointments')}
            className="hidden md:flex bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl font-bold border border-slate-200 shadow-sm transition-all items-center gap-2"
          >
            <span>+</span> Book Appointment
          </button>
          <span className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Call to Action Card - Enhanced Visibility */}
        <div 
          onClick={() => onNavigate('scan')}
          className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 ring-1 ring-white/10"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-125 transition-transform duration-500 blur-2xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded text-white backdrop-blur-md border border-white/10 animate-pulse-slow">CHECK</span>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold mt-4 group-hover:translate-x-1 transition-transform">Start Checkup &rarr;</h3>
              <p className="mt-1 text-sm text-blue-100 opacity-90 font-medium leading-relaxed">Scan test strips or check symptoms manually.</p>
            </div>
          </div>
        </div>

        {/* Appointment Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-purple-200 group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider font-heading">Next Appointment</h3>
             <div className="bg-purple-50 p-2 rounded-xl group-hover:bg-purple-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
           </div>
           {/* Static for now, but actionable */}
           <p className="font-heading text-lg font-bold text-slate-900">Tomorrow, 10:00 AM</p>
           <div className="flex items-center gap-2 mt-2">
             <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-500">Dr</div>
             <p className="text-sm text-slate-600 font-medium">Dr. Amina Okeke</p>
           </div>
           <button 
             onClick={() => onNavigate('appointments')}
             className="mt-5 w-full py-2 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors uppercase tracking-wide"
           >
             Book New / Manage
           </button>
        </div>

        {/* Health Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-emerald-200 group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider font-heading">Overall Status</h3>
             <div className="bg-emerald-50 p-2 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
           </div>
           <div className="flex items-baseline gap-2">
             <p className="font-heading text-2xl font-bold text-slate-900">Stable</p>
             <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">No Issues</span>
           </div>
           <p className="text-xs text-slate-400 mt-1 font-medium">Last checkup: 3 days ago</p>
           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
             <div className="bg-emerald-500 h-1.5 rounded-full w-4/5 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>

        {/* AI Assistant Card */}
        <div 
          onClick={() => onNavigate('chat')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 cursor-pointer transition-all hover:shadow-md hover:border-blue-200 group"
        >
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider font-heading">AI Assistant</h3>
             <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </div>
           </div>
           <p className="text-sm font-medium text-slate-800 leading-snug italic">"How do I prevent a UTI recurring?"</p>
           <p className="text-xs text-blue-600 font-bold mt-4 group-hover:underline flex items-center gap-1">Ask a question <span className="group-hover:translate-x-1 transition-transform">&rarr;</span></p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dedicated Recent Scans Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 backdrop-blur-sm">
             <div>
                <h3 className="font-heading font-bold text-slate-900 text-lg">Recent UTI Scan Results</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">History of your AI-powered strip analyses</p>
             </div>
             <div className="flex gap-3">
               <button 
                onClick={() => onNavigate('scan')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
               >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  New Checkup
               </button>
               <button className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all">
                  Full History
               </button>
             </div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {scans.map((scan) => (
              <div key={scan.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-default">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  
                  {/* Icon & Details */}
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                      scan.riskColor === 'red' ? 'bg-red-50 text-red-600' :
                      scan.riskColor === 'amber' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      🔬
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-heading font-bold text-slate-900 text-base">UTI Test Analysis #{Number(scan.id) + 200}</h4>
                        {/* Show LATEST tag for the first item */}
                        {scan.id === scans[0].id && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">LATEST</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{scan.date} • {scan.time}</p>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-md line-clamp-2">{scan.details}</p>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                     <div className="flex flex-col items-end gap-2">
                        {/* Status Indicator */}
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg border transition-all ${
                          scan.reviewStatus === 'Pending' 
                            ? 'bg-blue-50 text-blue-700 border-blue-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {scan.reviewStatus === 'Pending' ? (
                            <>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </span>
                              <span>Review Pending</span>
                            </>
                          ) : (
                            <>
                               <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                               <span>Reviewed</span>
                            </>
                          )}
                        </div>

                        {/* Severity Indicator */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block text-right">Severity Level</span>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                            scan.riskColor === 'red' ? 'bg-red-50 text-red-700 border-red-100' :
                            scan.riskColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              scan.riskColor === 'red' ? 'bg-red-500 animate-pulse' :
                              scan.riskColor === 'amber' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}></span>
                            <span className="text-xs font-bold">{scan.severity} Risk</span>
                          </div>
                        </div>
                     </div>
                     
                     <button 
                        onClick={() => setSelectedScan(scan)}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group/btn bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl w-full sm:w-auto justify-center border border-blue-100"
                     >
                       View Analysis
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hydration & Education */}
        <div className="space-y-6">
          {/* Hydration Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative">
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🎉</div>
                </div>
            )}
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-heading font-bold text-slate-900">Hydration</h3>
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-xs font-bold text-orange-700">{streakDays} Day Streak</span>
              </div>
            </div>
            <div className="p-6 flex flex-col items-center justify-center flex-1">
              <div className="relative h-44 w-44 mx-auto mb-6">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Progress Circle */}
                  <path 
                      className={`drop-shadow-lg filter transition-all duration-1000 ease-out ${hydrationPercentage >= 100 ? 'text-emerald-500' : 'text-blue-500'}`} 
                      strokeDasharray={`${hydrationPercentage}, 100`} 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="font-heading text-4xl font-extrabold text-slate-900">
                    {(hydrationCurrent / 1000).toFixed(1).replace('.0', '')}
                    <span className="text-lg text-slate-500 font-bold">L</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    of {(hydrationGoal / 1000).toFixed(1)}L Goal
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <button 
                  onClick={handleAddWater}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add 250ml
                </button>
                <p className="text-center text-xs text-slate-400 font-medium">
                   {hydrationPercentage >= 100 ? "Goal reached! Amazing work! 💧" : "Keep up the good work!"}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Video Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
             <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50">
               <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2">
                 <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Public Health Education
               </h3>
             </div>
             
             {/* Interactive Video Player */}
             <div className="relative w-full aspect-video bg-slate-900 group">
               <iframe 
                 key={currentVideo.id} // Force re-render on video change
                 className="absolute inset-0 w-full h-full"
                 src={`https://www.youtube.com/embed/${currentVideo.id}`}
                 title={currentVideo.title}
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               ></iframe>
             </div>
             
             {/* Video Info & Controls */}
             <div className="p-5">
               <div className="mb-4">
                 <h4 className="font-bold text-slate-900 text-sm mb-1">{currentVideo.title}</h4>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   <span className="font-bold text-purple-600">{currentVideo.channel}:</span> {currentVideo.description}
                 </p>
               </div>
               
               {/* Playlist */}
               <div className="space-y-2">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">More Videos</p>
                 {EDUCATIONAL_VIDEOS.map(video => (
                   <button 
                     key={video.id}
                     onClick={() => setCurrentVideo(video)}
                     className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors border ${
                       currentVideo.id === video.id 
                         ? 'bg-purple-50 border-purple-100' 
                         : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-100'
                     }`}
                   >
                     <div className="relative w-12 h-8 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                       <img src={`https://img.youtube.com/vi/${video.id}/default.jpg`} alt="" className="w-full h-full object-cover opacity-80" />
                       {currentVideo.id === video.id && (
                         <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                         </div>
                       )}
                     </div>
                     <div className="min-w-0">
                       <p className={`text-xs font-bold truncate ${currentVideo.id === video.id ? 'text-purple-700' : 'text-slate-700'}`}>{video.title}</p>
                       <p className="text-[10px] text-slate-400 truncate">{video.channel}</p>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Analysis Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp relative">
                <button 
                    onClick={() => setSelectedScan(null)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                        Scan Analysis #{Number(selectedScan.id) + 200}
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            selectedScan.riskColor === 'red' ? 'bg-red-50 text-red-700 border-red-100' :
                            selectedScan.riskColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                            {selectedScan.severity} Risk
                        </span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedScan.date} at {selectedScan.time}</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Visual Representation (Mock Strip) */}
                    <div className="flex gap-2 justify-center mb-6">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-8 h-12 rounded-md shadow-sm border border-slate-200 ${
                                selectedScan.severity === 'High' && i > 2 ? 'bg-purple-400' : 
                                selectedScan.severity === 'Medium' && i > 3 ? 'bg-amber-300' :
                                'bg-yellow-100'
                            }`}></div>
                        ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">AI Findings</h4>
                        <p className="text-slate-800 text-sm leading-relaxed font-medium">
                            {selectedScan.details}
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mt-2">
                        Based on the colorimetric analysis of the reagent pads, the sample indicates {selectedScan.severity === 'Low' ? 'normal parameters' : 'potential abnormalities'}.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-100 rounded-xl">
                            <span className="text-xs text-slate-400 font-bold block mb-1">Status</span>
                            <span className="text-sm font-bold text-slate-800">{selectedScan.status}</span>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-xl">
                            <span className="text-xs text-slate-400 font-bold block mb-1">Doctor Review</span>
                            <span className={`text-sm font-bold ${selectedScan.reviewStatus === 'Pending' ? 'text-amber-600' : 'text-emerald-600'}`}>{selectedScan.reviewStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        {isDownloading ? (
                           <>
                             <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             Generating...
                           </>
                        ) : (
                           <>
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                             Download PDF
                           </>
                        )}
                    </button>
                    <button 
                        onClick={() => setSelectedScan(null)}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};