"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Building2,
  Users,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface JobInsights {
  mustHave: string[];
  niceToHave: string[];
  salaryEstimate: string;
  requiredQualifications: string[];
  preferredQualifications: string[];
  redFlags: string[];
  companyCulture: string;
  competitorProfile: string;
}

interface JobInsightsCardProps {
  jobDescription: string;
}

export function JobInsightsCard({ jobDescription }: JobInsightsCardProps) {
  const [insights, setInsights] = useState<JobInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Job description is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/job-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze job description");
      }

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!insights && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Job Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-4">
              Get detailed insights about this job posting - requirements, salary estimates, and more.
            </p>
            <Button onClick={handleAnalyze} size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analyze Job Description
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Job Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-neutral-600">Analyzing job description...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Job Insights
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleAnalyze}>
            <Loader2 className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Re-analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                Must-Have Requirements
              </h3>
              <ul className="space-y-2">
                {insights.mustHave.length > 0 ? (
                  insights.mustHave.map((req, index) => (
                    <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                      <span className="text-success-500 mt-1">✓</span>
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-neutral-500">No specific must-haves identified</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                Nice-to-Have (Preferred)
              </h3>
              <ul className="space-y-2">
                {insights.niceToHave.length > 0 ? (
                  insights.niceToHave.map((req, index) => (
                    <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                      <span className="text-primary-500 mt-1">+</span>
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-neutral-500">No preferred qualifications identified</li>
                )}
              </ul>
            </div>

            {insights.requiredQualifications.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Required Qualifications</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.requiredQualifications.map((qual, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="salary" className="mt-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-neutral-900">Salary Estimate</h3>
              </div>
              <p className="text-lg font-semibold text-primary-700">{insights.salaryEstimate}</p>
              <p className="text-xs text-neutral-500 mt-2">
                Based on role, location, and job description analysis
              </p>
            </div>
          </TabsContent>

          <TabsContent value="culture" className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary-500" />
                Company Culture
              </h3>
              <p className="text-sm text-neutral-700">{insights.companyCulture}</p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                Typical Candidate Profile
              </h3>
              <p className="text-sm text-neutral-700">{insights.competitorProfile}</p>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            {insights.redFlags.length > 0 ? (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-500" />
                  Potential Red Flags
                </h3>
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="space-y-2">
                      {insights.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="p-4 bg-success-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                  <p className="text-sm text-success-800">
                    No major red flags detected in this job posting.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

