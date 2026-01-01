/**
 * Client-side job description parser
 * Extracts job description from LinkedIn, Indeed, and other job board URLs
 */

export interface ParsedJobData {
  title?: string;
  company?: string;
  description: string;
  location?: string;
  source: string;
}

/**
 * Parse job description from a URL
 * Uses client-side fetch with CORS proxy if needed
 */
export async function parseJobFromUrl(url: string): Promise<ParsedJobData> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // LinkedIn job posting
    if (hostname.includes('linkedin.com') && url.includes('/jobs/')) {
      return await parseLinkedInJob(url);
    }

    // Indeed job posting
    if (hostname.includes('indeed.com') && url.includes('/viewjob')) {
      return await parseIndeedJob(url);
    }

    // Generic fallback - try to fetch and extract text
    return await parseGenericJob(url);
  } catch (error) {
    throw new Error(`Failed to parse job from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse LinkedIn job posting
 * Note: LinkedIn has strict CORS, so we'll need a proxy or user to paste manually
 */
async function parseLinkedInJob(url: string): Promise<ParsedJobData> {
  // LinkedIn blocks direct access, so we'll return a helpful message
  // In production, you might use a backend proxy
  throw new Error(
    'LinkedIn job postings cannot be directly accessed due to CORS restrictions. ' +
    'Please copy and paste the job description manually, or use our browser extension (coming soon).'
  );
}

/**
 * Parse Indeed job posting
 */
async function parseIndeedJob(url: string): Promise<ParsedJobData> {
  try {
    // Use a CORS proxy for client-side access
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('Failed to fetch job posting');
    }

    const html = data.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract job title
    const titleElement = doc.querySelector('h2.jobsearch-JobInfoHeader-title, [data-testid="job-title"]');
    const title = titleElement?.textContent?.trim() || '';

    // Extract company
    const companyElement = doc.querySelector('[data-testid="job-poster"], .jobsearch-InlineCompanyRating');
    const company = companyElement?.textContent?.trim() || '';

    // Extract job description
    const descriptionElement = doc.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');
    const description = descriptionElement?.textContent?.trim() || '';

    if (!description) {
      throw new Error('Could not extract job description from Indeed posting');
    }

    return {
      title,
      company,
      description,
      source: 'Indeed',
    };
  } catch (error) {
    throw new Error(`Failed to parse Indeed job: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generic job parser - tries to extract text from any URL
 */
async function parseGenericJob(url: string): Promise<ParsedJobData> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('Failed to fetch webpage');
    }

    const html = data.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, nav, header, footer');
    scripts.forEach(el => el.remove());

    // Try to find main content
    const mainContent = doc.querySelector('main, article, [role="main"], .content, #content') || doc.body;
    const text = mainContent.textContent || '';

    if (!text || text.length < 100) {
      throw new Error('Could not extract sufficient content from URL');
    }

    return {
      description: text.trim(),
      source: new URL(url).hostname,
    };
  } catch (error) {
    throw new Error(`Failed to parse generic job: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate if a URL looks like a job posting
 */
export function isValidJobUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    const jobBoardDomains = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'monster.com',
      'ziprecruiter.com',
      'careerbuilder.com',
      'dice.com',
    ];

    return jobBoardDomains.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}

