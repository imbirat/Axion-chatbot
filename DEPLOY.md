# AXION AI - Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Google Cloud Console project
- Vercel account (recommended) or Docker

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key from Groq for basic models | Yes |
| `NVIDIA_API_KEY` | API key from NVIDIA for premium models | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud | Yes |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | Yes |
| `NEXTAUTH_SECRET` | Random string for session encryption | Yes |
| `NEXTAUTH_URL` | Your app URL (e.g., http://localhost:3000) | Yes |

## Setup Steps

### 1. MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Network Access: Allow all IPs (0.0.0.0/0) for development
3. Database Access: Create a user with read/write permissions
4. Get connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/axion-ai?retryWrites=true&w=majority`

### 2. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized origins: `http://localhost:3000`, `https://your-domain.vercel.app`
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`, `https://your-domain.vercel.app/api/auth/callback/google`
8. Copy Client ID and Client Secret

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 4. API Keys

- **Groq**: Sign up at [console.groq.com](https://console.groq.com) and create an API key
- **NVIDIA**: Access via [NVIDIA API Catalog](https://build.nvidia.com/explore/)

### 5. Local Development

```bash
npm install
npm run dev
```

### 6. Vercel Deployment

1. Push code to GitHub
2. Import repo in Vercel
3. Add all environment variables in Vercel project settings
4. Set `NEXTAUTH_URL` to your Vercel deployment URL
5. Deploy!

### 7. Docker Deployment

```bash
docker build -t axion-ai .
docker run -p 3000:3000 --env-file .env.local axion-ai
```

## First Deploy Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Network access configured
- [ ] All environment variables set
- [ ] Google OAuth URIs match deployment URL
- [ ] NextAuth secret generated
- [ ] API keys are valid
- [ ] Build succeeds locally
- [ ] Vercel function timeout set to 300s
