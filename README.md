# AutoAudit - Vehicle History & Dispute Letters

A comprehensive platform for UK drivers providing professional vehicle history reports and expert council ticket dispute letters, featuring a complete referral system.

## Features

### Core Services
- **Vehicle History Reports**: DVLA and CAP HPI data integration
- **Professional Dispute Letters**: AI-enhanced legal document generation
- **Multi-modal Evidence Input**: Photos, voice recordings, and text descriptions

### Referral System
- **User Dashboard**: Track referrals, conversions, and earnings
- **Public Leaderboard**: Gamified referral competition
- **Automated Payouts**: £10 per successful referral conversion
- **Edge Functions**: Serverless backend for referral tracking

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Supabase** for database, authentication, and edge functions
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live updates

### Deployment
- **Netlify** for frontend hosting
- **Supabase** for backend services
- **Environment-based configuration**

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Netlify account (for deployment)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd autocheck
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/20250629152251_icy_bonus.sql`
   - Deploy the edge functions:
     ```bash
     supabase functions deploy generate-referral-code
     supabase functions deploy track-referral
     supabase functions deploy record-conversion
     supabase functions deploy leaderboard
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Deployment to Netlify

1. **Connect your repository to Netlify**
   - Link your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Configure environment variables in Netlify**
   Go to Site settings > Environment variables and add:
   ```
  
   ```

3. **Deploy**
   - Push to your main branch
   - Netlify will automatically build and deploy

## Database Schema

### Core Tables
- **users**: Extended user profiles with referral settings
- **referral_codes**: Unique codes for each user
- **referrals**: Tracks referral relationships and conversions
- **payouts**: Manages referral earnings and payments

### Key Features
- Row Level Security (RLS) for data protection
- Automatic user profile creation on signup
- Referral code generation with collision prevention
- Conversion tracking with payout automation

## API Integrations

### DVLA API
- Vehicle registration lookups
- Driver license verification
- Real-time tax and MOT status

### CAP HPI API
- Vehicle valuations
- Insurance group data
- Comprehensive vehicle history

### PC2Paper API
- Professional letter printing and posting
- Automated council address detection
- Tracked delivery services

## Referral System Flow

1. **User Registration**: Automatic profile and referral code creation
2. **Link Sharing**: Users share personalized referral links
3. **Tracking**: New signups with referral codes are tracked
4. **Conversion**: When referred users make purchases, conversions are recorded
5. **Payouts**: Automatic payout records created for successful referrals
6. **Leaderboard**: Public ranking of top referrers (opt-in only)

## Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure user sessions
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Controlled API access
- **Content Security Policy**: XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Email: support@autoaudit.net
- Documentation: [Link to docs]
- Issues: [Link to issue tracker]