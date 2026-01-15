import React, { useState } from 'react';
import { Card, CardHeader } from './Card';

export const ContactFooter: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Create mailto link with the feedback
    const subject = encodeURIComponent(`BTC Metrics Hub Feedback from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:such4283@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message and reset form
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 500);
  };

  return (
    <footer className="mt-12 pb-8">
      <div className="max-w-4xl mx-auto">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="mx-auto flex items-center gap-2 px-6 py-3 text-sm font-medium text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-lg">
              mail
            </span>
            Contact Us
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              expand_more
            </span>
          </button>
        ) : (
          <Card>
            <CardHeader 
              title="Contact & Support" 
              subtitle="Have feedback or questions? We'd love to hear from you!"
              action={
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              }
            />
            <div className="p-6">
              {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    check_circle
                  </span>
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    Your email client has been opened. Thank you for your feedback!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a3441] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a3441] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a3441] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                    placeholder="Share your feedback, questions, or suggestions..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    We'll respond to <span className="text-primary font-medium">such4283@gmail.com</span>
                  </p>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          refresh
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">
                          send
                        </span>
                        Send Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#3b4754]">
                <div className="flex items-center justify-center text-xs text-text-secondary">
                  <p>© 2026 BTC Metrics Hub</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </footer>
  );
};
