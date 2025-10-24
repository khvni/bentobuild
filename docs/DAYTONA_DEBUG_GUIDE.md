# Daytona Preview Debugging Guide

## Overview

This guide helps you diagnose why Daytona preview might be falling back to mock mode even when `DAYTONA_API_KEY` is configured in your Vercel environment.

## What Changed

We've added comprehensive logging and error handling to help identify the root cause of the issue.

### Modified Files

1. **`/lib/daytonaClient.ts`** - Enhanced `deploySandbox()` function with detailed logging
2. **`/app/api/preview/route.ts`** - Added request/response logging
3. **`/app/api/debug-env/route.ts`** - NEW debug endpoint (dev only)

## How to Use the Debug Information

### Step 1: Check Environment Variables (Local Development)

If you're testing locally first, you can use the debug endpoint:

```bash
# Only works in development mode (NODE_ENV=development)
curl http://localhost:3000/api/debug-env
```

This will show you:

- Whether each environment variable is present
- Length of each variable (NOT the actual value)
- First 8 characters (safe for debugging)
- Runtime environment information

Example response:

```json
{
  "success": true,
  "data": {
    "environment": "development",
    "environmentVariables": {
      "DAYTONA_API_KEY": {
        "present": true,
        "length": 64,
        "prefix": "sk-proj-..."
      }
    },
    "recommendations": []
  }
}
```

### Step 2: Check Vercel Deployment Logs

Since the debug endpoint only works in development mode, for production issues you need to check Vercel logs:

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Deployments"
4. Click on the most recent deployment
5. Go to the "Functions" or "Logs" tab
6. Trigger a preview by clicking the "Preview Site" button in your app
7. Watch for the detailed log output

### Step 3: Interpret the Logs

Look for these key log sections:

#### A. Environment Variable Check

```
=== Daytona Preview Debug Info ===
Timestamp: 2025-10-10T...
Environment: production
API Key present: true
API Key length: 64
API Key prefix: sk-proj-...
=================================
```

**What to check:**

- `API Key present`: Should be `true`
- `API Key length`: Should be > 0 (typical Daytona keys are 64 characters)
- `API Key prefix`: Should show first 8 characters (verify it matches your key)

#### B. SDK Initialization

```
🚀 Initializing Daytona SDK...
✓ Daytona SDK initialized successfully
```

**If you see an error here:**

- API key might be invalid or revoked
- Network issues connecting to Daytona
- SDK version compatibility issues

#### C. Sandbox Creation

```
📦 Creating Daytona sandbox for live preview...
Config: { language: javascript, envVars: { NODE_ENV: production } }
✓ Sandbox created successfully
Sandbox ID: xyz123
```

**If you see an error here:**

- API key might lack permissions
- Daytona account might be out of credits/quota
- Regional availability issues

#### D. Error Details

If deployment fails, you'll see:

```
=== Daytona Deployment Error ===
Error type: Error
Error message: [detailed error message]
Stack trace: [full stack trace]
Error details: [JSON dump of error object]
================================
⚠️ Falling back to mock mode due to error
```

**The error message will tell you exactly what went wrong.**

## Common Issues and Solutions

### Issue 1: API Key Not Found in Vercel

**Symptoms:**

```
API Key present: false
API Key length: 0
⚠️ DAYTONA_API_KEY not found - using mock preview mode
```

**Solutions:**

1. In Vercel dashboard, go to Settings > Environment Variables
2. Add `DAYTONA_API_KEY` with your actual key
3. Select which environments (Production, Preview, Development)
4. **IMPORTANT:** Redeploy your application after adding the variable
5. Verify the variable is present by checking deployment logs

### Issue 2: API Key Present But Invalid

**Symptoms:**

```
API Key present: true
API Key length: 64
❌ Failed to initialize Daytona SDK: [auth error]
```

**Solutions:**

1. Verify your API key is correct in Daytona dashboard
2. Check if the key has been revoked or expired
3. Ensure the key has proper permissions for sandbox creation
4. Try regenerating the API key

### Issue 3: Sandbox Creation Fails

**Symptoms:**

```
✓ Daytona SDK initialized successfully
❌ Failed to create sandbox: [error details]
```

**Solutions:**

1. Check your Daytona account quotas/limits
2. Verify your account is active and in good standing
3. Check if there are any service outages on Daytona's status page
4. Try a different region if available

### Issue 4: Network/Timeout Issues

**Symptoms:**

```
❌ Failed to create sandbox: timeout
❌ Failed to get preview link: network error
```

**Solutions:**

1. Check if Vercel can reach Daytona's API endpoints
2. Verify no firewall rules are blocking the connection
3. Increase timeout values if your sandboxes take longer to spin up
4. Check Daytona's API status

## Vercel-Specific Debugging

### Verify Environment Variables in Vercel

1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Make sure `DAYTONA_API_KEY` is:
   - Present in the correct environment (Production, Preview, Development)
   - Has the correct value (no extra spaces, quotes, or newlines)
   - Is marked as "Encrypted" (Vercel will automatically encrypt it)

### Force Redeploy After Adding Variables

Environment variables are only loaded at build time. After adding/modifying variables:

```bash
# Trigger a new deployment
git commit --allow-empty -m "chore: trigger redeploy for env vars"
git push
```

Or use Vercel CLI:

```bash
vercel --prod
```

### Check Function Logs in Real-Time

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Log into your Vercel account
vercel login

# Stream logs from your deployment
vercel logs [deployment-url] --follow
```

## Testing the Fix

### Local Testing

1. Create a `.env.local` file:

```bash
DAYTONA_API_KEY=your_actual_key_here
```

2. Start the dev server:

```bash
npm run dev
```

3. Check the debug endpoint:

```bash
curl http://localhost:3000/api/debug-env
```

4. Try creating a preview and watch the console logs

### Production Testing

1. Deploy to Vercel with environment variables set
2. Open your deployed app
3. Try creating a preview
4. Check Vercel function logs for detailed debug output
5. Look for the specific error messages in the logs

## What to Report

If you're still experiencing issues after following this guide, please report:

1. **Environment Variable Status** (from logs):
   - Is DAYTONA_API_KEY present?
   - What is its length?
   - What is the prefix? (first 8 chars)

2. **Error Messages** (from logs):
   - Exact error type
   - Full error message
   - Stack trace if available

3. **Where It Fails** (from logs):
   - During SDK initialization?
   - During sandbox creation?
   - During file upload?
   - During preview link generation?

4. **Platform Info**:
   - Vercel deployment URL
   - Vercel region
   - Node.js version (from logs)

## Security Notes

- The debug endpoint (`/api/debug-env`) **only works in development mode**
- It never exposes actual API key values, only metadata
- Production logs may contain sensitive info - be careful when sharing
- Never commit actual API keys to your repository

## Additional Resources

- [Daytona Documentation](https://www.daytona.io/docs)
- [Daytona Dashboard](https://www.daytona.io/dashboard)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Quick Checklist

Before opening a support ticket, verify:

- [ ] `DAYTONA_API_KEY` is set in Vercel environment variables
- [ ] Environment variable is assigned to the correct environment (Production/Preview)
- [ ] You've redeployed after setting the environment variable
- [ ] API key is valid and active in Daytona dashboard
- [ ] Your Daytona account has available quota/credits
- [ ] You've checked the Vercel function logs for specific error messages
- [ ] The error logs show `API Key present: true`
- [ ] You've tried the local development test first

## Summary

The enhanced logging will now show you **exactly** where and why the Daytona preview is failing. Look for the detailed error messages in your Vercel function logs to identify the root cause. The most common issue is that the environment variable isn't actually available at runtime, even if it's set in the Vercel dashboard - this requires a fresh deployment.
