import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be PDF, DOCX, or TXT' }
  }
  
  return { valid: true }
}

export function getScoreColor(score: number): string {
  if (score < 50) return 'text-danger-500'
  if (score < 75) return 'text-warning-500'
  return 'text-success-500'
}

export function getScoreBgColor(score: number): string {
  if (score < 50) return 'bg-danger-500'
  if (score < 75) return 'bg-warning-500'
  return 'bg-success-500'
}

