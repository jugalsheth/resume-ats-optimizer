import * as pdfjsLib from 'pdfjs-dist';

// Set worker path - use jsdelivr CDN which is more reliable
if (typeof window !== 'undefined') {
  // Use jsdelivr CDN (more reliable than cdnjs)
  // For pdfjs-dist 4.x, use the .mjs worker file
  const version = pdfjsLib.version || '4.10.38';
  // Try .mjs first (for newer versions), fallback to .js
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

export async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Configure PDF.js with better error handling
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      verbosity: 0, // Suppress warnings
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => {
            // Handle both 'str' and 'text' properties
            return item.str || item.text || '';
          })
          .filter((text: string) => text.trim().length > 0)
          .join(' ');
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`Error parsing page ${i}:`, pageError);
        // Continue with other pages
      }
    }

    const result = fullText.trim();
    if (!result || result.length === 0) {
      throw new Error('PDF appears to be empty or contains no extractable text. It may be image-based or encrypted.');
    }

    return result;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
      } else if (error.message.includes('encrypted') || error.message.includes('password')) {
        throw new Error('PDF is password-protected. Please remove the password and try again.');
      } else if (error.message.includes('empty')) {
        throw error; // Re-throw the specific empty error
      }
    }
    
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseTXT(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text.trim();
  } catch (error) {
    console.error('Error parsing TXT:', error);
    throw new Error('Failed to parse text file');
  }
}

export async function parseDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

export async function extractResumeText(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return parsePDF(file);
  } else if (file.type === 'text/plain') {
    return parseTXT(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return parseDOCX(file);
  } else {
    throw new Error('Unsupported file type');
  }
}

