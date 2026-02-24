import { motion } from 'motion/react';
import { Droplets, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function Footer() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success(`You're subscribed! Welcome to the NEERIVA family 💧`);
    setNewsletterEmail('');
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: 'About Us', action: () => navigate('/info') },
    { label: 'Products', action: () => navigate('/info') },
    { label: 'Services', action: () => navigate('/info') },
    { label: 'Login / Sign Up', action: () => navigate('/login') },
    { label: 'Contact', action: () => navigate('/contact-support') },
  ];

  const supportLinks = [
    { label: 'Help Center', action: () => navigate('/contact-support') },
    { label: 'FAQs', action: () => toast.info('FAQs page coming soon!') },
    { label: 'Terms of Service', action: () => toast.info('Terms of Service — coming soon!') },
    { label: 'Privacy Policy', action: () => toast.info('Privacy Policy — coming soon!') },
    { label: 'Contact Us', action: () => navigate('/contact-support') },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-full">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">NEERIVA</h3>
                <p className="text-sm text-gray-400">The Pure Water</p>
              </div>
            </button>
            <p className="text-gray-400 mb-4">
              Delivering pure and healthy water to homes and businesses since 2020.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-800 rounded-full hover:bg-cyan-600 transition-colors cursor-pointer"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all text-sm"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-700 text-center text-gray-400"
        >
          <p>&copy; 2026 NEERIVA. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
