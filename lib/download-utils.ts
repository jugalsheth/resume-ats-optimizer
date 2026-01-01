import { jsPDF } from 'jspdf';

export type DownloadFormat = 'txt' | 'pdf' | 'latex' | 'md';

export interface DownloadOptions {
  text: string;
  fileName: string;
  format: DownloadFormat;
}

/**
 * Convert plain text to formatted LaTeX document
 */
function textToLaTeX(text: string): string {
  // Split text into sections (assuming double newlines indicate sections)
  const sections = text.split(/\n\s*\n/).filter(s => s.trim().length > 0);
  
  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fontspec}
\\setmainfont{Helvetica}

\\titleformat{\\section}
  {\\Large\\bfseries\\color{blue!70!black}}
  {}
  {0em}
  {}
  [\\titlerule[0.5pt]]

\\titleformat{\\subsection}
  {\\large\\bfseries}
  {}
  {0em}
  {}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0.5em}

\\begin{document}

`;

  sections.forEach((section, index) => {
    const lines = section.split('\n').filter(l => l.trim().length > 0);
    const firstLine = lines[0]?.trim() || '';
    
    // Check if first line looks like a section header (all caps, short, or has special chars)
    const isHeader = firstLine.length < 50 && (
      firstLine === firstLine.toUpperCase() ||
      firstLine.match(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/) ||
      firstLine.includes(':')
    );
    
    if (isHeader && lines.length > 1) {
      // This is a section header
      latex += `\\section{${escapeLaTeX(firstLine)}}\n\n`;
      lines.slice(1).forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
          latex += `\\begin{itemize}\n  \\item ${escapeLaTeX(trimmed.replace(/^[•\-\d+\.]\s*/, ''))}\n\\end{itemize}\n\n`;
        } else {
          latex += `${escapeLaTeX(trimmed)}\n\n`;
        }
      });
    } else {
      // Regular paragraph
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
          latex += `\\begin{itemize}\n  \\item ${escapeLaTeX(trimmed.replace(/^[•\-\d+\.]\s*/, ''))}\n\\end{itemize}\n\n`;
        } else if (trimmed.length > 0) {
          latex += `${escapeLaTeX(trimmed)}\n\n`;
        }
      });
    }
  });

  latex += `\\end{document}`;
  return latex;
}

/**
 * Escape special LaTeX characters
 */
function escapeLaTeX(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/\&/g, '\\&')
    .replace(/\#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\_/g, '\\_')
    .replace(/\~/g, '\\textasciitilde{}')
    .replace(/\%/g, '\\%');
}

/**
 * Convert text to formatted PDF using jsPDF
 */
async function textToPDF(text: string): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  // Split text into lines that fit the page width
  const lines = text.split('\n');
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (trimmed.length === 0) {
      yPosition += 5; // Add spacing for empty lines
    } else {
      // Check if line is a header (short, all caps, or has colon)
      const isHeader = trimmed.length < 50 && (
        trimmed === trimmed.toUpperCase() ||
        trimmed.includes(':')
      );
      
      if (isHeader) {
        // Add extra space before header
        if (yPosition > margin) {
          yPosition += 8;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102); // Dark blue
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Black
      }

      // Split long lines
      const splitLines = doc.splitTextToSize(trimmed, maxWidth);
      
      splitLines.forEach((splitLine: string) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(splitLine, margin, yPosition);
        yPosition += 7; // Line height
      });
    }
  });

  return doc.output('blob');
}

/**
 * Convert text to Markdown format
 */
function textToMarkdown(text: string): string {
  const lines = text.split('\n');
  let markdown = '';
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (trimmed.length === 0) {
      if (inList) {
        markdown += '\n';
        inList = false;
      } else {
        markdown += '\n';
      }
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
      // List item
      if (!inList) {
        markdown += '\n';
        inList = true;
      }
      markdown += `- ${trimmed.replace(/^[•\-\d+\.]\s*/, '')}\n`;
    } else {
      // Check if it's a header
      const isHeader = trimmed.length < 50 && (
        trimmed === trimmed.toUpperCase() ||
        trimmed.includes(':')
      );
      
      if (inList) {
        markdown += '\n';
        inList = false;
      }
      
      if (isHeader) {
        markdown += `\n## ${trimmed.replace(':', '')}\n\n`;
      } else {
        markdown += `${trimmed}\n\n`;
      }
    }
  });

  return markdown.trim();
}

/**
 * Download file in the specified format
 */
export async function downloadResume(options: DownloadOptions): Promise<void> {
  const { text, fileName, format } = options;
  const baseName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension

  let blob: Blob;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'txt':
      blob = new Blob([text], { type: 'text/plain' });
      mimeType = 'text/plain';
      extension = 'txt';
      break;

    case 'md':
      const markdown = textToMarkdown(text);
      blob = new Blob([markdown], { type: 'text/markdown' });
      mimeType = 'text/markdown';
      extension = 'md';
      break;

    case 'latex':
      const latex = textToLaTeX(text);
      blob = new Blob([latex], { type: 'application/x-latex' });
      mimeType = 'application/x-latex';
      extension = 'tex';
      break;

    case 'pdf':
      blob = await textToPDF(text);
      mimeType = 'application/pdf';
      extension = 'pdf';
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}.${extension}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

