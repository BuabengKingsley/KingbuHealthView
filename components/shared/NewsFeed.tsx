import React from 'react';
import { summarizeHealthArticle } from '../../services/geminiService';
import { HealthArticle } from '../../types';

const MOCK_ARTICLES: HealthArticle[] = [
  {
    id: '1',
    title: 'Understanding UTI Prevention and Care',
    summary: 'Urinary Tract Infections (UTIs) are common infections that happen when bacteria, often from the skin or rectum, enter the urethra, and infect the urinary tract. Key prevention strategies include staying hydrated, wiping front to back, and urinating after sexual activity.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
    category: 'Prevention'
  },
  {
    id: '2',
    title: 'The Importance of Hydration',
    summary: 'Drinking enough water each day is crucial for many reasons: to regulate body temperature, keep joints lubricated, prevent infections, deliver nutrients to cells, and keep organs functioning properly. Experts recommend about 11-15 cups of fluids a day depending on activity level.',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1888',
    category: 'Wellness'
  },
  {
    id: '3',
    title: 'New Advances in Telemedicine',
    summary: 'Telemedicine allows health care professionals to evaluate, diagnose and treat patients at a distance using telecommunications technology. This approach has revolutionized accessibility, especially for rural communities and those with mobility issues.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-21733e99db29?auto=format&fit=crop&q=80&w=2070',
    category: 'Technology'
  },
  {
    id: '4',
    title: 'Top 10 Superfoods for Immunity',
    summary: 'Boosting your immune system can be as tasty as it is healthy. Citrus fruits, red bell peppers, broccoli, garlic, ginger, spinach, yogurt, almonds, sunflower seeds, and turmeric are all packed with essential vitamins and antioxidants.',
    imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=2070',
    category: 'Nutrition'
  },
  {
    id: '5',
    title: 'The Science of Good Sleep',
    summary: 'Sleep plays a vital role in good health and well-being throughout your life. Getting enough quality sleep at the right times can help protect your mental health, physical health, quality of life, and safety. Most adults need 7-9 hours of sleep per night.',
    imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80&w=2071',
    category: 'Lifestyle'
  },
  {
    id: '6',
    title: 'Managing Stress in the Digital Age',
    summary: 'Constant connectivity can increase stress levels. Digital detoxes, mindfulness meditation, and setting boundaries with technology are essential strategies for maintaining mental health in our modern, always-on world.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1999',
    category: 'Mental Health'
  },
  {
    id: '7',
    title: 'Cardio vs. Strength Training',
    summary: 'Both forms of exercise are crucial for a balanced routine. Cardio improves heart health and burns calories, while strength training builds muscle mass and bone density. The best approach often combines both.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070',
    category: 'Fitness'
  },
  {
    id: '8',
    title: 'Gut Health and Mental Wellbeing',
    summary: 'Emerging research suggests a strong link between gut health and mood. A healthy microbiome can influence neurotransmitter production like serotonin. Probiotics and fiber-rich foods are key to maintaining this balance.',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2070',
    category: 'Nutrition'
  },
  {
    id: '9',
    title: 'Benefits of Morning Sunlight',
    summary: 'Exposure to sunlight early in the day helps regulate your circadian rhythm, leading to better sleep at night. It also boosts Vitamin D production, which is essential for bone health and immune function.',
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=2070',
    category: 'Wellness'
  },
  {
    id: '10',
    title: 'Sitting is the New Smoking?',
    summary: 'Prolonged sitting has been linked to increased risk of heart disease, diabetes, and early death. Incorporating standing desks, walking meetings, and regular stretch breaks can mitigate these risks.',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=2070',
    category: 'Lifestyle'
  },
  {
    id: '11',
    title: 'Mindfulness for Chronic Pain',
    summary: 'Mindfulness-Based Stress Reduction (MBSR) techniques have shown promise in helping patients manage chronic pain by changing how the brain perceives pain signals and reducing associated stress.',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=2070',
    category: 'Therapy'
  },
  {
    id: '12',
    title: 'Understanding Antibiotic Resistance',
    summary: 'Overuse of antibiotics leads to resistant bacteria, making common infections harder to treat. Always finish your prescribed course and never take antibiotics for viral infections like the cold or flu.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=2030',
    category: 'Medical'
  },
  {
    id: '13',
    title: 'The Power of Plant-Based Diets',
    summary: 'Plant-based diets are associated with lower risks of heart disease, hypertension, and diabetes. You don\'t have to go full vegan; even "Meatless Mondays" can have a positive impact on your health.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2070',
    category: 'Nutrition'
  },
  {
    id: '14',
    title: 'Digital Eye Strain Relief',
    summary: 'Staring at screens all day can cause dry eyes and headaches. Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for at least 20 seconds to rest your eyes.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070',
    category: 'Technology'
  },
  {
    id: '15',
    title: 'Yoga for Flexibility and Balance',
    summary: 'Yoga isn\'t just about flexibility; it improves balance, strength, and mental focus. Regular practice can reduce the risk of falls in older adults and improve athletic performance in younger ones.',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=2070',
    category: 'Fitness'
  },
  {
    id: '16',
    title: 'Heart Health: Beyond Cholesterol',
    summary: 'While cholesterol matters, factors like inflammation, blood pressure, and blood sugar are equally important. A holistic approach to heart health involves stress management, diet, and regular activity.',
    imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=2070',
    category: 'Prevention'
  },
  {
    id: '17',
    title: 'The Impact of Social Connections',
    summary: 'Strong social ties are linked to a longer life, improved immune system, and better mental health. Loneliness can be as damaging to health as smoking 15 cigarettes a day.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2070',
    category: 'Mental Health'
  },
  {
    id: '18',
    title: 'Seasonal Allergies: Coping Strategies',
    summary: 'As seasons change, pollen counts rise. Managing allergies involves tracking local pollen forecasts, keeping windows closed on high-count days, and using HEPA air purifiers indoors.',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1970',
    category: 'Environment'
  },
  {
    id: '19',
    title: 'Meal Prepping for Success',
    summary: 'Preparing meals in advance saves time, money, and ensures you stick to your nutritional goals. Start small by prepping just lunches for the week to avoid takeout temptation.',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=2070',
    category: 'Nutrition'
  },
  {
    id: '20',
    title: 'Wearable Tech: Making Sense of Data',
    summary: 'Smartwatches track steps, heart rate, and sleep. The key is using this data to spot trends over time rather than obsessing over daily numbers. Consistency is more important than perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=2070',
    category: 'Technology'
  }
];

export const NewsFeed: React.FC = () => {
  const [summaries, setSummaries] = React.useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleSummarize = async (article: HealthArticle) => {
    setLoadingId(article.id);
    const summary = await summarizeHealthArticle(article.summary + " [Full article content simulated]");
    setSummaries(prev => ({ ...prev, [article.id]: summary }));
    setLoadingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <h2 className="font-heading text-3xl font-bold text-slate-900 mb-8 tracking-tight border-l-4 border-blue-600 pl-4">Latest Health Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_ARTICLES.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-56 w-full overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60"></div>
               <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute top-4 left-4 z-20">
                 <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-800 rounded-full uppercase tracking-wide">{article.category}</span>
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{article.title}</h3>
              <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">{article.summary}</p>
              
              {summaries[article.id] ? (
                <div className="bg-blue-50 p-5 rounded-xl mb-4 text-sm border border-blue-100 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">✨</div>
                    <strong className="text-blue-900 font-bold">AI Summary</strong>
                  </div>
                  <div className="prose prose-sm prose-blue text-slate-700">
                     {summaries[article.id]}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleSummarize(article)}
                  disabled={loadingId === article.id}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700"
                >
                  {loadingId === article.id ? (
                    <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                       Summarizing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Summarize with AI
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};