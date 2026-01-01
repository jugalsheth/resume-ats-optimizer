"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description: "Drag and drop your resume (PDF, DOCX, or TXT). Our system extracts and analyzes your content instantly.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Paste Job Description",
    description: "Copy and paste the job description you're applying for. We'll match your resume against it.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Get Optimized Resume",
    description: "Receive an optimized resume with improved ATS score, missing keywords added, and formatting suggestions.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            How It Works
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Three simple steps to optimize your resume and boost your chances of landing an interview.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute w-24 h-24 bg-primary-100 rounded-full" />
                    <div className="relative w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-primary-200 transform translate-x-6" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

