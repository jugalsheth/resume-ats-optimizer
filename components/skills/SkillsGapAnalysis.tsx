"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ResumeData } from "@/lib/types";

interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  reason: string;
}

interface LearningPathItem {
  skill: string;
  resources: string[];
  timeframe: string;
}

interface SkillsGapAnalysis {
  resumeSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  matchingSkills: string[];
  skillGaps: SkillGap[];
  learningPath: LearningPathItem[];
  matchPercentage: number;
}

interface SkillsGapAnalysisProps {
  resumeData: ResumeData;
  jobDescription: string;
}

export function SkillsGapAnalysis({
  resumeData,
  jobDescription,
}: SkillsGapAnalysisProps) {
  const [analysis, setAnalysis] = useState<SkillsGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeData?.text || !jobDescription.trim()) {
      setError("Resume and job description are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/skills/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeData.text,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze skills gap");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-destructive-100 text-destructive-800 border-destructive-300';
      case 'medium':
        return 'bg-warning-100 text-warning-800 border-warning-300';
      case 'low':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (!analysis && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            Skills Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-4">
              Compare your skills with job requirements and get personalized learning recommendations.
            </p>
            <Button onClick={handleAnalyze} size="lg">
              <Target className="w-4 h-4 mr-2" />
              Analyze Skills Gap
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
            <Target className="w-5 h-5 text-primary-500" />
            Skills Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-neutral-600">Analyzing skills gap...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            Skills Gap Analysis
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleAnalyze}>
            <Loader2 className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Re-analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Match Percentage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Skills Match</span>
            <span className="text-lg font-bold text-primary-600">
              {analysis.matchPercentage}%
            </span>
          </div>
          <Progress value={analysis.matchPercentage} className="h-3" />
        </div>

        <Tabs defaultValue="gaps" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
            <TabsTrigger value="skills">Skills Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning Path</TabsTrigger>
          </TabsList>

          <TabsContent value="gaps" className="mt-4 space-y-4">
            {analysis.skillGaps.length > 0 ? (
              <div className="space-y-3">
                {analysis.skillGaps.map((gap, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${getImportanceColor(gap.importance)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{gap.skill}</h4>
                      <Badge variant="outline" className="text-xs">
                        {gap.importance.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{gap.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success-500" />
                <p>No significant skill gaps identified!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills" className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                Matching Skills ({analysis.matchingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingSkills.length > 0 ? (
                  analysis.matchingSkills.map((skill, index) => (
                    <Badge key={index} variant="default" className="bg-success-500">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No matching skills found</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive-500" />
                Missing Skills ({analysis.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-destructive-300 text-destructive-700">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No missing skills!</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Your Skills</p>
                <p className="text-lg font-semibold">{analysis.resumeSkills.length}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Required Skills</p>
                <p className="text-lg font-semibold">{analysis.requiredSkills.length}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-4 space-y-4">
            {analysis.learningPath.length > 0 ? (
              <div className="space-y-4">
                {analysis.learningPath.map((item, index) => (
                  <div key={index} className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary-500" />
                        {item.skill}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {item.timeframe}
                      </Badge>
                    </div>
                    <ul className="space-y-1 mt-2">
                      {item.resources.map((resource, resIndex) => (
                        <li key={resIndex} className="text-sm text-neutral-700 flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-primary-500" />
                <p>No learning path needed - you're well-qualified!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

