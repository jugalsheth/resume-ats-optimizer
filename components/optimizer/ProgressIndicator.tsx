"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      isCompleted
                        ? "bg-primary-500 border-primary-500 text-white"
                        : isCurrent
                        ? "bg-primary-100 border-primary-500 text-primary-500"
                        : "bg-white border-neutral-300 text-neutral-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm font-medium text-center",
                      isCurrent
                        ? "text-primary-600"
                        : isCompleted
                        ? "text-neutral-700"
                        : "text-neutral-400"
                    )}
                  >
                    {step}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 mt-[-20px] transition-colors",
                      isCompleted ? "bg-primary-500" : "bg-neutral-300"
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

