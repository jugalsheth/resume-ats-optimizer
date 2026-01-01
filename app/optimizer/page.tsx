"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "@/components/optimizer/ProgressIndicator";
import { ResumeUploader } from "@/components/optimizer/ResumeUploader";
import { JobDescriptionInput } from "@/components/optimizer/JobDescriptionInput";
import { ATSScoreCard } from "@/components/optimizer/ATSScoreCard";
import { OptimizedResumePreview } from "@/components/optimizer/OptimizedResumePreview";
import { DownloadButton } from "@/components/optimizer/DownloadButton";
import { LaTeXInfo } from "@/components/optimizer/LaTeXInfo";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResumeData, JobDescription, ATSScore, OptimizedResume, OptimizerStep } from "@/lib/types";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { EmailTemplateGenerator } from "@/components/emails/EmailTemplateGenerator";
import { JobInsightsCard } from "@/components/job-insights/JobInsightsCard";
import { CoverLetterGenerator } from "@/components/cover-letter/CoverLetterGenerator";
import { SkillsGapAnalysis } from "@/components/skills/SkillsGapAnalysis";

const STEPS = ["Upload Resume", "Job Description", "Processing", "Results"];

export default function OptimizerPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleResumeExtracted = (data: ResumeData) => {
    setResumeData(data);
    if (data.text) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
  };

  const handleStartOptimization = async () => {
    if (!resumeData?.text || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentStep(2);

    try {
      // Stage 1: Analyze ATS Score
      setProcessingStage("Analyzing resume...");
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeData.text,
          jobDescription,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const atsData: ATSScore = await analyzeResponse.json();
      setAtsScore(atsData);

      // Stage 2: Optimize Resume
      setProcessingStage("Extracting keywords...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStage("Optimizing content...");
      const optimizeResponse = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeData.text,
          jobDescription,
          missingKeywords: atsData.missingKeywords,
        }),
      });

      if (!optimizeResponse.ok) {
        throw new Error("Failed to optimize resume");
      }

      const reader = optimizeResponse.body?.getReader();
      const decoder = new TextDecoder();
      let optimizedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          optimizedText += decoder.decode(value, { stream: true });
        }
      }

      setProcessingStage("Calculating ATS score...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate improvements
      const keywordsAdded = atsData.missingKeywords.length;
      const scoreImprovement = Math.min(30, keywordsAdded * 2); // Estimate improvement

      setOptimizedResume({
        text: optimizedText.trim(),
        improvements: atsData.suggestions.slice(0, 5),
        keywordsAdded,
        scoreImprovement,
      });

      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setJobDescription("");
    setAtsScore(null);
    setOptimizedResume(null);
    setCurrentStep(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Resume ATS Optimizer
          </h1>
          <p className="text-lg text-neutral-600">
            Optimize your resume to pass Applicant Tracking Systems
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} steps={STEPS} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Step 1: Upload Your Resume</h2>
                    <ResumeUploader
                      onResumeExtracted={handleResumeExtracted}
                      resumeData={resumeData}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="job-description"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">Step 2: Job Description</h2>
                      <JobDescriptionInput
                        value={jobDescription}
                        onChange={handleJobDescriptionChange}
                      />
                    </CardContent>
                  </Card>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleStartOptimization}
                      size="lg"
                      disabled={!resumeData?.text || !jobDescription.trim()}
                    >
                      Start Optimization
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card>
                  <CardContent className="p-12">
                    <LoadingSpinner
                      message={processingStage || "Processing your resume..."}
                      size="lg"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && atsScore && optimizedResume && resumeData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="space-y-6">
                  <ATSScoreCard score={atsScore} />
                  <JobInsightsCard jobDescription={jobDescription} />
                  <SkillsGapAnalysis
                    resumeData={resumeData}
                    jobDescription={jobDescription}
                  />
                  <OptimizedResumePreview
                    originalResume={resumeData}
                    optimizedResume={optimizedResume}
                  />
                  <CoverLetterGenerator
                    resumeData={resumeData}
                    jobDescription={jobDescription}
                  />
                  <EmailTemplateGenerator
                    resumeData={resumeData}
                    jobDescription={jobDescription}
                  />
                  <LaTeXInfo />
                  <div className="flex gap-4 justify-end">
                    <Button variant="outline" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Another
                    </Button>
                    <DownloadButton
                      optimizedResume={optimizedResume}
                      fileName={`optimized-${resumeData.fileName?.replace(/\.[^/.]+$/, '') || "resume"}`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

