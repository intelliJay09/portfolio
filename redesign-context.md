# Homepage redesign: context

Worktree `/Users/jacqueline/projects/portfolio-worktrees/directions`, branch `design/directions`, uncommitted. Route `/directions/home`, dev server `localhost:4417`. Awwwards mode: contest. Last updated 2026-11-20.

## Where it came from

- 2026-10-28: she asked for a redesign only because the old one read as a copy of another portfolio. Her bar: it must be better, not less. The name behind the cut-out portrait stays.
- 2026-11-19: she asked for three built homepages and ignored every earlier decision. Verdicts: liked the mosaic hero (her portrait as 1,695 email tiles), loved the Archivo wide-caps type from the layers direction and its exploded drawing, called the live-cursor direction gimmicky. `/directions/home` combines them. The full history of rejected directions is in memory: `redesign_history.md`.
- Hard rules from her: no laptop mockups for the work, no grey-box prototypes, no scroll-down-and-back recordings, no chips, bubbles or boxes as UI furniture.

## Page order (a logical recruiter flow)

1. Hero: WebGL scene, the emails scatter, ink wipes to paper, name and portrait.
2. What I do: one sentence whose phrases fill ink as you scroll, then three roles as links. It starts a viewport early (`margin-top: -100svh`) so no empty screen follows the burst.
3. Build the software: Featured work, exactly three (orellahub.com, gwenaddo.com, Vocyx), one sticky stage, names cross-fade, one screen wipes between recordings.
4. Run the journey behind it: ink section, six step rails, a pulse runs them as you scroll. These journeys are Zera client work, a different client from Gwen Addo. Never claim one shared system.
5. Fix what breaks: three big incident headlines whose one word starts broken (gone, drifted, jammed) and settles.
6. Behind the work: full-bleed photo plus teaching and BLUETOWN, two staggered statements.
7. Ask: "What do you need?", live lanes (below).
8. Footer: shares the ink ground with Ask, "Say hello".

## Design system

- Tokens on `.root` in `app/directions/home/home.module.css`: `--ink`, `--bone`, `--paper`, `--signal #f2471a`, `--signal-text #c23006`, `--ink-4`, `--line`, `--ease`, `--gut`. `data-tone="ink"` flips them for ink sections.
- Three type voices in `components/directions/home/type.module.css`:
  - shout: Archivo 125% wide caps, only for the name, the sentence, the work names and "Say hello"
  - voice: Archivo 100% sentence case, weight 500, for statements and incident headlines
  - label: IBM Plex Mono caps
- Rule adopted after "it looks like a template": a heading is a small label, the big type is the content itself. Every section has its own composition. No repeated kicker plus giant heading plus paragraph.
- Accent: her brand is black and white with no accent, so the orange is a design choice she accepted as plausible, not confirmed final. Contrast: 3.09:1 on paper (graphics only), 5.08:1 on ink. Small accent text on paper uses `--signal-text` (4.73:1). She dislikes too much colour, so keep orange to small marks.
- Nav: desktop shows three links (Portfolio, About, Contact; Ask removed 2026-11-25 at her request), hides on scroll down, returns on a paper backdrop on scroll up. Phone has a corner Menu button and a full-screen ink menu, and the logo stays on one line.
- Motion: GSAP ScrollTrigger plus Lenis, sticky stages, no pins. Reduced motion and no-JS show finished states.

## Ask section (rebuilt, approved)

- Two columns on desktop, stacked on phone. The question is the field's label. Three lanes (the three kinds of work) light with the journeys' pulse as she types, and the answer opens under the lit lane.
- The idle field types through the examples itself and lights the lanes. Examples are clickable and type themselves in. Enter moves to "Send this to me".
- Matching is deterministic and runs in the browser (`lib/directions/triage.ts`, 21 tests in `scripts/directions/triage.test.mjs`, no model). Nothing is sent until the visitor sends it.
- Last fixes: long text wraps instead of being cut off, text sits on the field line and grows upward, the send button stays bone (no orange), focus thickens the line instead of colouring it.

## Verified

Last audit: zero flags at 1440 and 390. 41.8 and 53.1 words per 1,000px, display to body 11.4 desktop and 4.8 phone. Lint and tsc clean. Her earlier score was 7.5, with Usability 7.0 as the drag, since fixed. The Ask change after the last audit was CSS only and was not re-audited.

## Portfolio page (`/portfolio`, built 2026-11-20, uncommitted)

- Her calls: show all three kinds of work; of the sites, Twist Night Club and Ghana Optometric Association come off (Command Space stays); the URL stays `/portfolio` for SEO; the nav link reads "Portfolio". Twist and GOA were removed from `content.json` and `LegacyCaseStudy.tsx`, and their old links 308 to `/portfolio` (`next.config.ts`). Their images in `public/images` are still on disk.
- The idea: a sentence is the filter. It is "See what I've built, the journeys I run, and what I've fixed." (2026-11-20: she didn't want the homepage's sentence repeated here). Each phrase is a button. Picking one drains the ink from the other two, folds away the work that doesn't prove it, and switches what's left to that side of itself (Gwen Addo shows her emails under "run", her three incidents under "fix"). Hovering a phrase previews the pick. The pick feeds `path.ts`, so "Say hello" carries it.
- 16 pieces in `lib/directions/portfolio.ts`: Gwen Addo (build, run, fix), Finest Dietitian (build, run), Client journeys (Zera, run), Orella, Vocyx, Cold Recall, Luriel, then the eight sites. Cold Recall and Luriel clips were copied from the main project's `public/videos/apps/` into `public/directions/rec/`. The Gwen ops dashboard clip is in as "Command Center" (her call), and its caption says the numbers are made up for the demo. Twist and GOA screenshots moved to `.trash-*-twist-goa/`. Copy had a humanizer pass. `SiteNav` takes a `zone` (how much scroll the header stays transparent for): 1 on the homepage, 0.1 on the portfolio, so its text never runs under bare nav type.
- Desktop with motion: the list on the left, a sticky stage on the right showing the piece crossing the middle of the screen (wipes up, only its recording plays). Phones, reduced motion and no-JS: each piece carries its own media in the list.
- Shared pieces now used by both pages: `theme.module.css` (tokens), `fonts.ts`, `SiteFooter.tsx`. `SiteNav` sends homepage anchors to `HOME` (in `work.ts`, `/directions/home` until the redesign replaces `/`) from other pages and marks the current page.
- Testimonials (2026-11-20): six pieces carry their client's quote under the caption (Gwen Addo, Finest Dietitian, Command Space, Anabs, Eleven Eleven, Dr. Kotia). `testimonials.json` is the one source, read through `lib/testimonials.ts` by the portfolio and the two structured case studies. With her permission, the five machine-sounding quotes were reworded in plain voice, keeping only what each client said; Fredericka Doku's is word for word.
- Verified 2026-11-20: audit zero flags at 1440 and 390, one h1, no horizontal scroll, no console errors, keyboard and reduced-motion passes, tsc and lint clean.

## Case studies (built 2026-11-25, uncommitted)

- Gwen Addo and Finest Dietitian (`lib/case-studies.ts`) now render through `components/directions/case/CaseStudyPage.tsx` inside the shared `Shell` (fonts, theme, nav, footer), also used by `/portfolio`. Order: name, Build/Run/Fix marks, line, facts, the site in use (Gwen's recording), the situation, Build, Run, Fix, what came of it, still open, the quote, the next case study.
- Signature: Run (`CaseJourney.tsx`, on ink). The stages sit on a rail, a signal pulse runs down it with the scroll and lights each stage, and a sticky screen beside it steps through that stage's emails one at a time (half a screen of scroll each), with when it sends and its subject. A step that sends nothing shows its result, or the site when the step happens there. Phones, reduced motion and no-JS get each stage with its emails in a sideways row.
- Gwen's payment-confirmation and event-morning emails carry a real QR entry ticket, so they are marked `private` and listed by subject only, with a note saying why.
- Fix shows the no-show table (rates as signal bars) and the three incidents from the homepage as native `<details>`.
- Her calls: the legacy case-study copy that implied unmeasured results can go (only what was built stays); Gwen first, then the eight site studies.
- 2026-11-25: Finest's steps that happen on the site carry live captures (`screen` on a stage): the homepage, the booking page (`site-book.webp`) and the site's checkout step (`site-checkout.webp`). The Paystack window itself was not captured: submitting the live form was blocked by the auto-mode check. A single result fills the line ("3 DAYS"), and the quote spans the page with who said it on the left.
- Build section: the words and the phone capture (cut to 4:5) sit side by side and end on the same line (she disliked the gap under the text).
- Site studies use the same template with `situation`, `journey` and `results` left out and a `site.built` list ("What I built"). Command Space is the first (`lib/case-studies.ts`): ten service pages, the homepage brief form, the Work section and logo strip, its directed recording, Tyrone's quote. Timeline reads "2024 to now" (canonical history: Command Space from Jul 2024; the old page said 2023, which was wrong). All ten case studies are on the new template (2026-11-25). The eight website studies go through `siteStudy()` in `lib/case-studies.ts`; every feature listed was checked on the live site that day, and claims the sites don't bear out were dropped (Anabs' virtual tours and "trust indicators", Eleven Eleven's booking engine and video backgrounds, Landmark Homes' galleries and availability status, Dr. Kotia's self-managed CMS). Roles read "I built the website" (no design claims; Command Space: "I built the site and keep it running"). Years are from the old pages. The route renders only `lib/case-studies.ts` (unknown slug: 404) and the sitemap reads the same list. Long names scale to fit a phone (`--fit`, longest word). The dev server on 4417 was restarted on 2026-11-25: one AVIF encode of `emma-kotia-desk.webp` at 1920px had stuck in its memory and hung every later request for it.
- Verified: audit zero flags at 1440 and 390, one h1, no pins, no horizontal scroll, reduced motion and keyboard pass, tsc and lint clean.

## Open

- A test on a real phone (the touch pass so far is emulated).
- Confirm the accent colour is final.
- "Technical support" stays (her call, 2026-11-25).
- Nothing is committed, and nothing gets committed until she says so.

## 2026-11-25, later

- Retired to `.trash-1795597887-old-case-study/` (her YES): `LegacyCaseStudy.tsx`, `CaseStudy.tsx`, `case-study/Journey.tsx`, `CoverReveal.tsx`, `PortfolioFooter.tsx`, plus a backup of `globals.css` before its old case-study block (the `cs-*` motion and the short `ink`/`paper` theme names, used by nothing else) was removed. `components/case-study/ProjectViewTracker.tsx` stays: the new case studies send GA4's `view_portfolio_project` with the same title and category from `content.json`.
- Her rule: links that end in an arrow have no underline ("the arrow is enough"); hover shifts their colour. Links with no arrow (the "Portfolio" breadcrumb, "Show everything", Ask's proof link, the player's Pause) keep theirs. Featured's "Case study" link gained "→".
- Recordings are used wherever one shows real use: Command Space and Finest Dietitian on the portfolio, and Finest Dietitian's case-study opening (`finest-dietitian-demo`). The Gwen Addo and Finest phone clips in the main project scroll down and back up, so the phone stills stay. The other seven sites have no recordings.
- 2026-11-25: every site now has a recording of it in use (public/directions/rec/*-demo.mp4 with posters), played on its case study and its portfolio piece. Made with Playwright takes cut by `scripts/directions/cut-recording.py`, which documents the method. Playwright's video needs an ffmpeg at `~/Library/Caches/ms-playwright/ffmpeg-1013/ffmpeg-mac`; it is a symlink to Homebrew's ffmpeg (same fix as ffmpeg-1011 on 2026-10-28). GirlCode's donation window offers GoFundMe, Paystack and mobile money, so its case study now says all three.

## About page (`/about`, rebuilt 2026-11-25, uncommitted)

- `components/directions/about/` (AboutPage, AboutMotion, about.module.css) inside the shared `Shell`; career data in `lib/directions/about.ts`. Metadata stays in `app/about/layout.tsx`. Old page in `.trash-1795603320-old-about/` with a copy of `content.json` from before its unused `about` block was removed (it held "Founder, Sep 2024", Royal i-tech and the false win-back line).
- Idea: why one person builds, runs and fixes. Signature: her nine roles (the canonical history, re-locked 2026-11-24, matching LinkedIn) drawn in the portfolio's three lanes on a year axis. On desktop with motion the lanes stay sticky beside the list; the role at mid-screen is signal, earlier roles ink, later ones faint, and a cursor marks where it ended. Phones and reduced motion: the lanes drawn complete above the list. Zera sits in Run and Fix.
- Her call (2026-11-25): Command Space is listed with its LinkedIn title, Frontend Developer, part-time. The no-employer-role rule covers the case study, not the work history.
- Teaching: Digitalize for Jobs (GIZ, GEA, 100+ women) with two photos; Girl Code Africa with an 11-second muted clip cut from `gc-teaching-full.mp4` (`public/directions/rec/girlcode-teaching.mp4`, 1.8 MB). Student quotes and the teaching quote from the old page were dropped: no source.
- Win-back corrected on the Gwen case study the same day, to her approved wording: nine came back and paid GHS 14,050; three got the emails; can't say the emails caused it. Never "9 of 114".
- Audit: zero flags at 1440 and 390; 60 words per 1,000px; display to body 11.4; 0 pins; reduced motion and keyboard pass; no console errors.

## Contact (`/contact`, `/contact/success`, `/contact/error`, rebuilt 2026-11-25, uncommitted)

- `components/directions/contact/` inside the shared `Shell`. Old pages in `.trash-1795609053-old-contact/`. `/api/contact`, `hooks/useRecaptcha.ts`, the six required fields, the success and error routes and the GA4 events (`form_submit`, `contact_method_click`) are unchanged.
- The page reads `?message=&about=` from the homepage's Ask on the server, so the form arrives filled. A failed send saves the draft in sessionStorage (`contact-draft`) before going to `/contact/error`; "Try again" restores it, a success clears it. If reCAPTCHA has not loaded (or is blocked), the form says so and gives the email address instead of doing nothing.
- Success and error pages are noindex. The old copy's "within 24hrs" and "consultation" promises were dropped (unverified).
- Tested with `/api/contact` intercepted (no real email sent): empty submit blocked, fail then restore, success, one `form_submit`, draft cleared, reCAPTCHA blocked. Audit: only the 12px label flag on these short pages (system label type; reading text is 17 to 19px).
- Leftovers now unused, awaiting her YES to retire: `components/PagePreloader.tsx`, the old contact styles in `globals.css`, `content.json` `contact` block, `public/images/contact-image.jpg`.

## Contact emails (2026-11-25)

- Templates: `lib/contact-email.ts` (notification to her: subject, sender line, message, Reply button, details in Accra time; confirmation to the sender: thank-you plus what they sent, no reply-time promise). Site look, dark mode, phone width, plain-text versions. Topics live in `lib/directions/contact.ts` (form and emails share them).
- Sending: Resend (`resend@6.37.0`, pinned; `node_modules` is shared with the main project, so it was installed there with `--no-save`). `jacquelineamoako.com` is verified in Resend (eu-west-1). `EMAIL_FROM=hello@jacquelineamoako.com`; `RESEND_API_KEY` in `.env.local`. Each email retries on its own (5 tries) with a Resend idempotency key, so no duplicates. Nodemailer is gone from this worktree's package files.
- Why: the old SMTP server (command-space.com) left 3 of 6 test connections without a greeting, and retries re-sent emails that had already gone out.
- First real Resend send: both emails delivered in 1.4s.
- Before deploy: add `RESEND_API_KEY` and change `EMAIL_FROM` in Vercel at the same moment as the deploy (the live code still sends via SMTP, and `hello@` through that server would fail DMARC p=reject). The `SMTP_*` lines in `.env.local` are now unused.

## Checks and fixes (2026-11-25, evening)

- Nav: Contact now goes to `/contact` (the `#contact` anchor logic is gone). Inner pages (`Shell`, `ground="paper"`) draw the header in plain ink at the top instead of white with `mix-blend-mode: difference`: it looks the same on paper, and contrast checkers can read it. The homepage keeps the blend over its scene.
- Contrast: `--ink-3` went from 52% to 62% ink (4.75:1 on paper, 4.91 on paper-2), the lightest that passes AA for the 12px labels. The emails' grey matches (`#676764`). A Build/Run/Fix mark that doesn't apply is drawn as `::before { content: attr(data-mark) }`: decoration, not text, already hidden from screen readers.
- Recordings: `shared/Recording.tsx` shows the still as a `next/image` (sized, AVIF/WebP, lazy unless `first`) with the video over it, which fades in once playing. It replaces the `poster` attribute (one full-size JPEG, fetched immediately). Used by the case-study cover and About's Girl Code clip. The portfolio's `Shown` still uses posters (that page's largest element is text, and it scores 98). `shared/playWhileSeen.ts` (case study, About) starts videos only after the page `load` event and marks them `data-playing`.
- Portfolio stage: a recording starts when its slide's wipe ends (`animationend`). Starting one mid-wipe cost one frame at every switch (measured 25 to 28 slow frames per scroll, 0 with play delayed). Now a steady 60fps with 0 slow frames.
- Fonts: the root layout's old Inter and Satoshi have `preload: false`, so redesign pages no longer fetch about 150 KB of unused fonts before their first paint. They load only where used (the old homepage and the old 404, until those move).
- `fetchPriority="high"` is passed explicitly with `priority` on hero images (Next 15.5's `priority` adds only the preload).
- The sentence on `/portfolio`: each phrase is balanced (`text-wrap: balance`), and the phone size is `clamp(27px, 8.6vw, 44px)`, so from 320 to 760px every phrase is two even lines ("SEE WHAT / I'VE BUILT,") and from 760 up one line. No more single-word lines.
- CSP `connect-src` now allows `https://*.google-analytics.com https://*.google.com`, Google's documented set for GA4 without ads features. Before, GA4's regional hosts and its `www.google.com/g/collect` fallback were blocked (seen as console errors). The same gap is on main.
- Copy (her approvals, relayed by another session): "At Zera, I built 17 live journeys for clients" on the portfolio and homepage (was "clients of Zera, my company" and "Zera's clients"). Zera's kind is Full-time. The Ask answers for checkouts and automation no longer carry the unsourced 18% and 60% lines.
- Lighthouse mobile (production build, simulated throttling), performance / accessibility / best practices / SEO: portfolio 98/100/100/100, LCP 1.7s. Case studies with a text LCP 96 to 98, LCP 1.5s. Gwen Addo, Finest, Anabs and Landmark (image LCP) 84 to 86, LCP 3.7 to 3.9s. About 83, LCP 3.8s. Contact 96/100/77/100: best practices loses points to reCAPTCHA's third-party cookies. CLS 0 everywhere. With an image LCP, what the simulation still counts is the shared JavaScript (about 240 KB) and GTM (127 KB), which start before the paint. The measured LCP was 100 to 130ms.
- Keyboard: the three Fix write-ups take focus in order, show a 2px ring and open with Enter. Phone (emulated 390px, touch): no sideways scroll, the filter works by tap, no tap target under 24px, the menu's Contact goes to `/contact`, the incidents open on tap. No console errors.
- Audit: Gwen Addo and About have no flags. Portfolio: 83 words in the first view, because the first piece starts in view under the title, the sentence and one line. Command Space: "body 12px" is a misreading (on a short page, the 12px labels outnumber the 17px text).

## About portrait, alive (2026-11-25, night)

- Her feedback: the site "lacks interactivity", the portrait was "too bland and just there", the whole site "too bland... creativity is low". She chose option 1: she comes through the screen.
- The photo is two layers in `public/images/about/`: `portrait-subject.webp` (her, cut out with BiRefNet `birefnet-general-lite` on CPU, edges cleaned with pymatting `estimate_foreground_ml`, checked at 2x on dark and light) and `portrait-plate.jpg` (the office with her filled in, behind her). The script is the method in her flyer notes; at rest the two are the photo. `public/images/about-hero.jpg` is no longer used by the page (kept until she says YES to retire it).
- Motion (`AboutMotion`, any screen with motion): the window opens on arrival and she settles forward. Scrolling lowers the window's top edge to a third of the frame (`clamp(top 70%)` to `top -10%`), so her head and shoulders rise out of it while the office drifts. With a fine pointer, she and the office move at two depths. Her layer is clipped at the frame's sides and bottom, open above (`.stage`). Reduced motion: the still photo.
- `useReveals`: a `[data-clip]` image already in the first view now opens on load (its scrub used to be over before anyone saw it).
- Checked on a production build: 60fps through the effect, no edge of either layer shows at pointer extremes, About Lighthouse 87/100/100/100 (was 83). The dev server's AVIF encoder hung on the 384px versions (same as on 2026-11-25 with emma-kotia); production served them in 0.3s.

## Case-study demos and the craft pass (2026-11-25, night)

- Her rule for new ideas: test them for gimmickiness before building. Rejected on that test: a live email preview on Contact (it mirrors what you type, no room on a phone), page transitions (experimental React in production on Next 15.5, or a hand-rolled version that skips the back button and Firefox), typing chat bubbles, tilt-on-pointer cards. She also left out the post-send email on the success page.
- Case-study covers are directed recordings now, the homepage's player (`home/Directed.tsx`, `home/direct.ts`): captions, a camera that moves in to each step at readable size, step marks to play from, play and pause. They play from the page's load event once a good part is on screen (`DirectedAuto`), never with reduced motion or Save-Data.
- `lib/directions/recordings.ts` is the one source for each recording's duration and steps (the homepage's Gwen Addo player reads it too). Every caption and camera point was read off the recordings one frame a second, then each camera move was checked by rendering what it shows at that moment (contact sheets in the session scratchpad). Prices are as each site shows them.
- The player's still is now a sized `next/image` under the video, not the `poster` attribute (one full-size file fetched at once); the video fades in once it is playing. On a narrow player, a step mark that would sit closer than 24px to the previous one is hidden (by its real box, on every resize); playback still reaches that step.
- Craft pass: `shared/Arrow.tsx` ends every link arrow (13 links): joined to its word by a no-break space, and it leans the way it points on hover or focus (theme.module.css). The two send buttons keep their own arrows. The desktop nav has one underline that rests under the current page and glides to the link pointed at or focused (no script: each link keeps its own). Case-study openings rise in like the portfolio's, one line after another; the name only settles (no fade), so its first paint isn't held back.
- Checked on a production build: every case study 100 accessibility; the player autoplays in view, steps seek, Enter pauses, reduced motion leaves the still; no console errors. Lighthouse runs on this machine swung with swap (the same page measured LCP 1.5s and 3.7s on identical runs), so compare medians.
- Open: the homepage's only accessibility flag is a contrast reading on the "jam" word in Cases, taken mid-animation (it predates this work).
