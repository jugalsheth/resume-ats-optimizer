"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OptimizedResume, ResumeData } from "@/lib/types";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { ResumeComparison } from "./ResumeComparison";

interface OptimizedResumePreviewProps {
  originalResume: ResumeData;
  optimizedResume: OptimizedResume;
}

export function OptimizedResumePreview({
  originalResume,
  optimizedResume,
}: OptimizedResumePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Optimized Resume
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-success-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {optimizedResume.keywordsAdded} keywords added
            </Badge>
            {optimizedResume.scoreImprovement > 0 && (
              <Badge variant="default" className="bg-primary-500">
                +{optimizedResume.scoreImprovement} points
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="optimized" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="optimized">Optimized</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="original" className="mt-4">
            <div className="p-4 bg-neutral-50 rounded-lg max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                {originalResume.text}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="optimized" className="mt-4">
            <div className="p-4 bg-primary-50 rounded-lg max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                {optimizedResume.text}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="comparison" className="mt-4">
            <ResumeComparison
              originalResume={originalResume}
              optimizedResume={optimizedResume}
            />
          </TabsContent>
        </Tabs>

        {optimizedResume.improvements.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Key Improvements
              </h3>
              <ul className="space-y-2">
                {optimizedResume.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-success-500 mt-1">✓</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

