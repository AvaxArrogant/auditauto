# Deployment Guide

This guide walks you through deploying AutoAudit to Netlify with Supabase backend.

## Prerequisites

- Supabase account and project set up
- Netlify account
- Git repository with your code

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your Project URL and anon key

### 1.2 Run Database Migration
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/migrations/20250629152251_icy_bonus.sql`
3. Run the migration to create all tables and functions

### 1.3 Deploy Edge Functions
If you have Supabase CLI installed:
```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy generate-referral-code
supabase functions deploy track-referral
supabase functions deploy record-conversion
supabase functions deploy leaderboard
```

Or manually create each function in the Supabase dashboard under Edge Functions.

## Step 2: Netlify Deployment

### 2.1 Connect Repository
1. Log in to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

### 2.2 Environment Variables
In your Netlify site dashboard, go to Site settings > Environment variables and add:

**Required Variables:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-publishable-key
```

**Optional API Keys (for full functionality):**
```
VITE_DVLA_API_KEY=your_dvla_api_key_here
VITE_CAP_HPI_API_KEY=your_cap_hpi_api_key_here
VITE_PC2PAPER_TOKEN=your_pc2paper_token_here
VITE_PC2PAPER_SECRET=your_pc2paper_secret_here
VITE_PC2PAPER_API_URL=https://www.pc2paper.co.uk/api
```

**App Configuration:**
```
VITE_APP_NAME=AutoAudit
VITE_APP_URL=https://your-site-name.netlify.app
```

### 2.3 Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## Step 3: Post-Deployment Setup

### 3.1 Update Supabase Auth Settings
1. In Supabase dashboard, go to Authentication > Settings
2. Add your Netlify URL to "Site URL"
3. Add your Netlify URL to "Redirect URLs"

### 3.2 Test Referral System
1. Create a test account
2. Check that referral code is generated
3. Test referral link with `?ref=CODE` parameter
4. Verify dashboard and leaderboard functionality

### 3.3 Configure Custom Domain (Optional)
1. In Netlify, go to Site settings > Domain management
2. Add your custom domain
3. Update environment variables with new domain
4. Update Supabase auth settings with new domain

## Step 4: API Key Setup (Optional)

### 4.1 DVLA API
1. Register at [DVLA Developer Portal](https://developer-portal.driver-vehicle-licensing.api.gov.uk/)
2. Get your API key
3. Add to Netlify environment variables

### 4.2 CAP HPI API
1. Register at [CAP HPI API](https://api.cap-hpi.co.uk/docs/index.html)
2. Get your API key
3. Add to Netlify environment variables

### 4.3 PC2Paper API
1. Register at [PC2Paper](https://www.pc2paper.co.uk/api-and-developers/)
2. Get your token and secret
3. Add to Netlify environment variables

## Troubleshooting

### Build Failures
- Check that all environment variables are set
- Verify Node.js version is 18+
- Check build logs for specific errors

### Authentication Issues
- Verify Supabase URL and anon key are correct
- Check that redirect URLs are properly configured
- Ensure RLS policies are correctly set up

### Referral System Issues
- Verify edge functions are deployed
- Check Supabase function logs
- Test database permissions

### API Integration Issues
- Verify API keys are valid and active
- Check API rate limits
- Review error logs in browser console

## Security Checklist

- [ ] Environment variables are set in Netlify (not in code)
- [ ] Supabase RLS policies are enabled
- [ ] Auth redirect URLs are configured
- [ ] Content Security Policy is properly set
- [ ] API keys have appropriate permissions only

## Monitoring

### Netlify Analytics
- Enable Netlify Analytics for traffic insights
- Monitor build and deployment status
- Set up deploy notifications

### Supabase Monitoring
- Monitor database usage and performance
- Check edge function logs and errors
- Review authentication metrics

### Error Tracking
Consider integrating error tracking services like:
- Sentry
- LogRocket
- Bugsnag

## Backup and Recovery

### Database Backups
- Supabase automatically backs up your database
- Consider setting up additional backup strategies for critical data

### Code Backups
- Ensure your Git repository is properly backed up
- Consider multiple remote repositories

## Performance Optimization

### Frontend
- Images are optimized and properly sized
- Code splitting is implemented via Vite
- Static assets are cached via Netlify

### Backend
- Database queries are optimized
- Indexes are properly set up
- Edge functions are efficient

## Support

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review Netlify and Supabase documentation
3. Check community forums and Discord channels
4. Contact support if needed

Remember to never commit sensitive information like API keys to your repository!