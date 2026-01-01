"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { JobUrlParser } from "./JobUrlParser";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SAMPLE_JOB_DESCRIPTION = `Software Engineer - Full Stack

We are looking for a talented Full Stack Software Engineer to join our team. The ideal candidate will have experience with:

Requirements:
- 3+ years of experience in software development
- Proficiency in React, TypeScript, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Strong understanding of RESTful APIs and microservices architecture
- Knowledge of database systems (PostgreSQL, MongoDB)
- Experience with CI/CD pipelines and DevOps practices
- Excellent problem-solving skills and attention to detail
- Bachelor's degree in Computer Science or related field

Preferred Qualifications:
- Experience with Docker and Kubernetes
- Knowledge of GraphQL
- Experience with test-driven development (TDD)
- Familiarity with Agile/Scrum methodologies

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Troubleshoot and debug applications`;

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(newValue);
  };

  const handleExample = () => {
    onChange(SAMPLE_JOB_DESCRIPTION);
    setCharCount(SAMPLE_JOB_DESCRIPTION.length);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Description
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExample}
            className="text-sm"
          >
            Use Example
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="mt-4">
            <Textarea
              placeholder="Paste the job description here..."
              value={value}
              onChange={handleChange}
              className="min-h-[300px] resize-none"
            />
            <div className="mt-2 flex justify-between items-center text-sm text-neutral-500">
              <span>{charCount} characters</span>
              <span className={charCount < 100 ? "text-warning-500" : ""}>
                {charCount < 100 ? "Please provide more details" : "✓ Good length"}
              </span>
            </div>
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <JobUrlParser onJobParsed={(description) => {
              onChange(description);
              setCharCount(description.length);
            }} />
            {value && (
              <div className="mt-4">
                <Textarea
                  value={value}
                  onChange={handleChange}
                  className="min-h-[200px] resize-none"
                  placeholder="Parsed job description will appear here..."
                />
                <div className="mt-2 text-sm text-neutral-500">
                  {charCount} characters
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

