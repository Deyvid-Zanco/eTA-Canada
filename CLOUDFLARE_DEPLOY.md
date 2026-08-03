# Cloudflare production preparation

This application must be deployed as a **Cloudflare Worker**, not as a static Pages export. It uses Next.js route handlers for Stripe, Resend, reCAPTCHA, and application sessions.

## Local checks

```bash
npm ci
npm run lint
npm run build
npm run cf:build
npm run preview
```

`npm run preview` runs the generated application in the Cloudflare `workerd` runtime. Copy `.dev.vars.example` to `.dev.vars` and insert test credentials before testing payment or form submission locally.

## Cloudflare Workers Builds

- Worker name: `eta-canada`
- Build command: `npm run cf:build`
- Deploy command: `npx @opennextjs/cloudflare deploy -- --keep-vars`
- Production branch: choose the repository's protected production branch.
- Enable the Cloudflare Managed Ruleset/WAF before attaching the production domain.

Configure the `NEXT_PUBLIC_...` values in **Build variables and secrets** so Next.js can inline them. Also configure the values used by server routes in **Runtime variables and secrets**. The server-only secrets in this project are not required during the build and should remain runtime-only.

Public variables:

- `NEXT_PUBLIC_SITE_URL` — exact canonical production origin, with HTTPS and no trailing slash.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe live publishable key.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — reCAPTCHA key authorized for the production domain.
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase publishable/legacy anon key; safe only with correct grants and RLS.

Runtime secrets (Cloudflare **Secret** type):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RECAPTCHA_SECRET_KEY`
- `RESEND_API_KEY`

Runtime text configuration:

- `STRIPE_PRICE_ID` — Canada one-time price; `STRIPE_CANADA_PRICE_ID` is also accepted as a fallback.
- `STRIPE_PHILIPPINES_PRICE_ID`
- `ADMIN_EMAIL`
- `ADMIN_PANEL_ENABLED` — keep `false`; the current legacy admin must not be exposed.

`STRIPE_PRICE_ID`, `STRIPE_PHILIPPINES_PRICE_ID`, `ADMIN_EMAIL`, and `ADMIN_PANEL_ENABLED` are runtime configuration but do not contain credentials, so they may be ordinary text variables. API keys and webhook/captcha signing secrets must use Cloudflare's encrypted **Secret** type.

Never place a Stripe secret, Resend key, reCAPTCHA secret, Supabase service-role key, or Cloudflare token in `wrangler.jsonc` or any `NEXT_PUBLIC_` variable.

## External dashboard checklist

1. Stripe: confirm `STRIPE_PRICE_ID` points to a live one-time US$42 price, configure any Philippines price separately, create the production webhook endpoint at `https://www.immi-world.com/api/stripe/webhook`, subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and store its signing secret as `STRIPE_WEBHOOK_SECRET`.
2. Resend: verify `immi-world.com`, its SPF/DKIM records, and every `from` address used by the application.
3. reCAPTCHA: authorize `www.immi-world.com`, the apex domain, and the temporary Workers preview hostname if previews will submit forms.
4. Supabase: enable RLS and least-privilege grants on every exposed table and storage bucket before supplying the production project URL/key.
5. Cloudflare: attach the custom domain only after the Worker preview passes checkout, webhook, form, email, and mobile tests.

## Production blockers

- The legacy `/admin` implementation performs password hashing and session handling in the browser. It is disabled by middleware unless `ADMIN_PANEL_ENABLED=true`; keep it disabled until authentication is moved server-side (preferably Supabase Auth with authorization backed by app metadata and RLS).
- Supabase RLS and storage policies cannot be verified from this repository alone; they must be inspected in the connected Supabase project.
- Google Ads approval cannot be guaranteed by deployment. Canada eTA assistance advertisers still need the applicable Google certification and advertiser verification.
