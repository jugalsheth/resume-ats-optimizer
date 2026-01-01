"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Code, Sparkles } from "lucide-react";
import Link from "next/link";

export function LaTeXInfo() {
  return (
    <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <Code className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Want a beautifully formatted PDF?
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                Download the LaTeX (.tex) file and compile it into a professional PDF using{" "}
                <Link
                  href="https://www.overleaf.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline font-medium inline-flex items-center gap-1"
                >
                  Overleaf
                  <ExternalLink className="w-3 h-3" />
                </Link>
                {" "}— it's free, online, and requires zero setup!
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-primary-100">
              <h4 className="font-medium text-sm text-neutral-900 mb-2">How to use:</h4>
              <ol className="space-y-2 text-sm text-neutral-600 list-decimal list-inside">
                <li>Download the LaTeX format from the dropdown menu</li>
                <li>
                  Go to{" "}
                  <Link
                    href="https://www.overleaf.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Overleaf.com
                  </Link>
                  {" "}and create a free account (or sign in)
                </li>
                <li>Click "New Project" → "Upload Project" and upload your .tex file</li>
                <li>Click "Recompile" and voilà! Your beautiful PDF is ready</li>
              </ol>
            </div>

            <Alert className="bg-primary-50 border-primary-200">
              <AlertDescription className="text-sm text-neutral-700">
                <span className="font-medium">P.S.</span> Not sponsored (we wish! 😅), but Overleaf is genuinely awesome and will make your resume look absolutely stunning. Trust us, it's worth the extra step!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

