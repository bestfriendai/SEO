
import React, { useEffect, useState } from 'react';
import { Sun, Moon, Command, Menu, X } from 'lucide-react';

type View = 'HOME' | 'FEATURES' | 'PRICING' | 'ENTERPRISE' | 'DASHBOARD';

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
    setView: (view: View) => void;
    currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, setView, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = (view: View, mobile = false) => `
    text-sm font-medium transition-colors duration-200
    ${mobile ? 'block w-full text-left py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800' : ''}
    ${currentView === view 
      ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}
  `;

  const handleNavClick = (view: View) => {
      setView(view);
      setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled || isMenuOpen
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-3 shadow-lg shadow-indigo-500/5' 
        : 'bg-white/0 dark:bg-slate-900/0 border-transparent py-5'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div onClick={() => handleNavClick('HOME')} className="flex items-center gap-3 group cursor-pointer z-50 relative">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 p-2 rounded-lg relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                    <Command className="w-5 h-5" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                    Audit<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-1">
                    Enterprise Intelligence
                </span>
            </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
                <button onClick={() => handleNavClick('FEATURES')} className={navClasses('FEATURES')}>
                    Features
                </button>
                <button onClick={() => handleNavClick('PRICING')} className={navClasses('PRICING')}>
                    Pricing
                </button>
                <button onClick={() => handleNavClick('ENTERPRISE')} className={navClasses('ENTERPRISE')}>
                    Enterprise
                </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-3">
                    <button onClick={() => handleNavClick('HOME')} className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Log in
                    </button>
                    <button onClick={() => handleNavClick('HOME')} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        Get Started
                    </button>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
                 <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top-5 duration-300 z-40">
                <div className="flex flex-col p-6 space-y-2">
                    <button onClick={() => handleNavClick('FEATURES')} className={navClasses('FEATURES', true)}>
                        Features
                    </button>
                    <button onClick={() => handleNavClick('PRICING')} className={navClasses('PRICING', true)}>
                        Pricing
                    </button>
                    <button onClick={() => handleNavClick('ENTERPRISE')} className={navClasses('ENTERPRISE', true)}>
                        Enterprise
                    </button>
                    
                    <div className="my-4 h-px bg-slate-100 dark:bg-slate-800"></div>
                    
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleNavClick('HOME')} className="w-full py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Log in
                        </button>
                        <button onClick={() => handleNavClick('HOME')} className="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};
