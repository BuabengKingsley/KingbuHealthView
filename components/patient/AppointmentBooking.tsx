import React, { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: string[];
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Amina Okeke',
    specialty: 'General Practitioner',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    availability: ['09:00 AM', '10:00 AM', '02:00 PM', '03:30 PM']
  },
  {
    id: '2',
    name: 'Dr. Kwame Osei',
    specialty: 'Urologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
    availability: ['11:00 AM', '01:00 PM', '04:00 PM']
  },
  {
    id: '3',
    name: 'Dr. Nia Mbeki',
    specialty: 'Nephrologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
    availability: ['08:30 AM', '12:00 PM', '02:30 PM']
  }
];

interface AppointmentBookingProps {
  onNavigate: (view: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Calendar & Time State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDoctorData = MOCK_DOCTORS.find(d => d.id === selectedDoctor);

  // Calendar Helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Mock availability logic: Weekdays (Mon-Fri) have slots, weekends might not
  const hasAvailability = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Closed on weekends for this demo
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isPast(newDate) || !hasAvailability(newDate)) return;
    
    setSelectedDate(newDate);
    setSelectedTime(null); // Reset time when date changes
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleBook = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Appointment Confirmed!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Your appointment with <span className="font-bold text-slate-800">{selectedDoctorData?.name}</span> has been scheduled for <span className="font-bold text-slate-800">{selectedDate ? formatDate(selectedDate) : ''} at {selectedTime}</span>.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Book an Appointment</h1>
        <p className="text-slate-500 mt-2">Schedule a consultation with our available specialists.</p>
      </div>

      <div className="flex gap-8 lg:gap-12 flex-col lg:flex-row">
        {/* Main Form Area */}
        <div className="flex-1 space-y-8">
          
          {/* Step 1: Doctor Selection */}
          <section className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
             <div className="flex items-center gap-3 mb-4">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>1</div>
               <h3 className="font-heading font-bold text-lg text-slate-900">Select a Doctor</h3>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {MOCK_DOCTORS.map(doctor => (
                 <div 
                   key={doctor.id}
                   onClick={() => { setSelectedDoctor(doctor.id); setStep(2); }}
                   className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedDoctor === doctor.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                 >
                   <div className="flex items-center gap-4">
                     <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                     <div>
                       <h4 className="font-bold text-slate-900">{doctor.name}</h4>
                       <p className="text-xs text-slate-500 font-medium">{doctor.specialty}</p>
                       <div className="flex items-center gap-1 mt-1.5">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                         <span className="text-[10px] font-bold text-emerald-600 uppercase">Available</span>
                       </div>
                     </div>
                   </div>
                   {selectedDoctor === doctor.id && (
                     <div className="absolute top-4 right-4 text-blue-600">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </section>

          {/* Step 2: Date & Time - CALENDAR UI */}
          {selectedDoctor && (
            <section className="animate-slideUp">
               <div className="flex items-center gap-3 mb-4 mt-8">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>2</div>
                 <h3 className="font-heading font-bold text-lg text-slate-900">Choose Date & Time</h3>
               </div>
               
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 
                 {/* Calendar Header */}
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="font-heading font-bold text-xl text-slate-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                 </div>

                 {/* Calendar Grid */}
                 <div className="mb-6">
                   <div className="grid grid-cols-7 mb-2">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                       <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wide py-2">{day}</div>
                     ))}
                   </div>
                   <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {/* Empty slots for previous month */}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                      ))}

                      {/* Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                        const isCurrentDay = isToday(dateObj);
                        const disabled = isPast(dateObj);
                        const available = hasAvailability(dateObj);

                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={disabled || !available}
                            className={`
                              aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold relative transition-all duration-200
                              ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105 z-10' : ''}
                              ${!isSelected && !disabled && available ? 'hover:bg-blue-50 hover:text-blue-600 cursor-pointer bg-white border border-slate-100' : ''}
                              ${disabled ? 'text-slate-300 cursor-not-allowed bg-slate-50/50' : ''}
                              ${!disabled && !available ? 'text-slate-300 cursor-not-allowed bg-slate-50/50' : ''}
                              ${isCurrentDay && !isSelected ? 'text-blue-600 ring-1 ring-blue-600' : ''}
                            `}
                          >
                            <span>{day}</span>
                            {!disabled && available && !isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-2"></span>
                            )}
                          </button>
                        );
                      })}
                   </div>
                 </div>

                 {/* Time Slots (Only show if date selected) */}
                 {selectedDate && (
                    <div className="animate-fadeIn pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Available Times for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {MOCK_DOCTORS.find(d => d.id === selectedDoctor)?.availability.map((time) => (
                            <button
                              key={time}
                              onClick={() => { setSelectedTime(time); setStep(3); }}
                              className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${selectedTime === time ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
                            >
                              {time}
                            </button>
                          ))}
                      </div>
                    </div>
                 )}
               </div>
            </section>
          )}

          {/* Step 3: Reason */}
          {selectedTime && (
            <section className="animate-slideUp">
               <div className="flex items-center gap-3 mb-4 mt-8">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>3</div>
                 <h3 className="font-heading font-bold text-lg text-slate-900">Reason for Visit</h3>
               </div>
               
               <textarea
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 placeholder="Briefly describe your symptoms or reason for booking..."
                 className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[120px]"
               />

               <div className="mt-8 flex justify-end">
                 <button
                   onClick={() => setShowConfirmModal(true)}
                   disabled={!reason || isSubmitting}
                   className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   Review Booking
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
               </div>
            </section>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sticky top-24">
            <h3 className="font-heading font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Booking Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase">Doctor</span>
                <span className="text-sm font-semibold text-slate-800 text-right">{selectedDoctorData?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase">Date</span>
                <span className="text-sm font-semibold text-slate-800 text-right">
                  {selectedDate ? formatDate(selectedDate) : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase">Time</span>
                <span className="text-sm font-semibold text-slate-800 text-right">{selectedTime || '--:--'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase">Consultation Fee</span>
                <span className="text-sm font-semibold text-emerald-600 text-right">$120.00</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xs text-blue-800 leading-snug">Video consultation link will be sent to your email upon confirmation.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-heading text-xl font-bold text-slate-900">Confirm Appointment</h3>
                    <p className="text-sm text-slate-500 mt-1">Please review the details below.</p>
                </div>
                <div className="p-6 space-y-4">
                    {/* Details Summary */}
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <img src={selectedDoctorData?.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                         <div>
                             <p className="text-sm font-bold text-slate-900">{selectedDoctorData?.name}</p>
                             <p className="text-xs text-slate-500">{selectedDoctorData?.specialty}</p>
                         </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Date</span>
                            <span className="font-bold text-slate-900">{selectedDate ? formatDate(selectedDate) : ''}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Time</span>
                            <span className="font-bold text-slate-900">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Consultation Fee</span>
                            <span className="font-bold text-emerald-600">$120.00</span>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reason</span>
                        <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">"{reason}"</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                        onClick={() => setShowConfirmModal(false)}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleBook}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing...
                          </>
                        ) : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};