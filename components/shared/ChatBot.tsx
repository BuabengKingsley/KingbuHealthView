import React, { useState, useRef, useEffect } from 'react';
import { generateHealthResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';

// Helper to clean markdown asterisks from text
const cleanText = (text: string) => {
  return text.replace(/\*/g, '');
};

// Helper component to simulate typing effect
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const speed = 15; // Typing speed in ms
    
    // Clear text initially to ensure clean start
    setDisplayedText('');

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return <div className="whitespace-pre-wrap markdown-content">{displayedText}</div>;
};

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am the KingbuHealthView assistant. I can answer questions about symptoms, hydration, or general wellness. How can I help you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateHealthResponse(input, messages);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden my-6 border border-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg shadow-md ring-2 ring-white">
             ✨
           </div>
           <div>
             <h3 className="font-heading font-bold text-slate-900">AI Health Assistant</h3>
             <p className="text-xs text-green-600 font-bold flex items-center gap-1.5 uppercase tracking-wide">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
             </p>
           </div>
        </div>
        <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full border border-slate-200">Gemini 2.0</span>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.map((msg, idx) => {
          // Check if this is the latest message and it's from the model to apply typewriter effect
          const isLatestModelMessage = idx === messages.length - 1 && msg.role === 'model';
          const textToDisplay = cleanText(msg.text);
          
          return (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
              
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm mr-3 shadow-sm flex-shrink-0 self-end mb-1">✨</div>
              )}

              <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-slate-200/50'
              }`}>
                {/* Apply Typewriter effect only to the newest AI message */}
                {isLatestModelMessage ? (
                  <TypewriterText text={textToDisplay} />
                ) : (
                  <div className="whitespace-pre-wrap markdown-content">{textToDisplay}</div>
                )}
                
                <div className={`text-[10px] mt-2 text-right font-medium opacity-80 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 ml-3 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600 self-end mb-1 border border-white shadow-sm">You</div>
              )}
            </div>
          );
        })}
        
        {/* Loading Indicator - Typing Bubble */}
        {isLoading && (
          <div className="flex justify-start items-end animate-slideUp">
             <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm mr-3 shadow-sm flex-shrink-0 self-end mb-1">✨</div>
            <div className="bg-white rounded-2xl rounded-bl-none px-5 py-4 shadow-sm border border-slate-200">
              <div className="flex space-x-1.5 items-center h-full">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner text-sm font-medium"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">AI can make mistakes. Please consult a doctor for medical advice.</p>
      </div>
    </div>
  );
};