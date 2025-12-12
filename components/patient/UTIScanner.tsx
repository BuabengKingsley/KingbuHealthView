import React, { useState, useRef } from 'react';
import { analyzeUTIScan, analyzeUTISymptoms } from '../../services/geminiService';
import { ScanResult } from '../../types';

type TabMode = 'scan' | 'manual';

interface SymptomAnalysisResult {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  analysis: string;
  contributingFactors: { name: string; impact: number }[];
  recommendations: string[];
  error?: string;
}

interface UTIScannerProps {
  onSaveScan?: (scan: ScanResult) => void;
}

const DisclaimerBox: React.FC = () => (
  <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-amber-700 font-medium">
          Medical Disclaimer: This AI analysis is for informational purposes only and does not constitute a medical diagnosis. 
          Always consult a healthcare professional for accurate testing and advice.
        </p>
      </div>
    </div>
  </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative group ml-2 inline-block">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-lg">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({ selected, onClick, label }) => (
  <button
    onClick={onClick}
    className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
      selected 
        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500 font-bold' 
        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

export const UTIScanner: React.FC<UTIScannerProps> = ({ onSaveScan }) => {
  const [activeTab, setActiveTab] = useState<TabMode>('scan');
  
  // Image Scan State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [symptoms, setSymptoms] = useState({
    pain: 'No',
    urgency: 'Normal',
    color: 'Pale Yellow',
    backPain: 'No',
    fever: 'No',
    visibleBlood: 'No',
    nausea: 'No',
    abdominalPain: 'No',
    smell: 'Normal'
  });
  const [isAnalyzingSymptoms, setIsAnalyzingSymptoms] = useState(false);
  const [symptomResult, setSymptomResult] = useState<SymptomAnalysisResult | null>(null);

  // Share State
  const [isSharing, setIsSharing] = useState(false);

  // --- Image Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setImageResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzingImage(true);
    try {
      const analysis = await analyzeUTIScan(selectedImage);
      setImageResult(analysis);
    } catch (error) {
      setImageResult("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  // --- Symptom Handlers ---
  const handleSymptomChange = (field: string, value: string) => {
    setSymptoms(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyzeSymptoms = async () => {
    setIsAnalyzingSymptoms(true);
    try {
      const rawResult = await analyzeUTISymptoms(symptoms);
      const parsedResult: SymptomAnalysisResult = JSON.parse(rawResult);
      setSymptomResult(parsedResult);
    } catch (error) {
      console.error(error);
      setSymptomResult({
        riskScore: 0,
        riskLevel: 'Low',
        analysis: "Failed to parse analysis results.",
        contributingFactors: [],
        recommendations: ["Please try again."],
        error: "Parsing Error"
      });
    } finally {
      setIsAnalyzingSymptoms(false);
    }
  };

  // --- Share Handler ---
  const handleShareResult = async (content: string, title: string) => {
    if (isSharing) return;

    const shareData = {
      title: title,
      text: `KingbuHealthView Result:\n\n${content}\n\nDisclaimer: AI-generated analysis. Consult a doctor.`,
    };

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share(shareData);
      } catch (err) {
        // Ignore AbortError (user cancelled)
        if ((err as Error).name !== 'AbortError') {
             console.error('Error sharing:', err);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('Result copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleSaveToDashboard = () => {
    if (!imageResult || !onSaveScan) return;

    // Simple heuristic to determine risk from text
    const text = imageResult.toLowerCase();
    let severity: 'Low' | 'Medium' | 'High' = 'Low';
    let riskColor: 'emerald' | 'amber' | 'red' = 'emerald';
    let status = 'Normal Results';

    if (text.includes('high') || text.includes('positive') || text.includes('infection') || text.includes('seek medical')) {
      severity = 'High';
      riskColor = 'red';
      status = 'Action Recommended';
    } else if (text.includes('trace') || text.includes('monitor') || text.includes('unclear')) {
      severity = 'Medium';
      riskColor = 'amber';
      status = 'Monitor Closely';
    }

    const newScan: ScanResult = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      severity,
      status,
      riskColor,
      reviewStatus: 'Pending',
      details: imageResult.substring(0, 150) + (imageResult.length > 150 ? '...' : ''),
      imageUrl: selectedImage || undefined
    };

    onSaveScan(newScan);
  };

  // Helper logic to analyze the result text for UI presentation
  const getAnalysisSummary = (text: string) => {
    const lower = text.toLowerCase();
    const isPositive = lower.includes('positive') || lower.includes('high') || lower.includes('abnormal') || lower.includes('infection');
    const isTrace = lower.includes('trace') || lower.includes('monitor') || lower.includes('unclear');
    
    // Extract keywords found
    const tags = [];
    if (lower.includes('leukocytes')) tags.push('Leukocytes');
    if (lower.includes('nitrites')) tags.push('Nitrites');
    if (lower.includes('ph')) tags.push('pH');
    if (lower.includes('blood')) tags.push('Blood');
    if (lower.includes('protein')) tags.push('Protein');

    return {
      title: isPositive ? "Attention Required" : isTrace ? "Monitor Closely" : "Normal Parameters",
      colorClass: isPositive ? "bg-amber-500 text-white" : isTrace ? "bg-blue-500 text-white" : "bg-emerald-500 text-white",
      bgClass: isPositive ? "bg-amber-50 border-amber-100" : isTrace ? "bg-blue-50 border-blue-100" : "bg-emerald-50 border-emerald-100",
      textClass: isPositive ? "text-amber-700" : isTrace ? "text-blue-700" : "text-emerald-700",
      statusIcon: isPositive 
        ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        : isTrace 
          ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      tags
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-fadeIn">
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
        
        {/* Header with Tabs */}
        <div className="border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm">
          <div className="p-8 pb-6">
            <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">UTI Health Check</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium max-w-xl">
              Choose how you want to check your health status today. You can scan a test strip or answer a quick symptom questionnaire.
            </p>
          </div>
          
          <div className="flex px-8 gap-6">
            <button 
              onClick={() => setActiveTab('scan')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'scan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              📸 Strip Scanner
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              📝 Manual Questionnaire
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* --- TAB 1: SCANNER --- */}
          {activeTab === 'scan' && (
            <div className="animate-fadeIn space-y-8">
              <div className="group relative border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]">
                {selectedImage ? (
                  <div className="relative w-full max-w-sm mx-auto group-hover:scale-[1.02] transition-transform duration-300">
                    <img src={selectedImage} alt="Scan preview" className="rounded-xl shadow-lg w-full border border-slate-200" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-2 shadow-lg border border-slate-100 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                       <svg className="h-10 w-10 text-blue-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    
                    <h3 className="mt-2 text-sm font-bold text-slate-900 font-heading">Upload Strip Photo</h3>
                    <p className="mt-1 text-xs text-slate-500 font-medium">PNG, JPG up to 10MB</p>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={triggerCamera}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Open Camera
                      </button>
                      <label htmlFor="file-upload" className="inline-flex items-center px-6 py-2.5 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5">
                        <span>Select File</span>
                        <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" className="sr-only" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {selectedImage && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzingImage}
                    className={`w-full sm:w-auto min-w-[200px] flex justify-center py-4 px-8 border border-transparent rounded-xl shadow-lg text-base font-bold text-white transition-all transform hover:-translate-y-0.5 ${isAnalyzingImage ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'}`}
                  >
                    {isAnalyzingImage ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running AI Analysis...
                      </span>
                    ) : (
                      'Run Analysis'
                    )}
                  </button>
                </div>
              )}

              {imageResult && (() => {
                const summary = getAnalysisSummary(imageResult);
                return (
                  <div className="animate-slideUp mt-8 rounded-3xl overflow-hidden shadow-xl shadow-slate-200 border border-slate-200 bg-white">
                    {/* Dynamic Status Header */}
                    <div className={`${summary.colorClass} px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                       <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                           {summary.statusIcon}
                         </div>
                         <div>
                            <h3 className="font-heading text-xl font-bold tracking-tight">{summary.title}</h3>
                            <p className="text-white/80 text-sm font-medium mt-0.5">
                              Analyzed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                         </div>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {summary.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10 shadow-sm">
                              {tag} Checked
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="p-8">
                       <div className="flex flex-col lg:flex-row gap-8">
                          {/* Main Text Content */}
                          <div className="flex-1">
                             <h4 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                               <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                               Detailed Findings
                             </h4>
                             <div className={`prose prose-sm max-w-none p-6 rounded-2xl border ${summary.bgClass} ${summary.textClass} leading-relaxed font-medium whitespace-pre-wrap`}>
                               {imageResult}
                             </div>
                          </div>

                          {/* Sidebar Actions */}
                          <div className="w-full lg:w-72 space-y-4">
                             <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                               <h5 className="font-bold text-slate-900 text-sm mb-4">Recommended Actions</h5>
                               <div className="space-y-3">
                                 {onSaveScan && (
                                   <button 
                                     onClick={handleSaveToDashboard}
                                     className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                                   >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                      Save to Record
                                   </button>
                                 )}
                                 <button 
                                   onClick={() => handleShareResult(imageResult, 'UTI Scan Result')}
                                   disabled={isSharing}
                                   className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-bold py-3 px-4 rounded-xl transition-all"
                                 >
                                    {isSharing ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    )}
                                    Share with Doctor
                                 </button>
                               </div>
                             </div>
                             
                             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                               <div className="flex items-start gap-3">
                                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 </div>
                                 <p className="text-xs text-slate-500 leading-relaxed">
                                   Results are saved securely. You can review past scans in your dashboard at any time.
                                 </p>
                               </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-8 border-t border-slate-100 pt-6">
                         <DisclaimerBox />
                       </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* --- TAB 2: MANUAL QUESTIONNAIRE --- */}
          {activeTab === 'manual' && (
             <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Question 1 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Pain or burning when urinating?</label>
                      <InfoTooltip text="Pain or burning (dysuria) indicates inflammation of the urethra or bladder lining." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.pain === 'Yes'} 
                          onClick={() => handleSymptomChange('pain', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.pain === 'No'} 
                          onClick={() => handleSymptomChange('pain', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Urgency / Frequency?</label>
                      <InfoTooltip text="A persistent urge to urinate, often with small amounts, is a key UTI symptom." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.urgency === 'High'} 
                          onClick={() => handleSymptomChange('urgency', 'High')} 
                          label="High / Frequent" 
                        />
                       <OptionButton 
                          selected={symptoms.urgency === 'Normal'} 
                          onClick={() => handleSymptomChange('urgency', 'Normal')} 
                          label="Normal" 
                        />
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Urine Color</label>
                      <InfoTooltip text="Cloudy urine suggests bacteria/white blood cells. Pink suggests blood. Dark yellow suggests dehydration." />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Clear', 'Pale Yellow', 'Dark Yellow', 'Cloudy / Pink'].map((color) => (
                           <button 
                             key={color}
                             onClick={() => handleSymptomChange('color', color)}
                             className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                               symptoms.color === color 
                               ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500 font-bold' 
                               : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                             }`}
                           >
                             {color}
                           </button>
                        ))}
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Visible Blood?</label>
                      <InfoTooltip text="Visible blood (hematuria) can indicate a severe infection, stones, or other issues requiring medical care." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.visibleBlood === 'Yes'} 
                          onClick={() => handleSymptomChange('visibleBlood', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.visibleBlood === 'No'} 
                          onClick={() => handleSymptomChange('visibleBlood', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>

                  {/* Question 5 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Fever or Chills?</label>
                      <InfoTooltip text="Systemic signs like fever or chills may suggest the infection has spread to the kidneys." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.fever === 'Yes'} 
                          onClick={() => handleSymptomChange('fever', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.fever === 'No'} 
                          onClick={() => handleSymptomChange('fever', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>
                  
                  {/* Question 6 */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Lower Back or Side Pain?</label>
                      <InfoTooltip text="Pain in the flank (side/back) is a strong indicator of potential kidney involvement (pyelonephritis)." />
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:w-1/2">
                       <OptionButton 
                          selected={symptoms.backPain === 'Yes'} 
                          onClick={() => handleSymptomChange('backPain', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.backPain === 'No'} 
                          onClick={() => handleSymptomChange('backPain', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>

                  {/* Question 7: Nausea/Vomiting */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Nausea or Vomiting?</label>
                      <InfoTooltip text="Nausea can be a sign that the infection is affecting your kidneys." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.nausea === 'Yes'} 
                          onClick={() => handleSymptomChange('nausea', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.nausea === 'No'} 
                          onClick={() => handleSymptomChange('nausea', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>

                  {/* Question 8: Abdominal Pain */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Lower Abdominal Pain?</label>
                      <InfoTooltip text="Pain or pressure in the lower abdomen or pelvic area is common with bladder infections." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <OptionButton 
                          selected={symptoms.abdominalPain === 'Yes'} 
                          onClick={() => handleSymptomChange('abdominalPain', 'Yes')} 
                          label="Yes" 
                        />
                       <OptionButton 
                          selected={symptoms.abdominalPain === 'No'} 
                          onClick={() => handleSymptomChange('abdominalPain', 'No')} 
                          label="No" 
                        />
                    </div>
                  </div>

                  {/* Question 9: Smell */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Urine Odor?</label>
                      <InfoTooltip text="A strong, foul, or fishy smell can indicate the presence of bacteria." />
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:w-1/2">
                       <OptionButton 
                          selected={symptoms.smell === 'Strong / Foul'} 
                          onClick={() => handleSymptomChange('smell', 'Strong / Foul')} 
                          label="Strong / Foul" 
                        />
                       <OptionButton 
                          selected={symptoms.smell === 'Normal'} 
                          onClick={() => handleSymptomChange('smell', 'Normal')} 
                          label="Normal" 
                        />
                    </div>
                  </div>

                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleAnalyzeSymptoms}
                    disabled={isAnalyzingSymptoms}
                    className={`w-full sm:w-auto min-w-[240px] flex justify-center py-4 px-8 border border-transparent rounded-xl shadow-lg text-base font-bold text-white transition-all transform hover:-translate-y-0.5 ${isAnalyzingSymptoms ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'}`}
                  >
                    {isAnalyzingSymptoms ? (
                      <span className="flex items-center gap-3">
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Analyzing Symptoms...
                      </span>
                    ) : (
                      'Analyze Symptoms'
                    )}
                  </button>
                </div>

                {symptomResult && (
                <div className="animate-fadeIn mt-10 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                  <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                     <h3 className="font-heading text-xl font-bold text-slate-900">Health Assessment Results</h3>
                     <button 
                       onClick={() => handleShareResult(
                         `Risk Level: ${symptomResult.riskLevel}\nScore: ${symptomResult.riskScore}%\nAnalysis: ${symptomResult.analysis}`, 
                         'Symptom Assessment'
                       )}
                       disabled={isSharing}
                       className={`flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                       title="Share Result"
                     >
                       {isSharing ? (
                         <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                       ) : (
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                       )}
                       Share
                     </button>
                  </div>

                  <div className="p-8">
                    {/* Top Section: Score and Summary */}
                    <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                       {/* Circular Score Gauge */}
                       <div className="relative w-40 h-40 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                            <circle 
                              cx="80" cy="80" r="70" 
                              stroke={symptomResult.riskLevel === 'High' ? '#ef4444' : symptomResult.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'} 
                              strokeWidth="12" 
                              fill="transparent" 
                              strokeDasharray={440} 
                              strokeDashoffset={440 - (440 * symptomResult.riskScore) / 100}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="font-heading text-4xl font-extrabold text-slate-900">{symptomResult.riskScore}%</span>
                             <span className={`text-xs font-bold uppercase tracking-wide mt-1 ${
                               symptomResult.riskLevel === 'High' ? 'text-red-500' : symptomResult.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                             }`}>{symptomResult.riskLevel} Risk</span>
                          </div>
                       </div>
                       
                       {/* Text Summary */}
                       <div className="flex-1">
                          <h4 className="font-heading font-bold text-lg mb-2 text-slate-800">AI Analysis</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-4">{symptomResult.analysis}</p>
                          <div className="flex flex-wrap gap-2">
                             {symptomResult.riskLevel === 'High' && (
                               <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1">
                                 ⚠️ Urgent Attention
                               </span>
                             )}
                             {symptomResult.riskLevel === 'Medium' && (
                               <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                                 ⚠️ Monitor Closely
                               </span>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Contributing Factors Bars */}
                    <div className="mb-8">
                       <h4 className="font-heading font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Contributing Factors</h4>
                       <div className="space-y-4">
                          {symptomResult.contributingFactors.map((factor, idx) => (
                            <div key={idx}>
                               <div className="flex justify-between text-sm font-semibold mb-1">
                                  <span className="text-slate-700">{factor.name}</span>
                                  <span className="text-slate-400 font-bold">{factor.impact}% Impact</span>
                                </div>
                               <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      factor.impact > 70 ? 'bg-red-500' : factor.impact > 40 ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} 
                                    style={{ width: `${factor.impact}%` }}
                                  ></div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Action Plan */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                       <h4 className="font-heading font-bold text-blue-900 mb-4 flex items-center gap-2">
                         <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                         Recommended Action Plan
                       </h4>
                       <ul className="space-y-3">
                         {symptomResult.recommendations.map((rec, idx) => (
                           <li key={idx} className="flex items-start gap-3 text-sm text-blue-900 font-medium">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">{idx + 1}</div>
                              <span className="leading-snug">{rec}</span>
                           </li>
                         ))}
                       </ul>
                    </div>

                    <DisclaimerBox />
                  </div>
                </div>
              )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};