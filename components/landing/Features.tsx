"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, FileText, Zap, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score Analysis",
    description: "Get an instant ATS compatibility score and detailed feedback on what's missing from your resume.",
    color: "text-primary-500",
  },
  {
    icon: Sparkles,
    title: "Keyword Optimization",
    description: "Automatically identify and incorporate missing keywords from job descriptions to boost your score.",
    color: "text-success-500",
  },
  {
    icon: FileText,
    title: "Smart Formatting",
    description: "Ensure your resume is ATS-friendly with proper formatting and structure recommendations.",
    color: "text-warning-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get optimized results in seconds, not hours. No waiting, no delays.",
    color: "text-primary-600",
  },
  {
    icon: TrendingUp,
    title: "Score Improvement",
    description: "See measurable improvements in your ATS score with actionable suggestions.",
    color: "text-success-600",
  },
  {
    icon: CheckCircle2,
    title: "100% Free",
    description: "No hidden costs, no subscriptions. Completely free to use forever.",
    color: "text-primary-700",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            Everything You Need to Pass ATS
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Powerful features designed to help you get past Applicant Tracking Systems and land more interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary-200">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

