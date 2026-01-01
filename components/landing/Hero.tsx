"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient" />
      
      {/* Animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">
              AI-Powered Resume Optimization
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
            Optimize Your Resume for ATS in Seconds
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get past Applicant Tracking Systems and land more interviews with our AI-powered resume optimizer. 
            Free, fast, and effective.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/optimizer">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Try Free Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No credit card required • 100% free • No sign-up needed
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

