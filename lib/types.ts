export interface ResumeData {
  text: string;
  fileName: string;
  fileType: string;
}

export interface JobDescription {
  text: string;
}

export interface ATSScore {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface OptimizedResume {
  text: string;
  improvements: string[];
  keywordsAdded: number;
  scoreImprovement: number;
}

export interface ProcessingStage {
  stage: 'analyzing' | 'extracting' | 'optimizing' | 'calculating' | 'complete';
  progress: number;
}

export type OptimizerStep = 'upload' | 'job-description' | 'processing' | 'results';

