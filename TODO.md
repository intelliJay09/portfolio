# Portfolio to-do

## Move to Vercel (analytics go-live depends on it)

The live site on AWS still loads gtag.js directly. The new code loads GA4 through GTM only. GTM container GTM-5X3MTQ5R has 17 unpublished changes in Default Workspace, tested and ready.

Do these in order, on the same day:

- [ ] Set `GTM_ID=GTM-5X3MTQ5R` in the Vercel project's environment variables
- [ ] Deploy the new code to Vercel
- [ ] Within a few minutes: GTM > Submit > Publish the workspace
- [ ] Confirm `page_view` and `view_portfolio_project` in GA4 Realtime
- [ ] Point the domain at Vercel through Cloudflare (create the record in Cloudflare; keep the nameservers on Cloudflare)

Publishing GTM before the deploy counts page views twice. Deploying without publishing loses page views until it is published.

## GA4

- [ ] Register custom dimensions so event parameters show in reports: project_name, project_category, project_slug, button_name, form_name, link_url, link_text, video_name, scroll_depth, destination, contact_method, metric_name, metric_id, metric_value
- [ ] Reconnect the Google Analytics connection with the account that owns property G-7S9X5PWGY1 (it currently returns no accounts)

## Content redesign (lifecycle and growth positioning)

- [ ] Approve and apply the new homepage, about and metadata copy (through-line: "I build what brings customers in, and what brings them back")
- [ ] Decide: keep or remove the unverified training numbers (15 cohorts, 95% success rate, 3 years teaching, 24+ brands, 6 years)
- [ ] Decide: cut or rewrite the "Why Partner With Me", "Who I Work Best With" and "What Makes My Approach Different" about sections
- [ ] Decide which template figures on the other 17 case studies are real (Top N / Nx / % / growth tiles)
- [ ] Move the other 17 case studies onto the new case study layout (Gwen Addo is done)
- [ ] Footer: "Available for projects" to "Get in touch"

## Housekeeping

- [ ] Commit the case study, site-wide fixes and analytics work on a branch
- [ ] Remove the three unused imports on line 17 of app/layout.tsx
- [ ] lib/advanced-seo-config.ts carries an unused GTM/GA snippet generator; delete it once confirmed unused
