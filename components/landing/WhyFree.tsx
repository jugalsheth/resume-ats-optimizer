"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Infinity, Zap, Shield, TrendingUp, Users, Sparkles } from "lucide-react";

const freeTierBenefits = [
  {
    icon: Infinity,
    title: "Free Forever",
    description: "Built on Groq's generous free tier - 30 requests/minute, 6,000 tokens/minute. More than enough for your job search needs.",
    color: "text-primary-500",
    bgColor: "bg-primary-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Using Groq's INSTANT model means faster responses (2-8 seconds) and zero cost. Speed + efficiency = always free.",
    color: "text-success-500",
    bgColor: "bg-success-50",
  },
  {
    icon: Shield,
    title: "No Hidden Costs",
    description: "We're architected for free tier limits. Every feature is optimized to stay within Groq's free tier forever.",
    color: "text-warning-500",
    bgColor: "bg-warning-50",
  },
];

const comparisons = [
  {
    category: "Cost",
    us: "100% Free Forever",
    competitors: "$9-49/month",
    advantage: "No subscription, no credit card, no limits",
  },
  {
    category: "Speed",
    us: "2-8 seconds",
    competitors: "30-60 seconds",
    advantage: "Groq's INSTANT model is 10x faster",
  },
  {
    category: "Features",
    us: "7+ tools included",
    competitors: "Basic optimization only",
    advantage: "Resume, cover letter, emails, insights, skills gap analysis",
  },
  {
    category: "Privacy",
    us: "No account needed",
    competitors: "Requires sign-up",
    advantage: "Use and go - no data stored, no tracking",
  },
];

export function WhyFree() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-success-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-success-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Infinity className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">
              Free Forever Promise
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            Why We're Always Free
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We're not just free today - we're architected to stay free forever. Here's how we make it work.
          </p>
        </motion.div>

        {/* Free Tier Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {freeTierBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full border-2 ${benefit.bgColor} border-transparent hover:shadow-lg transition-all`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${benefit.bgColor} flex items-center justify-center mb-4 ${benefit.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-neutral-900">{benefit.title}</h3>
                    <p className="text-neutral-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Explanation */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-primary-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-neutral-900">
                    Built for Groq's Free Tier
                  </h3>
                  <p className="text-neutral-700 mb-4 leading-relaxed">
                    We've designed every feature to work within Groq's generous free tier limits:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="text-sm text-neutral-500 mb-1">Rate Limit</div>
                      <div className="text-2xl font-bold text-primary-600">30 requests/minute</div>
                      <div className="text-xs text-neutral-500 mt-1">~1 full optimization per minute</div>
                    </div>
                    <div className="p-4 bg-success-50 rounded-lg">
                      <div className="text-sm text-neutral-500 mb-1">Token Limit</div>
                      <div className="text-2xl font-bold text-success-600">6,000 tokens/minute</div>
                      <div className="text-xs text-neutral-500 mt-1">~5,500 tokens per session</div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 italic">
                    💡 <strong>What this means:</strong> Most users do 1-5 optimizations per session. 
                    Even power users doing 100+ optimizations per month stay well within free tier limits. 
                    We're designed to scale with free infrastructure, not paid tiers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2 text-neutral-900 flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary-500" />
              How We Compare
            </h3>
            <p className="text-neutral-600">
              See how we stack up against paid resume optimization tools
            </p>
          </div>

          <Card className="border-2 border-neutral-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b-2 border-neutral-200">
                      <th className="text-left p-4 font-semibold text-neutral-900">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary-600">Resume ATS Optimizer</th>
                      <th className="text-center p-4 font-semibold text-neutral-600">Competitors</th>
                      <th className="text-center p-4 font-semibold text-success-600">Our Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((comparison, index) => (
                      <motion.tr
                        key={comparison.category}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <td className="p-4 font-medium text-neutral-900">{comparison.category}</td>
                        <td className="p-4 text-center">
                          <Badge variant="default" className="bg-primary-500">
                            {comparison.us}
                          </Badge>
                        </td>
                        <td className="p-4 text-center text-neutral-600">{comparison.competitors}</td>
                        <td className="p-4 text-center text-sm text-success-700">{comparison.advantage}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-success-50 border-2 border-success-200 rounded-full">
              <Users className="w-5 h-5 text-success-600" />
              <span className="text-success-800 font-medium">
                Join thousands of job seekers optimizing their resumes for free
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

