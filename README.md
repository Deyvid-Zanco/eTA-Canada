# IMMI WORLD — private travel application assistance

Next.js application for IMMI WORLD's independent travel-document assistance service. The Canada landing page clearly separates the private US$42 service fee from the official Canadian government fee and does not claim government affiliation or guaranteed approval.

## Local development

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and supply test credentials. Never commit `.env.local`, `.dev.vars`, or production secrets.

## Verification

```bash
npm run lint
npm run build
npm audit
```

## Cloudflare Workers

This is a full-stack application with Next.js Route Handlers. Deploy it to **Cloudflare Workers** through the OpenNext adapter, not as a static Cloudflare Pages export.

```bash
npm run cf:build
npm run preview
```

The application does not use a database. Forms and document attachments are delivered through Resend, payments are handled by Stripe, and no application data is persisted by the site after submission.

See [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) for the production variables, Stripe webhook, Workers Builds settings, and remaining launch checks.
