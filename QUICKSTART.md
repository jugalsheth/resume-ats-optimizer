# Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```
   
   Get your free API key from: https://console.groq.com/

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## Testing the App

1. Go to http://localhost:3000/optimizer
2. Upload a resume (PDF, DOCX, or TXT)
3. Paste a job description
4. Click "Start Optimization"
5. View your optimized resume and ATS score!

## Deployment to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Add environment variable `GROQ_API_KEY` in Vercel dashboard
4. Deploy!

The app is optimized for Vercel's free tier with Edge Functions.

## Troubleshooting

### Build Errors
- Make sure you have Node.js 18+ installed
- Run `npm install` to ensure all dependencies are installed
- Check that `.env.local` exists (it's gitignored, so create it manually)

### API Errors
- Verify your `GROQ_API_KEY` is set correctly
- Check that you haven't exceeded Groq's rate limits (free tier: ~30 req/min)
- Ensure the API key is valid at https://console.groq.com/

### PDF Parsing Issues
- Make sure the PDF is not password-protected
- Try with a simpler PDF first
- DOCX and TXT formats are also supported

## Features

✅ ATS Score Analysis  
✅ Keyword Optimization  
✅ Smart Formatting Suggestions  
✅ Side-by-side Comparison  
✅ Download Optimized Resume  
✅ Beautiful, Modern UI  
✅ Fully Responsive  

Enjoy optimizing your resume! 🚀

