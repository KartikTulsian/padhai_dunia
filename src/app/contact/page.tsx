"use client";

import { motion } from "framer-motion";
import FloatingParticles from "@/components/FloatingParticles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import AppLink from "@/components/AppLink";

const Contact = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingParticles />

      {/* NAVIGATION – matched to landing page style */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand with logo (same as landing) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <Image
              src="/logo_single.png"
              alt="PadhaiDunia Logo"
              width={50}
              height={50}
            />
            PadhaiDunia
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <AppLink
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </AppLink>
            <AppLink
              href="/AboutUs"
              className="text-foreground hover:text-primary transition-colors"
            >
              About Us
            </AppLink>
            <AppLink
              href="/Courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Courses
            </AppLink>
            <AppLink
              href="/teams"
              className="text-foreground hover:text-primary transition-colors"
            >
              Team
            </AppLink>
            <AppLink
              href="/contact"
              className="text-primary font-medium transition-colors"
            >
              Contact Us
            </AppLink>
          </div>

          {/* Auth buttons – same vibe as landing */}
          <div className="flex items-center gap-4">
            <AppLink
              href="/sign-in"
              className="text-foreground hover:text-primary transition-colors"
            >
              Login
            </AppLink>
            <AppLink
              href="/sign-up"
              className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all"
            >
              Join Now
            </AppLink>
          </div>
        </div>
      </motion.nav>

      {/* HEADER */}
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
            Have questions or need help? Send us a message and our team will get
            back to you shortly.
          </motion.p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* Info Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Mail className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    support@padhaidunia.com
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Phone className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+91 99999 99999</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MapPin className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Address
                  </h3>
                  <p className="text-muted-foreground">
                    Silicon Valley, CA, USA
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 glass rounded-2xl p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Name
                </Label>
                <Input id="name" placeholder="Your name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="subject" className="text-foreground">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="How can we help?"
                className="mt-2"
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="message" className="text-foreground">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Write your message..."
                className="mt-2 min-h-40"
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold hover-glow group"
              >
                Send Message
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* FOOTER – same structure as landing page footer */}
      <footer className="glass border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">
                PadhaiDunia
              </div>
              <p className="text-muted-foreground">
                Empowering learners worldwide with AI-powered education
                platform.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Courses</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    AI &amp; Machine Learning
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Web Development
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Data Science
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Mobile Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 PadhaiDunia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
