
import React from 'react';
import { Zap, Search, ShieldCheck, BarChart2, Globe, Smartphone, Code2, Layers, ArrowRight } from 'lucide-react';

export const FeaturesPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-indigo-500" />,
      title: "Technical SEO Audits",
      description: "Crawl your website like Google bots do. Identify broken links, missing meta tags, slow load times, and core web vital issues instantly."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-fuchsia-500" />,
      title: "Competitor Intelligence",
      description: "Reverse engineer your competitors' success. See their traffic sources, top keywords, backlink profiles, and content gaps."
    },
    {
      icon: <Code2 className="w-6 h-6 text-amber-500" />,
      title: "AI Code Fixes",
      description: "Don't just find errors—fix them. Our Gemini 2.5 engine generates copy-paste HTML, CSS, and JS snippets to resolve issues."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-500" />,
      title: "Mobile & ASO",
      description: "Optimize for the small screen. Comprehensive analysis for Mobile Web performance and App Store Optimization (iOS & Android)."
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "Global SEO",
      description: "Target audiences worldwide with geo-specific analysis. We support multi-language audits and region-specific search intent."
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      title: "Traffic Forecasting",
      description: "Predict your growth. Our predictive models estimate traffic increases based on the implementation of recommended fixes."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
           <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
             The Complete <span className="text-indigo-600 dark:text-indigo-400">Intelligence Suite</span>
           </h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
             Everything you need to rank higher, grow faster, and outsmart the competition. All in one platform.
           </p>
           <button onClick={onStart} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all shadow-xl">
             Start Your Audit Now
           </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Section */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Integrates with your workflow
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Connect AuditPro with the tools you already use. Export reports to PDF, sync tasks with Jira, or pull data directly from Google Search Console.
              </p>
              <ul className="space-y-4">
                {['Google Analytics 4', 'Google Search Console', 'Slack Notifications', 'Jira & Trello'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-2xl opacity-20 rounded-2xl"></div>
               <div className="relative bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                     <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                     <div>
                       <div className="font-bold text-slate-900 dark:text-white">Jira Integration</div>
                       <div className="text-xs text-slate-500">Task Created #SEO-2491</div>
                     </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">View Ticket</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
