
import React from 'react';
import { Shield, Lock, Globe, Server, Users, Phone, CheckCircle2 } from 'lucide-react';

export const EnterprisePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                AuditPro Enterprise
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              SEO Intelligence at <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Global Scale</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              Secure, scalable, and customizable SEO infrastructure for the world's largest organizations. API access, SSO, and dedicated support included.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                Contact Sales
              </button>
              <button className="px-8 py-4 bg-transparent border border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 -mt-16 relative z-20 container mx-auto rounded-t-3xl shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-slate-800">
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">99.9%</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-widest">Uptime SLA</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">500M+</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-widest">Pages Crawled</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">24/7</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-widest">Priority Support</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">ISO</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-widest">27001 Certified</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
             <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Server className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Robust API Access</h3>
             <p className="text-slate-600 dark:text-slate-400">
               Integrate our auditing engine directly into your CMS or internal tools. Full documentation and SDKs provided.
             </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
               <Lock className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Security</h3>
             <p className="text-slate-600 dark:text-slate-400">
               SSO (SAML/Okta), Role-Based Access Control (RBAC), and audit logs to keep your data secure.
             </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
               <Users className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dedicated Success Team</h3>
             <p className="text-slate-600 dark:text-slate-400">
               Get a dedicated account manager and SEO strategists to help you interpret data and implement fixes.
             </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-slate-100 dark:bg-slate-900/50 py-24">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Let's talk business</h2>
             <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                   <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                     Request Demo
                   </button>
                </div>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
};
