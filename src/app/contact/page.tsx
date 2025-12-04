"use client";

import { motion } from 'framer-motion';
import FloatingParticles from '@/components/FloatingParticles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingParticles />

      {/* Navigation (kept identical style) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-primary">
            PadhaiDunia
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="/AboutUs" className="text-foreground hover:text-primary transition-colors">About Us</a>
            <a href="/#courses" className="text-foreground hover:text-primary transition-colors">Courses</a>
            <a href="/#team" className="text-foreground hover:text-primary transition-colors">Team</a>
            <a href="/contact" className="text-primary font-medium transition-colors">Contact Us</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
            <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">Sign Up</Button>
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <section className="min-h-[40vh] flex items-center justify-center pt-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions or need help? Send us a message and our team will get back to you shortly.
          </motion.p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* Info cards */}
          <div className="space-y-6">
            {/* ... your three info cards exactly as you wrote ... */}
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 glass rounded-2xl p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* ... your form fields exactly as you wrote ... */}
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-12 mt-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 PadhaiDunia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
