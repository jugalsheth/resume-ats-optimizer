"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptimizedResume, ResumeData } from "@/lib/types";
import { GitCompare, TrendingUp, FileText, Copy } from "lucide-react";
import { compareTexts, DiffSegment } from "@/lib/diff-utils";

interface ResumeComparisonProps {
  originalResume: ResumeData;
  optimizedResume: OptimizedResume;
  inline?: boolean; // If true, renders without Card wrapper for use in tabs
}

export function ResumeComparison({
  originalResume,
  optimizedResume,
  inline = false,
}: ResumeComparisonProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");

  const comparison = useMemo(() => {
    return compareTexts(originalResume.text, optimizedResume.text);
  }, [originalResume.text, optimizedResume.text]);

  const renderDiffSegment = (segment: DiffSegment, index: number) => {
    const baseClasses = "px-1 rounded";
    switch (segment.type) {
      case "added":
        return (
          <span key={index} className={`${baseClasses} bg-success-100 text-success-800`}>
            {segment.text}
          </span>
        );
      case "removed":
        return (
          <span key={index} className={`${baseClasses} bg-destructive-100 text-destructive-800 line-through`}>
            {segment.text}
          </span>
        );
      default:
        return <span key={index}>{segment.text}</span>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const content = (
    <>
      {!inline && (
        <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary-500" />
            Resume Comparison
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {comparison.changePercentage}% changed
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "side-by-side" ? "unified" : "side-by-side")}
            >
              {viewMode === "side-by-side" ? "Unified View" : "Side-by-Side"}
            </Button>
          </div>
        </div>
        </CardHeader>
      )}
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-500 mb-1">Original Words</div>
            <div className="text-lg font-semibold">{comparison.originalStats.words}</div>
          </div>
          <div className="p-3 bg-primary-50 rounded-lg">
            <div className="text-xs text-neutral-500 mb-1">Optimized Words</div>
            <div className="text-lg font-semibold">{comparison.modifiedStats.words}</div>
          </div>
          <div className="p-3 bg-success-50 rounded-lg">
            <div className="text-xs text-neutral-500 mb-1">Added</div>
            <div className="text-lg font-semibold text-success-700">
              +{comparison.diff.addedCount}
            </div>
          </div>
          <div className="p-3 bg-destructive-50 rounded-lg">
            <div className="text-xs text-neutral-500 mb-1">Removed</div>
            <div className="text-lg font-semibold text-destructive-700">
              -{comparison.diff.removedCount}
            </div>
          </div>
        </div>

        {/* Comparison View */}
        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Original Resume
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(originalResume.text)}
                  className="h-7"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg max-h-[600px] overflow-y-auto border-2 border-neutral-200">
                <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                  {originalResume.text}
                </pre>
              </div>
            </div>

            {/* Optimized */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  Optimized Resume
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(optimizedResume.text)}
                  className="h-7"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg max-h-[600px] overflow-y-auto border-2 border-primary-200">
                <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                  {optimizedResume.text}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                Unified Diff View
              </h3>
              <div className="flex gap-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-success-100 border border-success-300 rounded"></span>
                  Added
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-destructive-100 border border-destructive-300 rounded line-through"></span>
                  Removed
                </span>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg max-h-[600px] overflow-y-auto border-2 border-neutral-200">
              <div className="text-sm text-neutral-700 font-sans whitespace-pre-wrap">
                {comparison.diff.segments.map((segment, index) => renderDiffSegment(segment, index))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );

  if (inline) {
    return <div className="space-y-4">{content}</div>;
  }

  return <Card>{content}</Card>;
}

