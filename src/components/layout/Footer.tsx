import React from 'react';
import { Sparkles, Shield, Heart, Zap, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Banner: Local Security Commitment */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Client-Side Privacy</h4>
                <p className="text-xs text-slate-400">PDFs and images never leave your browser memory.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Zero Server Latency</h4>
                <p className="text-xs text-slate-400">Processing happens locally using modern WebAssembly.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Always Free & No Signup</h4>
                <p className="text-xs text-slate-400">Unlimited access with no paywalls or watermarks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ToolNova</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
              ToolNova is an all-in-one suite of modern, secure, and fast browser utilities. Designed for professionals, students, freelancers, and businesses who prioritize data privacy and instant execution.
            </p>
            <div className="text-xs text-slate-500">
              <span className="inline-block py-1 px-2.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                Version 2.4 &bull; Production Ready
              </span>
            </div>
          </div>

          {/* PDF Tools Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">PDF Tools</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('/tools/jpg-to-pdf')} className="hover:text-blue-400 transition-colors">JPG to PDF</button></li>
              <li><button onClick={() => onNavigate('/tools/pdf-merger')} className="hover:text-blue-400 transition-colors">PDF Merger</button></li>
              <li><button onClick={() => onNavigate('/tools/pdf-splitter')} className="hover:text-blue-400 transition-colors">PDF Splitter</button></li>
              <li><button onClick={() => onNavigate('/tools/pdf-compressor')} className="hover:text-blue-400 transition-colors">PDF Compressor</button></li>
              <li><button onClick={() => onNavigate('/tools/pdf-organizer')} className="hover:text-blue-400 transition-colors">Page Organizer</button></li>
            </ul>
          </div>

          {/* Image & Calculators Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Image & Calcs</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('/tools/image-compressor')} className="hover:text-blue-400 transition-colors">Image Compressor</button></li>
              <li><button onClick={() => onNavigate('/tools/passport-photo-maker')} className="hover:text-blue-400 transition-colors">Passport Photo Maker</button></li>
              <li><button onClick={() => onNavigate('/tools/signature-resizer')} className="hover:text-blue-400 transition-colors">Signature Resizer</button></li>
              <li><button onClick={() => onNavigate('/tools/gst-calculator')} className="hover:text-blue-400 transition-colors">GST Calculator (India)</button></li>
              <li><button onClick={() => onNavigate('/tools/emi-calculator')} className="hover:text-blue-400 transition-colors">EMI Calculator</button></li>
              <li><button onClick={() => onNavigate('/tools/age-calculator')} className="hover:text-blue-400 transition-colors">Age Calculator</button></li>
            </ul>
          </div>

          {/* Important Pages & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Legal & Company</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('/contact')} className="hover:text-blue-400 transition-colors">Contact & Support</button></li>
              <li><button onClick={() => onNavigate('/faq')} className="hover:text-blue-400 transition-colors">FAQ</button></li>
              <li><button onClick={() => onNavigate('/blog')} className="hover:text-blue-400 transition-colors">Guides & Blog</button></li>
              <li><button onClick={() => onNavigate('/privacy-policy')} className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/terms')} className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('/disclaimer')} className="hover:text-blue-400 transition-colors">Disclaimer</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ToolNova. All rights reserved. Free Online Tools. Fast, Simple & Secure.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for privacy and performance</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
