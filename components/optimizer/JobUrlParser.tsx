"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { parseJobFromUrl, isValidJobUrl } from "@/lib/job-parser";

interface JobUrlParserProps {
  onJobParsed: (description: string) => void;
}

export function JobUrlParser({ onJobParsed }: JobUrlParserProps) {
  const [url, setUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleParse = async () => {
    if (!url.trim()) {
      setError("Please enter a job posting URL");
      return;
    }

    if (!isValidJobUrl(url)) {
      setError("This doesn't look like a job posting URL. Please enter a URL from LinkedIn, Indeed, or similar job boards.");
      return;
    }

    setIsParsing(true);
    setError(null);
    setSuccess(false);

    try {
      const parsed = await parseJobFromUrl(url);
      onJobParsed(parsed.description);
      setSuccess(true);
      setUrl(""); // Clear URL after successful parse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse job description";
      setError(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Paste job posting URL (LinkedIn, Indeed, etc.)"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isParsing) {
              handleParse();
            }
          }}
          disabled={isParsing}
          className="flex-1"
        />
        <Button
          onClick={handleParse}
          disabled={isParsing || !url.trim()}
          size="default"
        >
          {isParsing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              Parse
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-success-50 border-success-200">
          <CheckCircle2 className="w-4 h-4 text-success-600" />
          <AlertDescription className="text-success-800">
            Job description parsed successfully! Check the text area below.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-neutral-500">
        💡 Tip: Some job boards (like LinkedIn) may require manual copy/paste due to access restrictions.
      </p>
    </div>
  );
}

