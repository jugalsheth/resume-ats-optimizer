"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Loader2, Copy, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { ResumeData } from "@/lib/types";

interface CoverLetterGeneratorProps {
  resumeData: ResumeData;
  jobDescription: string;
}

type Tone = 'professional' | 'enthusiastic' | 'concise';

export function CoverLetterGenerator({
  resumeData,
  jobDescription,
}: CoverLetterGeneratorProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resumeData?.text || !jobDescription.trim()) {
      setError("Resume and job description are required");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedLetter(null);

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeData.text,
          jobDescription,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let letterText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          letterText += decoder.decode(value, { stream: true });
          setGeneratedLetter(letterText); // Update as we receive chunks
        }
      }

      setGeneratedLetter(letterText.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedLetter) {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedLetter) return;

    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${selectedTone}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toneLabels = {
    professional: 'Professional',
    enthusiastic: 'Enthusiastic',
    concise: 'Concise',
  };

  const toneDescriptions = {
    professional: 'Polished and formal tone',
    enthusiastic: 'Energetic and passionate tone',
    concise: 'Direct and to-the-point tone',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            Cover Letter Generator
          </CardTitle>
          {generatedLetter && (
            <Badge variant="outline" className="text-sm">
              {toneLabels[selectedTone]} Tone
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!generatedLetter ? (
            <>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Select Tone
                </label>
                <Tabs value={selectedTone} onValueChange={(v) => setSelectedTone(v as Tone)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="enthusiastic">Enthusiastic</TabsTrigger>
                    <TabsTrigger value="concise">Concise</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-neutral-500 mt-2">
                  {toneDescriptions[selectedTone]}
                </p>
              </div>

              <div className="text-center py-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{toneLabels[selectedTone]}</Badge>
                  <span className="text-xs text-neutral-500">
                    {generatedLetter.split(/\s+/).length} words
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <Loader2 className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 text-success-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Textarea
                value={generatedLetter}
                readOnly
                className="min-h-[300px] font-sans text-sm"
              />

              <div className="flex items-center justify-between">
                <Tabs value={selectedTone} onValueChange={(v) => {
                  setSelectedTone(v as Tone);
                  setGeneratedLetter(null);
                }}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="enthusiastic">Enthusiastic</TabsTrigger>
                    <TabsTrigger value="concise">Concise</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <p className="text-xs text-neutral-500">
                💡 Tip: Copy the cover letter and paste it into your application. Don't forget to customize it with the company name and role!
              </p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

