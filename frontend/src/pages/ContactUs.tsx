import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Heart, MessageCircle, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';

export default function ContactUs() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Check if EmailJS environment variables are configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please set up environment variables.');
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        to_email: 'support@mindbuddy.com', // You can change this to your actual email
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (result.status === 200) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: 'general',
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to send message. Please try again or contact us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <Header />
      <div className="h-20" />

      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-200/20'}`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-200/14'}`}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? '' : 'text-slate-900'}`}>
            Get In <span className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Touch</span>
          </h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg max-w-2xl mx-auto`}>
            Have questions or need support? We're here to help you on your mental wellness journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/** contact cards **/}
          {[
            {
              icon: Mail,
              title: 'Email Us',
              desc: 'Get a response within 24 hours',
              action: <a href="mailto:support@mindbuddy.com" className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>support@mindbuddy.com</a>,
            },
            {
              icon: Phone,
              title: 'Call Us',
              desc: 'Mon-Fri from 8am to 8pm',
              action: <a href="tel:+1234567890" className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>+1 (234) 567-890</a>,
            },
            {
              icon: MessageCircle,
              title: 'Live Chat',
              desc: 'Available 24/7 for urgent support',
              action: <button className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>Start Chat →</button>,
            },
          ].map((c) => (
            <div key={c.title} className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white/60 border-slate-200 text-slate-900'} backdrop-blur-sm border rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-3`}>{c.desc}</p>
              {c.action}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white/60 border-slate-200 text-slate-900'} backdrop-blur-sm border rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 text-sm">{submitError}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        You can also email us directly at{' '}
                        <a href="mailto:support@mindbuddy.com" className="text-cyan-400 hover:text-cyan-300">
                          support@mindbuddy.com
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? '' : 'text-slate-700'}`}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${isDark ? 'bg-slate-900 border border-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? '' : 'text-slate-700'}`}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${isDark ? 'bg-slate-900 border border-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? '' : 'text-slate-700'}`}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${isDark ? 'bg-slate-900 border border-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="counseling">Counseling Services</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? '' : 'text-slate-700'}`}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${isDark ? 'bg-slate-900 border border-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? '' : 'text-slate-700'}`}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors resize-none ${isDark ? 'bg-slate-900 border border-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
                </form>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white/60 border-slate-200 text-slate-900'} backdrop-blur-sm border rounded-xl p-8`}>
              <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>8:00 AM - 8:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Saturday</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>10:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Sunday</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white/60 border-slate-200 text-slate-900'} backdrop-blur-sm border rounded-xl p-8`}>
              <h3 className="text-xl font-semibold mb-4">Emergency Support</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                If you're experiencing a mental health crisis, please reach out immediately:
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Crisis Hotline:</span>{' '}
                  <a href="tel:988" className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>
                    988
                  </a>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Emergency:</span>{' '}
                  <a href="tel:911" className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>
                    911
                  </a>
                </p>
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white/60 border-slate-200 text-slate-900'} backdrop-blur-sm border rounded-xl p-8`}>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-900'}`}>MindBuddy Headquarters</p>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                    123 Wellness Street
                    <br />
                    San Francisco, CA 94102
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
