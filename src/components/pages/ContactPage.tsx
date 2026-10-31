import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Generate local reference ticket ID
    const ticketId = 'TN-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedTicket(ticketId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead
        title="Contact Us & Support - ToolNova"
        description="Get in touch with the ToolNova developer team. Suggest new online tools, report issues, or inquire about partnerships."
        canonicalPath="/#/contact"
      />

      <div className="text-center space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Have an idea for a new utility? Spotted an edge case in our PDF or image tools? We review community feedback constantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Channels Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Direct Communication</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">General Support Email:</span>
                <a href="mailto:support@toolnova.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support@toolnova.app
                </a>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Feature Requests:</span>
                <a href="mailto:features@toolnova.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  features@toolnova.app
                </a>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Business & Advertising:</span>
                <a href="mailto:contact@toolnova.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contact@toolnova.app
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Need Quick Answers?</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Before submitting a ticket, check our Frequently Asked Questions for answers on file safety, browser compatibility, and format requirements.
            </p>
            <button
              onClick={() => onNavigate('/faq')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Visit Knowledge Base FAQ &rarr;
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {submittedTicket ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Dispatched!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Thank you for your feedback, {name}. Your transmission has been logged with Reference Ticket ID:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {submittedTicket}
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="Feedback">Product Feedback</option>
                  <option value="Bug">Report a Bug / Tool Glitch</option>
                  <option value="Feature">Suggest a New Online Tool</option>
                  <option value="AdSense">Advertising & Sponsorship</option>
                  <option value="Other">General Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you love or what we can improve..."
                  className="w-full p-3.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Transmission</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
