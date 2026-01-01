"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, FileText, File, Code, FileType } from "lucide-react";
import { OptimizedResume } from "@/lib/types";
import { downloadResume, type DownloadFormat } from "@/lib/download-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DownloadButtonProps {
  optimizedResume: OptimizedResume;
  fileName?: string;
}

const formatOptions: { format: DownloadFormat; label: string; icon: React.ReactNode; description: string }[] = [
  {
    format: 'pdf',
    label: 'PDF',
    icon: <File className="w-4 h-4" />,
    description: 'Beautiful formatted PDF',
  },
  {
    format: 'latex',
    label: 'LaTeX',
    icon: <Code className="w-4 h-4" />,
    description: 'LaTeX source for Overleaf',
  },
  {
    format: 'txt',
    label: 'Plain Text',
    icon: <FileText className="w-4 h-4" />,
    description: 'Simple text file',
  },
  {
    format: 'md',
    label: 'Markdown',
    icon: <FileType className="w-4 h-4" />,
    description: 'Markdown format',
  },
];

export function DownloadButton({ optimizedResume, fileName = "optimized-resume" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastFormat, setLastFormat] = useState<DownloadFormat>('pdf');

  const handleDownload = async (format: DownloadFormat) => {
    setIsDownloading(true);
    setLastFormat(format);
    
    try {
      await downloadResume({
        text: optimizedResume.text,
        fileName,
        format,
      });
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download ${format.toUpperCase()} file. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const quickDownload = () => {
    handleDownload(lastFormat);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={quickDownload}
        size="lg"
        disabled={isDownloading}
        className="flex-1 sm:flex-initial"
      >
        <Download className="w-4 h-4 mr-2" />
        {isDownloading ? 'Downloading...' : 'Download Optimized Resume'}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            disabled={isDownloading}
            className="px-3"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {formatOptions.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleDownload(option.format)}
              className="flex items-start gap-3 cursor-pointer"
            >
              <div className="mt-0.5">{option.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
