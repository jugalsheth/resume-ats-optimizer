"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateFile, formatFileSize } from "@/lib/utils";
import { extractResumeText } from "@/lib/pdf-parser";
import { type ResumeData } from "@/lib/types";

interface ResumeUploaderProps {
  onResumeExtracted: (data: ResumeData) => void;
  resumeData?: ResumeData | null;
}

export function ResumeUploader({ onResumeExtracted, resumeData }: ResumeUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setIsProcessing(false);
        return;
      }

      const text = await extractResumeText(file);
      
      onResumeExtracted({
        text,
        fileName: file.name,
        fileType: file.type,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process file";
      console.error("File processing error:", err);
      setError(errorMessage);
      
      // Clear any partial state on error
      onResumeExtracted({
        text: "",
        fileName: "",
        fileType: "",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onResumeExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleClear = () => {
    onResumeExtracted({
      text: "",
      fileName: "",
      fileType: "",
    });
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!resumeData?.text ? (
        <Card className="border-2 border-dashed hover:border-primary-400 transition-colors">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`cursor-pointer text-center ${
                isDragActive ? "opacity-70" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                  <p className="text-lg font-medium text-neutral-700">
                    Processing resume...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-neutral-900 mb-2">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-neutral-500">
                      or click to browse (PDF, DOCX, TXT - max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">
                    {resumeData.fileName}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {resumeData.text.length} characters extracted
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {resumeData.text && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg max-h-48 overflow-y-auto">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap line-clamp-6">
                  {resumeData.text.substring(0, 500)}
                  {resumeData.text.length > 500 && "..."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

