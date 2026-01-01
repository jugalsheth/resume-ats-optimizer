# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Build successful (`npm run build`)
- [x] `.gitignore` protects API keys (`.env*.local`, `.env`)
- [x] Code pushed to GitHub: https://github.com/jugalsheth/resume-ats-optimizer

## 🚀 Deploy to Vercel

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `jugalsheth/resume-ats-optimizer`
4. Vercel will auto-detect Next.js settings

### Step 2: Configure Environment Variables

**CRITICAL**: Add your Groq API key before deploying!

1. In the Vercel project setup page, scroll to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add the following variable:

#### Required Environment Variable

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GROQ_API_KEY` | `your_groq_api_key_here` | Production, Preview, Development |

**Where to get your Groq API key:**
1. Go to https://console.groq.com/
2. Sign up/login (free, no credit card)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in Vercel

**Important Notes:**
- ✅ Use the same key for all environments (Production, Preview, Development)
- ✅ The key starts with `gsk_` 
- ✅ Keep it secret - never commit to GitHub (already protected by `.gitignore`)
- ✅ Free tier: 30 requests/minute, 6,000 tokens/minute

### Step 3: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://resume-ats-optimizer.vercel.app` (or your custom domain)

## 🔧 Post-Deployment

### Verify Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify `GROQ_API_KEY` is listed
4. Test your app - try optimizing a resume

### Monitor Usage

- Check Vercel function logs for any errors
- Monitor Groq console for API usage (should stay within free tier)
- Check Vercel analytics for traffic

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### API Errors
- Verify `GROQ_API_KEY` is set correctly in Vercel
- Check Groq console for rate limit errors
- Ensure you're using INSTANT model (free tier compatible)

### Timeout Errors
- All API routes use edge runtime (fast)
- Streaming responses prevent timeout
- If issues persist, check Vercel function logs

## 📊 Free Tier Limits

### Vercel Hobby (Free)
- ✅ 10-second function timeout (we use <8s)
- ✅ Edge functions (we use edge runtime)
- ✅ Unlimited deployments
- ✅ Custom domains

### Groq Free Tier
- ✅ 30 requests/minute
- ✅ 6,000 tokens/minute
- ✅ No expiration
- ✅ No credit card required

## 🎉 You're All Set!

Your app is now live and free forever! Share it with job seekers who need help optimizing their resumes.

