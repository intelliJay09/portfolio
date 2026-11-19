# Portfolio to-do

State on 2026-11-02: the recruiter-ready content pass, the move to Vercel and the GTM cutover are done and live on jacquelineamoako.com. Design work is parked (the user rejected the three lab directions and will do the redesign later). The items below are for the next agent.

## Rules for whoever picks this up

- Content and cleanup only until the user restarts design. Keep the current palette and visuals.
- Only verified numbers on the site. Never add invented or industry-typical results.
- Never delete files without showing exact paths and getting a YES; move to `.trash-<timestamp>/` instead.
- Commit or push only when the user asks. `main` deploys straight to production on Vercel.
- Analytics is GA4 through GTM only. IDs come from env vars.
- DNS lives in Cloudflare. Never change nameservers without asking.
- Canonical work history: `/Users/jacqueline/Documents/jobs/context.md` (section "Portfolio site" has the current state).

## Open: analytics

- [ ] GA4 access: the live site sends `page_view` to `G-7S9X5PWGY1` (checked, Google returns 204), but the GA4 property is not visible to the service account `marketing-mcp-sa@jl-marketing-mcp.iam.gserviceaccount.com` (it only sees Finest Dietitian). The ID comes from a Jan 2026 commit by jacque.amoako@gmail.com, so the property is probably under that Google account. User action: in GA4 Admin > Property access management on that property, add the service account as Viewer. Then confirm `page_view` and `view_portfolio_project` in realtime through the analytics tool.
- [ ] Register GA4 custom dimensions so event parameters show in reports: project_name, project_category, project_slug, button_name, form_name, link_url, link_text, video_name, scroll_depth, destination, contact_method, metric_name, metric_id, metric_value
- [ ] Optional: the Finest Dietitian GA4 property (finestdietitian.com) is readable by the service account. It could supply real traffic or lead numbers for that case study if the user wants them.

## Open: needs a decision from the user

- [x] `components/ImageProtection.tsx` removed (moved to `.trash-1795080903-cleanup/`), 2026-11-19
- [x] `app/page.tsx` (dynamic imports) and `package.json` (browserslist) kept after a clean production build, 2026-11-19. Still uncommitted.
- [ ] Old AWS server: she is keeping it for now. Revisit once the Vercel site has been stable for a few days.

## Open: verification

- [ ] Confirm the contact-form test email ("Contact form test after the Vercel move", sent 2026-11-02 11:2x) reached hello@jacquelineamoako.com. The site showed "Message Delivered", but the inbox was not checked.
- [ ] Email records after the nameserver change: the comparison of TXT records (SPF, DKIM `mail._domainkey`, `_dmarc`, `_mta-sts`, `_smtp._tls`) between the old zone (lloyd and zelda) and the new zone (elinore and sri) timed out and was never finished. The screenshot showed them present in the new zone. Verify with `dig +tcp TXT` against the public resolvers and send a test email to and from the domain.
- [ ] Contact mail is sent through the command-space.com SMTP account (her employer's server). Consider moving to her own mail provider; update the SMTP_* variables in Vercel.
- [ ] Local `.env.local` still has the old reCAPTCHA pair if she did not update it; Vercel has the new pair (set 2026-11-02).

## Open: content

- [ ] Real results for the older case studies: she has no numbers and asked for "general consensus" figures. Declined, since they would read as her clients' results. Only real figures from clients or their analytics (Search Console or GA4 access) may go in.
- [ ] Move the other older case studies onto the new case study layout (`lib/case-studies.ts` plus `components/case-study/CaseStudy.tsx`). Gwen Addo and Finest Dietitian are done.
- [ ] Eleven Eleven Ghana and Anabs were corrected to WordPress in `content.json` after probing the live sites. Revert if she says she rebuilt them in Next.js.
- [ ] Gwen Addo card: she said keep the stack as it is (it says Next.js and Vercel while gwenaddo.com is still WordPress). No change.

## Open: quality (found 2026-11-02)

- [ ] Home page mobile Lighthouse is 67 performance (LCP 4.8 s) because the preloader holds the page for about 5 seconds. A design decision, so it waits for the redesign. Other scores: home accessibility 100, best practices 100, SEO now fixed; Finest Dietitian page 95 / 96 / 100 / 92.
- [x] Lint errors and warnings in `hooks/`, `app/`, `components/`, `lib/` and `utils/` fixed, 2026-11-19. `scripts/` and `app/lab/` still have old errors.
- [x] Unused imports in `app/layout.tsx` gone (ImageProtection import removed too)
- [x] Renamed to `public/images/ghana-optometric-association-main.png`, references updated
- [x] Build noise fixed: `detectServerTheme` swallowed Next's dynamic-usage error, now rethrown with `unstable_rethrow`
- [ ] Not run: the Awwwards audit script and juror scorecard (design is parked).
- [ ] Leftover untracked items from the design phase: `app/lab/`, `components/lab/`, `styles/lab.css`, `public/images/lab/`, root screenshots (`eddy-admin-login.png`, `eddy-hero.png`, `review-home-desktop.png`), `app/favicon.ico` and the `.trash-*` folders. `public/images/eddy-hero.jpg` and `eddy-admin.jpg` are still used by the parked lab components. Delete or commit only with the user's YES.

## Done (2026-11-02)

- [x] Recruiter-ready content: homepage, About, Portfolio and Contact rewritten for Lifecycle & Growth Marketer; metadata, social cards and JSON-LD from `lib/site.ts`; unverified numbers and template figures removed; "Business Impact" sentences and "What I Built" lists on the older case studies
- [x] Portfolio cut to 12 entries (Lovel.ai, GOA Conference, Qualivex, Optimum Property, Image Bloom, Rosemond Prempeh, Royal iTech, Eddy Acquah and the 19 brand-identity pieces removed; old URLs redirect to `/portfolio`; kept in her Notion database "Website portfolio")
- [x] Finest Dietitian added as a case study, second on the homepage
- [x] About hero: email and LinkedIn (no CV on the site); socials are LinkedIn, GitHub `intelliJay09` and Instagram `jackieofzera` (X dropped)
- [x] Dead components, lib files and the `homepage` and `services` keys moved to `.trash-*`
- [x] Unlinked `app/test` and `app/web-test` pages moved to `.trash-*`
- [x] Vercel project `portfolio` (team `zeradynamics`, Node 24, production branch `main`), env vars set, domains added, www redirects to the apex
- [x] PR #1 merged; Cloudflare records set (A 216.150.1.1 and 216.150.16.1, www CNAME to Vercel, DNS only); nameservers changed at Namecheap to elinore and sri; HTTPS live
- [x] GTM version 3 "GA4 via GTM, portfolio move" published (version 2 is the rollback); the site loads GTM only, no direct gtag.js
- [x] reCAPTCHA keys regenerated and set in Vercel; contact form tested end to end on the live domain
- [x] Production console debug logs silenced, `en-GB` hreflang (404) removed, metadata forced into the head via `htmlLimitedBots`, "Learn More" link renamed (commit cc866b9)
- [x] 23 internal links and 40 local images checked on the live site, no broken ones
