# Portfolio to-do

## Move to Vercel (analytics go-live depends on it)

The live site on AWS still loads gtag.js directly. The new code loads GA4 through GTM only. GTM container GTM-5X3MTQ5R has 17 unpublished changes in Default Workspace, tested and ready.

Do these in order, on the same day:

- [ ] Set `GTM_ID=GTM-5X3MTQ5R` and `SITE_URL=https://jacquelineamoako.com` in the Vercel project's environment variables
- [ ] Deploy the new code to Vercel
- [ ] Within a few minutes: GTM > Submit > Publish the workspace
- [ ] Confirm `page_view` and `view_portfolio_project` in GA4 Realtime
- [ ] Point the domain at Vercel through Cloudflare (create the record in Cloudflare; keep the nameservers on Cloudflare)

Publishing GTM before the deploy counts page views twice. Deploying without publishing loses page views until it is published.

## GA4

- [ ] Register custom dimensions so event parameters show in reports: project_name, project_category, project_slug, button_name, form_name, link_url, link_text, video_name, scroll_depth, destination, contact_method, metric_name, metric_id, metric_value
- [ ] Reconnect the Google Analytics connection with the account that owns property G-7S9X5PWGY1 (it currently returns no accounts)

## Content redesign (lifecycle and growth positioning)

Done on branch `content/recruiter-ready` (2026-11-02): all copy now comes from `lib/site.ts`, `content.json` and the pages, with only verified figures.

- [x] Homepage, About, Portfolio and Contact copy rewritten (role: Lifecycle & Growth Marketer; plain line: "I build websites and automate customer journeys")
- [x] Metadata, social cards and JSON-LD rewritten; removed the invented `priceRange`, "42% average order value" and the "Strategic Growth Consulting" employer
- [x] Unverified numbers removed: 150+ students, 95% success, 15 cohorts, 5+/6+ years, 50+ projects, per-skill years, "340%", "28%", "$100K to $10M"
- [x] Template figures removed from the 17 older case studies (Top N / Nx / % tiles, placeholder 150% / 12k+ / 3 wks / 4.7)
- [x] Footer "Available for projects" changed to "Get in touch"
- [x] "Business Impact" sentences on the older case studies rewritten to say only what each site is and does (no outcome claims)
- [x] Student quotes on About confirmed real by the user
- [ ] Social links in the footer: Instagram `jackieofzera` and X `intelliJay09`. Keep or remove?
- [x] About hero: email and LinkedIn links (CV left off the site, it is not tailored)
- [x] Portfolio cut to 12 entries (2026-11-02, user YES): removed Lovel.ai, GOA Conference, Qualivex, Optimum Property, Image Bloom, Rosemond Prempeh, Royal iTech, Eddy Acquah and all 19 brand-identity pieces; backups in the `.trash-*` folders; their `/portfolio/<slug>` URLs redirect to `/portfolio`. Filter pills removed from the portfolio page. Rows marked in the Notion database "Website portfolio".
- [x] Finest Dietitian added as a case study (`lib/case-studies.ts`), second on the homepage; testimonial is Fredericka's words as sent to the user
- [ ] Real results for the remaining older case studies (user does not control their analytics): needs numbers from her or the clients
- [ ] Move the other older case studies onto the new case study layout (Gwen Addo and Finest Dietitian are done)
- [ ] Delete dead files once you say YES: `components/Introduction.tsx`, `ServicesOverview.tsx`, `SocialProof.tsx`, `TestimonialSection.tsx`, `Preloader.tsx`, `lib/open-graph.ts`, `lib/seo-utils.ts`, `lib/advanced-seo-config.ts`, `lib/authority-building-strategy.ts`, `lib/blog-content-strategy.ts`, `lib/local-seo-ghana.ts`, and the `homepage` and `services` keys in `content.json`. They still carry the old claims.

## Vercel move (staged 2026-11-02, not live)

- [x] Vercel project `portfolio` in team `zeradynamics`, linked to GitHub `intelliJay09/portfolio`, production branch `main`, Node 24.x
- [x] Environment variables set for Production and Preview from `.env.local` (GTM_ID Production only; SMTP_PASSWORD and RECAPTCHA_SECRET_KEY sensitive)
- [x] Domains `jacquelineamoako.com` and `www.jacquelineamoako.com` added (www redirects 308 to the apex); DNS still points at AWS through Cloudflare
- [ ] Merge PR #1 so `main` has this content (it also carries the CSP and GA4-through-GTM commits)
- [ ] Cutover order: production deploy finished, then Cloudflare DNS to Vercel (grey cloud), then publish the GTM workspace, then confirm GA4 realtime (see the analytics memory)
- [ ] Regenerate the reCAPTCHA keys: `.env.local` notes they were exposed in git history

## Housekeeping

- [x] Commit the case study, site-wide fixes and analytics work on a branch (`fix/case-study-and-audit-bugs`, 2026-10-28)
- [ ] Remove the three unused imports on line 17 of app/layout.tsx
- [ ] lib/advanced-seo-config.ts carries an unused GTM/GA snippet generator; delete it once confirmed unused
