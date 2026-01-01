"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { ResumeData } from "@/lib/types";

interface EmailTemplateGeneratorProps {
  resumeData: ResumeData;
  jobDescription: string;
}

type EmailType = 'application' | 'follow-up' | 'thank-you';

export function EmailTemplateGenerator({
  resumeData,
  jobDescription,
}: EmailTemplateGeneratorProps) {
  const [selectedType, setSelectedType] = useState<EmailType>('application');
  const [generatedEmails, setGeneratedEmails] = useState<Record<EmailType, string | null>>({
    'application': null,
    'follow-up': null,
    'thank-you': null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<EmailType | null>(null);

  const handleGenerate = async (type: EmailType) => {
    if (!resumeData?.text || !jobDescription.trim()) {
      setError("Resume and job description are required");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeData.text,
          jobDescription,
          emailType: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email");
      }

      const data = await response.json();
      setGeneratedEmails(prev => ({
        ...prev,
        [type]: data.email,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, type: EmailType) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const emailLabels = {
    'application': 'Application Email',
    'follow-up': 'Follow-Up Email',
    'thank-you': 'Thank-You Email',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary-500" />
          Email Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as EmailType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="follow-up">Follow-Up</TabsTrigger>
            <TabsTrigger value="thank-you">Thank-You</TabsTrigger>
          </TabsList>

          {(['application', 'follow-up', 'thank-you'] as EmailType[]).map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="space-y-4">
                {!generatedEmails[type] ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-600 mb-4">
                      Generate a professional {emailLabels[type].toLowerCase()} based on your resume and this job description.
                    </p>
                    <Button
                      onClick={() => handleGenerate(type)}
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
                          <Mail className="w-4 h-4 mr-2" />
                          Generate {emailLabels[type]}
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">
                        {emailLabels[type]}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(type)}
                          disabled={isGenerating}
                        >
                          <Loader2 className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(generatedEmails[type]!, type)}
                        >
                          {copied === type ? (
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
                      value={generatedEmails[type]!}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <p className="text-xs text-neutral-500">
                      💡 Tip: Copy the email and paste it into your email client. Don't forget to add a subject line!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

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

