# Cloudflare Deployment Guide

This document explains the deployment architecture and setup for deploying the TicTacToe application to Cloudflare.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                           │
│                     (deployOnCloudflare branch)                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ Push
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GitHub Actions Workflow                        │
│  ┌─────────────────────┐     ┌─────────────────────┐              │
│  │  Deploy Frontend    │     │  Deploy Backend     │              │
│  │  (Next.js → Pages) │     │  (Worker → Workers) │              │
│  └──────────┬──────────┘     └──────────┬──────────┘              │
└─────────────┼───────────────────────────┼─────────────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Cloudflare Pages     │   │   Cloudflare Workers    │
│   (Static + SSR)       │   │   (API + WebSocket)     │
└──────────┬──────────────┘   └──────────┬──────────────┘
           │                             │
           └──────────┬──────────────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  ttt.pantorn.site   │
           │  (CNAME + SSL)      │
           └─────────────────────┘
```

## Components

### Frontend (Cloudflare Pages)
- **Framework**: Next.js 16
- **Build**: `npm run build` outputs to `.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_WS_URL`: WebSocket endpoint

### Backend (Cloudflare Workers)
- **Framework**: Hono with native WebSocket
- **Runtime**: Cloudflare Workers (V8 JavaScript)
- **Build**: esbuild bundles to `dist/index.js`
- **API Endpoint**: `/api` or `/ws` for WebSocket

### Infrastructure (Terraform)
- **Pages Project**: Cloudflare Pages
- **KV Namespace**: Game state storage
- **DNS**: CNAME record for ttt.pantorn.site

## Prerequisites

### 1. Cloudflare Account Setup

You need the following credentials:
- **API Token**: Create at https://dash.cloudflare.com/profile/api-tokens
- **Account ID**: Found in dashboard URL (https://dash.cloudflare.com/[ACCOUNT_ID]/...)
- **Zone ID**: Found in DNS settings for pantorn.site

### 2. GitHub Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Token with Pages, Workers, DNS edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_ZONE_ID` | Zone ID for pantorn.site |

Configure these variables in GitHub:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_WS_URL` | `wss://ttt.pantorn.site/api` |

### 3. API Token Permissions

Create a custom API token with these permissions:
- Account: Cloudflare Pages: Edit
- Account: Workers Scripts: Edit
- Zone: DNS: Edit
- Zone: Zone: Read

## Files Modified

### Backend Changes (`backend/`)

| File | Changes |
|------|---------|
| `package.json` | Removed socket.io, added Cloudflare Workers build scripts |
| `tsconfig.json` | Updated for Cloudflare Workers types |
| `wrangler.toml` | Cloudflare Workers configuration |
| `src/index.ts` | Rewrote for native WebSocket (replaced Socket.IO) |

### Infrastructure (`terraform/`)

| File | Purpose |
|------|---------|
| `providers.tf` | Cloudflare provider configuration |
| `variables.tf` | Input variables (API tokens, account IDs) |
| `main.tf` | Cloudflare Pages, Workers KV resources |
| `outputs.tf` | Output values (URLs, IDs) |
| `dns.tf` | DNS CNAME for ttt.pantorn.site |

### CI/CD (`.github/`)

| File | Purpose |
|------|---------|
| `workflows/deploy.yml` | GitHub Actions workflow for deployment |

## Deployment Flow

### Automatic Deployment (Recommended)

1. Push code to `deployOnCloudflare` branch
2. GitHub Actions automatically:
   - Builds frontend → deploys to Cloudflare Pages
   - Builds backend → deploys to Cloudflare Workers
   - Runs Terraform → configures infrastructure
3. Application available at `https://ttt.pantorn.site`

### Manual Deployment (Development)

```bash
# Frontend
cd frontend
npm install
npm run build
wrangler pages deploy .next --project-name=tictactoe

# Backend
cd backend
npm install
npm run build
wrangler deploy
```

### Terraform Only

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Local Development

### Backend (with Wrangler)

```bash
cd backend
npm run dev
# Access at http://localhost:8787
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev
# Access at http://localhost:3000
```

Note: When developing locally, update `NEXT_PUBLIC_WS_URL` to point to your local backend or the deployed worker URL.

## Environment Variables

### Frontend
| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_WS_URL` | `wss://ttt.pantorn.site/api` | WebSocket endpoint |

### Backend
| Variable | Value | Purpose |
|----------|-------|---------|
| No additional env vars needed | | Uses Cloudflare environment |

## Troubleshooting

### Frontend Build Issues
- Ensure Node.js version is 20
- Check that `.next` folder is created after build

### Backend Deployment Issues
- Ensure `wrangler.toml` is in `backend/` directory
- Check esbuild is installed
- Verify no Bun-specific imports in code

### WebSocket Connection Issues
- Check browser console for errors
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Ensure Worker is deployed and accessible

### DNS Issues
- Verify CNAME record points to correct domain
- Check Cloudflare proxy is enabled (orange cloud)
- Allow time for DNS propagation

## Known Limitations

1. **State Persistence**: Workers are stateless. Game state is stored in-memory and will be lost on worker restart. For production, consider using Durable Objects or KV.

2. **WebSocket Limitations**: Cloudflare Workers have connection limits. For high-traffic applications, consider using Durable Objects.

3. **Build Times**: First deployment may take longer as Cloudflare builds the worker.

## Next Steps

1. Test the deployment locally with `wrangler dev`
2. Push to `deployOnCloudflare` branch
3. Verify GitHub Actions runs successfully
4. Test the application at `https://ttt.pantorn.site`
5. Optionally configure custom domain in Cloudflare dashboard