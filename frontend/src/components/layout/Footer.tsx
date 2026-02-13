import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Shield,
  Lock,
  Users,
  MessageCircle,
  Calendar,
  BookOpen,
  Globe,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'AI Chat Support', href: '/app/chat', icon: MessageCircle },
      { name: 'Book Session', href: '/app/booking', icon: Calendar },
      { name: 'Resources', href: '/app/resources', icon: BookOpen },
      { name: 'Community Forum', href: '/app/forum', icon: Users },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Crisis Support', href: '/crisis' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Report Issue', href: '/report' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/mindbuddy', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com/mindbuddy', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com/mindbuddy', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/mindbuddy', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/mindbuddy', icon: Youtube },
  ];

  return (
    <footer className="bg-background border-t border-border/40 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 gentle-transition">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <span className="font-bold text-2xl text-primary">MindBuddy</span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Supporting students' mental health with AI-powered assistance, professional
              counseling, and a safe community environment.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary gentle-transition group"
                  >
                    <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary gentle-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary gentle-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Information */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:support@mindbuddy.com"
                  className="hover:text-primary gentle-transition"
                >
                  support@mindbuddy.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-primary gentle-transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground">Follow us:</span>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary gentle-transition group"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground">Stay updated:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary gentle-transition"
                />
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 gentle-transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} MindBuddy. All rights reserved.</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-primary gentle-transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary gentle-transition"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-muted-foreground hover:text-primary gentle-transition"
              >
                Cookie Policy
              </Link>
            </div>

            {/* Crisis Support Notice */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Available 24/7 for crisis support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
