import { motion } from 'motion/react';
import { Shield, Zap, Award, Leaf } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function InfoSection() {
  const benefits = [
    {
      icon: Shield,
      title: '100% Safe & Pure',
      description: 'Multi-stage purification ensures the highest quality water',
    },
    {
      icon: Zap,
      title: 'Essential Minerals',
      description: 'Enriched with natural minerals for optimal health',
    },
    {
      icon: Award,
      title: 'Certified Quality',
      description: 'ISO certified and tested by international standards',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging and environmentally conscious',
    },
  ];

  return (
    <section id="info" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cyan-50/30 to-white -z-10" />
      
      <div className="container mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Why Choose NEERIVA?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference of truly pure water with advanced filtration technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-100"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl"
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770680425424-8557ad98783b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJlJTIwd2F0ZXIlMjBkcm9wbGV0JTIwc3BsYXNofGVufDF8fHx8MTc3MTgxNzQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Pure Water Droplet"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent flex items-end">
            <div className="p-12 text-white">
              <motion.h3
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4"
              >
                Purity in Every Drop
              </motion.h3>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="text-xl text-cyan-100"
              >
                Advanced 7-stage purification process for the cleanest water
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
