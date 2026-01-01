# Resume ATS Optimizer

A modern, beautiful Resume ATS Optimizer web app built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, and Groq API. Optimize your resume to pass Applicant Tracking Systems and land more interviews.

## Features

- ✨ **ATS Score Analysis** - Get instant compatibility scores
- 🎯 **Keyword Optimization** - Automatically identify and add missing keywords
- 📄 **Smart Formatting** - ATS-friendly formatting recommendations
- ⚡ **Lightning Fast** - Results in seconds using Groq's fast inference
- 🎨 **Beautiful UI** - FAANG-level design with smooth animations
- 💯 **100% Free** - No credit card, no sign-up required

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **LLM**: Groq API (free tier)
- **Animations**: Framer Motion
- **Deployment**: Vercel (free tier compatible)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Groq API key (free at https://console.groq.com/)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Resumeoptimizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Resume**: Drag and drop your resume (PDF, DOCX, or TXT)
2. **Paste Job Description**: Copy and paste the job description you're applying for
3. **Get Optimized Resume**: Receive an optimized resume with improved ATS score

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variable `GROQ_API_KEY` in Vercel dashboard
4. Deploy!

The app is optimized for Vercel's free tier:
- Uses Edge Functions for faster cold starts
- Streaming responses to handle 10s timeout
- Client-side PDF parsing to minimize serverless calls

## Project Structure

```
resume-ats-optimizer/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Landing page
│   ├── optimizer/
│   │   └── page.tsx           # Main optimizer interface
│   ├── api/
│   │   ├── optimize/          # Edge function for optimization
│   │   └── analyze/           # Edge function for ATS analysis
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn components
│   ├── landing/               # Landing page components
│   ├── optimizer/             # Optimizer components
│   └── shared/                # Shared components
├── lib/
│   ├── groq.ts                # Groq API client
│   ├── pdf-parser.ts          # Client-side PDF parsing
│   ├── prompts.ts             # LLM prompt templates
│   ├── utils.ts               # Utility functions
│   └── types.ts               # TypeScript types
└── public/
```

## API Routes

### `/api/analyze`
Analyzes resume against job description and returns ATS score.

**Request:**
```json
{
  "resumeText": "string",
  "jobDescription": "string"
}
```

**Response:**
```json
{
  "score": 75,
  "missingKeywords": ["React", "TypeScript"],
  "suggestions": ["Add more technical skills"],
  "strengths": ["Good experience"],
  "weaknesses": ["Missing keywords"]
}
```

### `/api/optimize`
Optimizes resume using streaming response.

**Request:**
```json
{
  "resumeText": "string",
  "jobDescription": "string",
  "missingKeywords": ["React", "TypeScript"]
}
```

**Response:** Streaming text of optimized resume

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

