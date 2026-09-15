# HEADING NORTH — Product Architecture

Phase 1 deliverable. Everything built in this repository is derived from this document.
Audience: the delivery team and the Heading North owner reviewing scope.

---

## 1. Audit of the existing site (headingnorth.fi, captured 14 Sep 2026)

WordPress (Astra + WPForms). 11 public URLs. Visually generic (blue buttons, 2-column card grid, centered
body text), but the **content is honest, specific and well-scoped** — it is the source of truth.

### 1.1 Current information architecture

```
Home
Tours ▾ ─ Aurora Hunting · Ranua Wildlife Park · Korouoma Frozen Waterfall Adventure · Levi Experience
About Us
FAQ
Contact
(footer) Terms & Cancellation · Privacy Policy
```

### 1.2 Business facts extracted (verbatim sources in `src/payload/seed/content/*`)

| Fact | Value | Source page |
|---|---|---|
| Company | HEADING NORTH, local tourism company based in Rovaniemi | About |
| Business ID | 3536358-1 | Privacy |
| Email | info@headingnorth.fi | Contact |
| WhatsApp | +358 44 246 2427 | Contact |
| Location | Rovaniemi, Finland | Contact |
| Group size | Maximum 4 guests (all experiences) | Everywhere |
| Pickup | Complimentary from selected Rovaniemi locations; outside area may carry a fee, confirmed in advance | FAQ, tours |
| Cancellation | Free up to 24 h before start; later / no-show non-refundable | Terms |
| Aurora Hunting | 3–4 h · from €79/person · sausages + hot berry drink included · no sighting guarantee | Tours, detail |
| Ranua Wildlife Park | 5–6 h · from €99/person · park tickets NOT included | Tours, detail |
| Korouoma | 6–7 h · from €109/person · ~6 km demanding winter hike | Tours, detail |
| Levi | 3 options: Rovaniemi→Levi €250/group, Levi→Rovaniemi €250/group, return day €400/group · luggage welcome one-way | Tours, detail |

### 1.3 Gaps (seeded as clearly-marked placeholders, never invented)

- **Testimonials** — none exist. Collection ships empty (one unpublished example doc explains how to add real reviews).
- **Itineraries, seasons, difficulty** (except Korouoma), **hero video, galleries** — not published. Fields exist; sections auto-hide when empty.
- **Social links, street address, phone (non-WhatsApp)** — not published. Settings fields left empty; UI hides them.
- **About: safety, sustainability, team** — not published. Seeded as **hidden** page sections containing `PLACEHOLDER` copy for the owner to complete and un-hide.
- **Photography** — the current imagery is mostly AI-generated (one image is captioned as such) plus two Pexels photos. It is imported with honest credits so the site works on day one. **Commissioned photography/footage is the single biggest quality lever for this brand.**
- **Pricing on Ranua/Korouoma detail pages** — only on the Tours overview page. Migrated from there.

---

## 2. Improved sitemap

```
/                              Home                  (Pages: "home", block-composed)
/experiences                   Experience index      (Pages: "experiences" + experience-showcase block)
/experiences/[slug]            Experience detail     (Experiences collection → fixed premium template)
/about                         About                 (Pages)
/faq                           FAQ                   (Pages + searchable FAQ block)
/contact                       Contact               (Pages + contact-form block)
/terms                         Terms & Cancellation  (Pages, legal template)
/cancellation                  Cancellation summary  (Pages, legal template)
/privacy                       Privacy Policy        (Pages, legal template)
/journal, /journal/[slug]      Future-ready          (Journal collection; unlinked until content exists)
/admin                         Payload admin
```

Legacy WordPress URLs 301-redirect to their new homes (`next.config.ts → redirects`):
`/tours → /experiences`, `/aurora-hunting → /experiences/aurora-hunting`, `/about-us → /about`,
`/terms-cancellation → /terms`, `/privacy-policy → /privacy`, etc. This preserves existing search equity.

Primary nav: **Experiences · About · FAQ · Contact** + persistent **Book now** CTA (all CMS-managed).
"Home" is the logo — a separate Home item wastes the most valuable nav slot.

---

## 3. The ten questions → where each is answered

| Visitor question | Answered within | Component |
|---|---|---|
| What is Heading North? | Home hero, first viewport | `HeroBlock` statement |
| Where do you operate? | Home hero eyebrow "Rovaniemi · Finnish Lapland" + Chapter 01 | Hero eyebrow |
| What experiences? | Home Chapter 03, nav, `/experiences` | `ExperienceShowcase` |
| Why choose you? | Home "principles" (max 4 guests, pickup, personal) | `StatsBlock` / `SplitBlock` |
| What does it feel like? | Detail hero + story + gallery | `ExperienceHero`, `Gallery` |
| How much? | Showcase rows AND detail quick facts, above the fold on mobile | `ExperienceFacts` |
| What's included? | Detail page, second screen | `IncludedList` |
| Pickup? | Detail quick facts + dedicated pickup section + FAQ | `PickupPanel` |
| Can I trust you? | Business ID/footer, honest disclaimers, terms, testimonials when real | `Footer`, `Notice` |
| How do I book? | Sticky mobile booking bar on detail pages, header CTA everywhere | `BookingBar`, `HeaderCta` |

**Rule:** price, duration and group size are never more than one scroll away on any experience surface.

---

## 4. User journeys

1. **Aurora-first traveller (mobile, in Rovaniemi, evening).** Search → `/experiences/aurora-hunting` →
   sticky bar shows "From €79 · 3–4 h · Book" → contact form opens with experience preselected → WhatsApp link as instant alternative.
2. **Planner (desktop, weeks ahead).** Home → cinematic chapters → showcase → compares 2–3 experiences
   (facts row identical structure on each) → FAQ (pickup, clothing) → enquiry with date + guests.
3. **Levi transfer traveller.** Needs route + luggage answer fast → Levi page lists three **options** as
   comparable rows (route, price per group, capacity) → luggage notice → enquiry.
4. **Owner/editor.** `/admin` → dashboard shows new enquiries → marks "In progress" → edits a price →
   previews draft → publishes. No developer.

---

## 5. Content model (Payload collections & globals)

`●` = versioned with drafts/autosave · `◆` = editorial workflow (Draft → Review → Published → Archived)

| Slug | Type | Purpose | Notes |
|---|---|---|---|
| `users` | auth | Admin / Editor / Author | login lockout, role field |
| `media` | upload | Images & video | alt required, credit, caption, folder, featured; responsive sizes + WebP |
| `experiences` | ● ◆ | Core product | facts, pricing, **options** (Levi), included/not-included, bring, highlights, itinerary, pickup, notices, gallery, booking, SEO, joins → FAQs & Testimonials |
| `faqs` | ● ◆ | Q&A | category → `faq-categories`, related experiences (this IS the "ExperienceFAQs" relation, surfaced as a join tab on each experience) |
| `faq-categories` | collection | General, Booking, Pickup… | orderable |
| `testimonials` | ● ◆ | Guest reviews | experience relation, rating, featured, order |
| `pages` | ● ◆ | Block-composed pages | layout blocks, hide-per-block, SEO |
| `contact-submissions` | collection | Enquiries | status NEW/IN PROGRESS/RESPONDED/CLOSED, internal notes; public cannot read |
| `journal` | ● ◆ | Future blog | not linked in nav by default |
| `navigation` | global ● | Header, CTA, footer columns | links reference pages/experiences or custom URLs |
| `site-settings` | global ● | Branding, theme colours, contact, SEO defaults, analytics, booking defaults, footer | admin-only edit |

"SEO" is a reusable field group (Payload SEO plugin UI + canonical/OG/robots extensions) on
pages, experiences and journal, with defaults in `site-settings`.

### 5.1 Roles

| | Admin | Editor | Author |
|---|---|---|---|
| Content (experiences, FAQs, testimonials, pages, journal, media) | full | full | create; edit own; no delete |
| Publish | ✓ | ✓ | ✗ (can submit for Review) |
| Navigation | ✓ | ✓ | read |
| Site settings | ✓ | read | read |
| Enquiries | ✓ | ✓ | ✗ |
| Users | ✓ | ✗ | own profile |

---

## 6. Design system — "Polar Editorial"

### 6.1 Idea
Two light conditions of the Arctic: **Polar Night** (ink, near-black blue) and **Snow Light**
(warm paper white). Pages move between them like the day itself. Colour comes from photography,
not UI chrome. One accent — **Aurora** — used like a signal flare: focus rings, active states,
the index numbers. No gradients on UI, no glass, no rounded-card grids.

### 6.2 Colour tokens (defaults; every value is overridable in Site Settings → Theme)

| Token | Default | Role | Contrast |
|---|---|---|---|
| `--hn-ink` (primary) | `#0B1016` | Polar night surfaces, text on snow | 16.8:1 on snow |
| `--hn-snow` (background) | `#F2F0EA` | Snow-light surfaces | — |
| `--hn-text` | `#0B1016` | Body text on snow | 16.8:1 |
| `--hn-frost` (secondary) | `#A9B6C0` | Secondary text on ink, rules | 9.2:1 on ink |
| `--hn-aurora` (accent) | `#9BE7C4` | Signals on ink only (1.3:1 on snow — never use it there) | 13.3:1 on ink |
| derived muted (on snow) | ink @ 64% | Secondary text on snow | 5.5:1 |
| derived muted (on ink) | snow @ 64% | Secondary text on ink | 7.2:1 |

Theme colours are validated as hex in the CMS and injected as CSS variables at the root layout;
components only ever reference tokens.

### 6.3 Typography (two families, self-hosted via `next/font`)

- **Display — Schibsted Grotesk** (a grotesk drawn for a Nordic publisher; editorial DNA, tight at size).
- **Body — Inter** (variable; tabular numerals for prices, indices, facts).

Fluid scale (`clamp`, 360 → 1920 px):

| Token | Size | Leading | Tracking | Use |
|---|---|---|---|---|
| `display-2xl` | 4.5 → 15 rem | 0.86 | −0.045em | Hero word ("NORTH.") |
| `display-xl` | 3.25 → 9 rem | 0.9 | −0.04em | Chapter titles |
| `display-lg` | 2.5 → 5.5 rem | 0.95 | −0.03em | Section titles |
| `display-md` | 1.875 → 3.25 rem | 1.02 | −0.02em | Experience titles |
| `title` | 1.375 → 1.75 rem | 1.2 | −0.01em | Card titles, quotes-small |
| `lead` | 1.125 → 1.5 rem | 1.45 | −0.005em | Intros |
| `body` | 1 → 1.0625 rem | 1.65 | 0 | Reading text (max 68ch) |
| `label` | 0.6875 → 0.75 rem | 1.2 | +0.14em, uppercase | Eyebrows, chapter labels, facts |

### 6.4 Space, grid, shape

- 4 px base. Scale: 1 2 3 4 6 8 12 16 24 32 (×4 px). Section rhythm `--hn-section: clamp(5rem, 11vw, 11rem)`.
- Grid: 4 col (mobile, 16 px gutters, 20 px margins) · 8 col (tablet) · 12 col (≥1024 px, 24 px gutters, margins `clamp(20px, 4vw, 64px)`). Max content 1600 px; full-bleed media ignores it.
- Radius: 0 for media and sections, 2 px for inputs, full-pill only for the primary CTA.
- Rules: 1 px hairlines at 16% opacity. Grain: a 3% SVG noise overlay on ink surfaces only.

### 6.5 Breakpoints
`sm 480` large mobile · `md 768` tablet · `lg 1024` laptop · `xl 1440` desktop · `2xl 1920` large desktop.

---

## 7. Component inventory

**UI primitives** (`components/ui`, shadcn/ui on Radix, restyled): Button, Link-button, Accordion, Dialog/Sheet,
Input, Textarea, Select, Label, Badge, Skeleton, Separator, VisuallyHidden.

**Navigation**: Header (transparent over heroes → solid on scroll, hides on scroll-down), MobileMenu (full-screen sheet, large type, focus-trapped), Footer (editorial, giant wordmark), Breadcrumbs, SkipLink.

**Experience**: ExperienceIndexRow (numbered editorial row with cursor-follow image on desktop, stacked image on touch), ExperienceFacts, ExperienceOptions (Levi), IncludedList, PickupPanel, Itinerary, Notice, Gallery (+ lightbox dialog), BookingBar (sticky mobile), RelatedExperiences.

**Sections (CMS blocks)**: Hero, VideoHero, Chapters (scroll story), CinematicSequence, ImageText, FullBleedImage, ExperienceShowcase, Testimonials (editorial / carousel / minimal), FAQ (search + filter), Gallery, CTA, RichText, Stats, Timeline, ImageGrid, Split, Quote, Newsletter (placeholder-safe), ContactForm, Legal.

**Animation primitives** (`components/animations`): Reveal, TextReveal (line mask), ParallaxMedia, ChapterScroller (GSAP pin), ImageSequence (canvas), HorizontalScroller, MagneticButton, PageTransition, MotionProvider (reduced-motion gate).

---

## 8. Page layouts

**Home** — Hero (fullscreen photo, "GO NORTH." wordmark-scale headline, Rovaniemi eyebrow, 2 CTAs) →
Chapters 01–04 (pinned editorial story; Ch.03 hands off to the showcase) → Experience showcase (numbered rows) →
Principles (max 4 guests / pickup / personal) → Testimonials (auto-hidden if none) → FAQ highlights → Final CTA.

**Experience detail** — Hero (title bottom-left, facts ribbon) → Intro + Quick facts → Story → Gallery →
Highlights → Options (if any) → Itinerary (if any) → Included / Not included → What to bring → Pickup →
Price → Important information → Testimonials (if any) → FAQ (joined) → Booking CTA → Related.
Mobile: sticky booking bar appears after the hero leaves the viewport.

**FAQ** — Intro → search field + category chips → grouped accordions (each item has `#anchor`, copy-link) → CTA.

**Contact** — split: left editorial intro + direct channels (email, WhatsApp, location, pickup note);
right form. Map below loads only on click (no third-party cookies before consent).

**Legal** — narrow reading column, sticky table of contents on desktop, "Last updated" meta.

---

## 9. Motion principles

1. **Motion follows the camera, not the UI.** Movement suggests landscape — slow drift, depth, light — never bounce.
2. **One hero moment per screen.** A section may have one signature motion; everything else is a quiet reveal.
3. **Easing:** `expo.out` (`cubic-bezier(0.16,1,0.3,1)`) for reveals; `none` (linear) only for scroll-scrubbed timelines. No springs with overshoot.
4. **Durations:** micro 180 ms · UI 320 ms · reveal 900 ms · chapter scrub = scroll-length.
5. **Scroll-linked only where it tells story:** Home chapters, cinematic sequence, hero parallax. Never on forms or legal pages.
6. **Tools:** GSAP ScrollTrigger for pinning/scrubbing; Motion for UI state (menu, accordion, dialogs, page transition).
7. **Three behaviours for every animation:**

| | Desktop | Mobile/touch | `prefers-reduced-motion` |
|---|---|---|---|
| Hero | slow scale 1.08→1 + parallax | scale only | static |
| Text reveal | line-mask rise | line-mask rise (shorter) | none, content visible |
| Chapters | pinned, scrubbed crossfade | un-pinned stacked sections with reveals | stacked, static |
| Image sequence | pinned canvas scrub | lighter frame set, fewer frames | poster image |
| Showcase hover image | cursor-follow preview | inline image per row | inline image |
| Horizontal scroller | scroll-driven | native swipe with snap | native swipe |
| Magnetic CTA | ✓ | disabled | disabled |

8. **Performance budget:** animate only `transform`/`opacity`; GSAP loaded via dynamic import in client islands; sequence frames fetched after `load`, decoded progressively (first, last, then bisecting), skipped entirely on `Save-Data`/2G.

---

## 10. Technical architecture

- **Next.js 16 App Router + Payload 3.89** in one app. RSC by default; client components are small islands.
- **DB:** SQLite (libSQL) for local/dev and single-server deploys; Postgres adapter installed and selected by `DATABASE_URL` prefix for production.
- **Data access:** `src/lib/cms/*` — typed query functions using the Payload Local API with `draftMode()` awareness and `cache()`; no REST round-trips from the server.
- **Rendering:** `(frontend)/[[...slug]]` renders Pages via `RenderBlocks`; `experiences/[slug]` uses the fixed template. ISR with on-demand revalidation from Payload `afterChange` hooks (`revalidatePath`/`revalidateTag`).
- **Preview:** Payload Live Preview + Next Draft Mode (`/next/preview?secret=…`), plus a "Preview website" link in the admin nav.
- **Security:** role-based access on every collection; login lockout; upload MIME allowlist + size limits + SVG sanitisation check; contact endpoint = server-validated (zod), honeypot, same-origin check, IP rate limit; Payload CSRF allowlist; strict security headers; secrets only in env.
- **SEO:** `generateMetadata` from CMS with fallbacks; canonical; OG/Twitter; `sitemap.ts`, `robots.ts`; JSON-LD `TouristTrip` + `Offer` for experiences, `Organization`/`TravelAgency` site-wide, `BreadcrumbList`. FAQPage JSON-LD is **not** emitted (Google restricts FAQ rich results to authoritative government/health sites since 2023).
- **Analytics:** GA4 / GTM / Meta Pixel IDs in Site Settings (env overrides); loaded only after consent via a lightweight consent banner that appears only when an ID is configured.
