"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({ message, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeMap[size]} text-primary-500`} />
      </motion.div>
      {message && (
        <p className="text-sm text-neutral-600 font-medium">{message}</p>
      )}
    </div>
  );
}

