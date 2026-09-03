/**
 * The absolute origin this invitation is served from.
 *
 * Open Graph and Twitter cards only accept absolute URLs, so getting this
 * wrong is what makes WhatsApp, Facebook and Twitter show a link with no
 * picture. It resolves in order:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — set this when the wedding gets a custom domain.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's stable production domain.
 *    Vercel injects it automatically, so a plain deploy works with no setup.
 * 3. `VERCEL_URL` — the per-deployment URL, so previews get working cards too.
 * 4. localhost, for `next dev`.
 *
 * Vercel's variables carry no scheme, hence the `https://` prefix.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
