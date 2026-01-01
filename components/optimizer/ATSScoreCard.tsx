"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { ATSScore } from "@/lib/types";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface ATSScoreCardProps {
  score: ATSScore;
}

export function ATSScoreCard({ score }: ATSScoreCardProps) {
  const scoreColor = getScoreColor(score.score);
  const scoreBgColor = getScoreBgColor(score.score);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ATS Compatibility Score</span>
          <motion.div
            className={`text-4xl font-bold ${scoreColor}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {score.score}
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Score</span>
            <span className={`text-sm font-semibold ${scoreColor}`}>
              {score.score}/100
            </span>
          </div>
          <Progress value={score.score} className="h-3" />
        </div>

        {score.missingKeywords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-warning-500" />
              <h3 className="font-semibold text-neutral-900">
                Missing Keywords ({score.missingKeywords.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {score.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {score.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-success-500" />
              <h3 className="font-semibold text-neutral-900">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {score.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                  <span className="text-success-500 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {score.weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-warning-500" />
              <h3 className="font-semibold text-neutral-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {score.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                  <span className="text-warning-500 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {score.suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <h3 className="font-semibold text-neutral-900">Suggestions</h3>
            </div>
            <ul className="space-y-2">
              {score.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                  <span className="text-primary-500 mt-1">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

