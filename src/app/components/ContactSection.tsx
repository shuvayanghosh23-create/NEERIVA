import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Please enter your name.'); return; }
    if (!formData.email.trim()) { toast.error('Please enter your email.'); return; }
    if (!formData.message.trim()) { toast.error('Please write a message.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Thanks, ${formData.name}! We'll get back to you within 24 hours. 💧`);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    { icon: Phone, title: 'Call Us', details: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: Mail, title: 'Email Us', details: 'support@neeriva.com', link: 'mailto:support@neeriva.com' },
    { icon: MapPin, title: 'Visit Us', details: '123 Water Street, Pure City, PC 12345', link: 'https://maps.google.com' },
  ];

  return (
    <section id="contact-support" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-white to-cyan-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Contact Support
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help you 24/7
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h3>
              <p className="text-gray-600 text-lg mb-8">
                Our dedicated support team is always ready to assist you with any
                queries or concerns about NEERIVA products and services.
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-cyan-100 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg mb-1">{info.title}</h4>
                  <p className="text-gray-600">{info.details}</p>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl text-white"
            >
              <h4 className="font-semibold text-xl mb-2">Business Hours</h4>
              <p className="mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="mb-1">Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-cyan-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
                  <Label htmlFor="contact-name" className="text-gray-700 mb-2 block">Your Name</Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
                  <Label htmlFor="contact-email" className="text-gray-700 mb-2 block">Your Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
                  <Label htmlFor="contact-message" className="text-gray-700 mb-2 block">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400 resize-none"
                  />
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}