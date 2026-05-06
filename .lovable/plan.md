# Le Safoutier — Resto Kayang Visual Redesign

Complete visual overhaul. All content, routes, form logic, validation, and existing behavior stay identical — only design tokens, typography, layouts, and component styling change.

## Scope

Redesign every page (Home, Menu, Reservations, Contact) plus shared chrome (Navbar, Footer, FloatingButtons, PageLoader) to match the Resto Kayang aesthetic: bold black + bright yellow #F5C800, oversized Space Grotesk type, full-bleed photography, minimal cards.

Out of scope: routing changes, form validation logic, content rewrites, removing/adding sections, backend wiring. Existing inline-error + submit-state UX on Contact stays.

## Design tokens (index.css + tailwind.config.ts)

Replace the warm earthy palette with:
- `--background` = #1A1A1A, `--secondary-bg` = #111111
- `--primary` = #F5C800 (yellow), `--primary-foreground` = #111111
- `--foreground` = #FFFFFF, `--muted-foreground` = #888888
- `--border` = rgba(255,255,255,0.1)
- `--card` = #1A1A1A, `--card-foreground` = #FFFFFF
- All converted to HSL per design system rules

Fonts:
- Load Space Grotesk (400/500/700/800/900) and Inter (400/500/700) via Google Fonts in `index.html`
- Replace `font-display` (Playfair) and `font-accent` (Cormorant) with Space Grotesk
- Body = Inter
- Drop the safou leaf cursor / italic gold-label flourishes (no longer fits the aesthetic)

Update `tailwind.config.ts`: new color tokens, new fontFamily entries (`display: Space Grotesk`, `body: Inter`), keep existing animation keyframes, add `count-up`/`pulse-ring` if needed.

## Shared components

**Navbar** — transparent over hero, switches to solid #111111 on scroll. Left: "LE SAFOUTIER" wordmark white. Right: About / Menu / Contact Us links. Far right: yellow "Book Online" pill button → /reservations. Mobile: hamburger → full-screen dark overlay.

**Footer** — #111111 bg, 3px yellow top border. 3 columns (brand+socials, quick links, contact). Bottom strip with copyright + payment icons.

**FloatingButtons** — yellow back-to-top circle (appears after 400px), green WhatsApp pill with pulse ring.

**PageLoader** — yellow "LE SAFOUTIER" text on black, fades out 1.5s.

## Page redesigns

**Home** (`src/pages/Home.tsx`)
- Hero: full-bleed dark moody food photo, MASSIVE yellow "LE SAFOUTIER" overlay (120px / 60px mobile, weight 900). Bottom-left: two opening-hours pills. Bottom-right: tagline.
- About/Welcome: full yellow #F5C800 section, 3-photo strip, dark welcome paragraph, stats row (341+ / 20+ / 4.7★) with count-up.
- Menu preview: dark bg, left heading + right "Book Online" button, 3 floating image cards (Ndole, Barracuda, Jollof), centered "View Full Menu".
- Testimonials: yellow section, large featured quote, author, overlapping avatar row, "Discover the Flavors / Behind Our Menu" heading, auto-scroll image carousel.
- Reservations teaser + Contact CTA bands styled per spec.

**Menu** (`src/pages/Menu.tsx`)
- Keep tab structure (Breakfast / Lunch / Dinner / Buffet Themes / Drinks & Wine) and all items.
- Restyle: dark bg, yellow active pill tabs, full-bleed image cards with no card chrome, white bold dish names, grey descriptions. Cream banner becomes yellow band with dark "Make a Reservation" button.

**Reservations** (`src/pages/Reservations.tsx`)
- Keep all fields, zod validation, time slots.
- Restyle: dark section, white bold "Reserve Your Table", 2-col grid form with #111111 inputs, yellow focus border, full-width yellow "CONFIRM RESERVATION" submit. Right info card → minimal dark card with yellow accents. Group banner → yellow band with dark button.

**Contact** (`src/pages/Contact.tsx`)
- Keep form, validation, inline errors, isSubmitting + isSuccess states (already implemented).
- Restyle: hero with yellow overlay text. Contact-cards row on dark bg with yellow icon circles. Form section becomes yellow bg (Find Us style) with dark form OR dark form section + yellow contact band — follow spec: yellow Contact section with left details + right map (3px dark border, 16px radius). WhatsApp button green #25D366 with pulse ring. TripAdvisor stats and final CTA restyled in yellow/black palette.

## Animations

Reuse existing `useScrollReveal` hook. Add:
- Hero title slide-up entrance (0.8s)
- Stats count-up on viewport enter (simple requestAnimationFrame, no new deps)
- Testimonial image row CSS marquee (pause on hover)
- WhatsApp pulse ring (Tailwind keyframe)
- Navbar bg transition on scroll (existing pattern)

## Files to edit

- `src/index.css` — palette + font vars
- `tailwind.config.ts` — tokens, fonts, keyframes
- `index.html` — swap Google Fonts links
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/FloatingButtons.tsx`
- `src/components/PageLoader.tsx`
- `src/components/ui/button.tsx` — update variants (`terracotta` → `yellow` primary, keep variant names but restyle, or add `yellow`/`ghost-dark`)
- `src/pages/Home.tsx`
- `src/pages/Menu.tsx`
- `src/pages/Reservations.tsx`
- `src/pages/Contact.tsx`
- `src/components/SafouLeaf.tsx` — likely delete (no longer fits)

## Notes

- No content edits — every dish, phone number, hours, review text preserved.
- No new dependencies; count-up done with vanilla rAF.
- All colors via semantic tokens; no hex literals in components except where the spec mandates a one-off (e.g. WhatsApp green) and even those go through tokens where reasonable.
- After implementation I will spot-check the preview and fix any layout regressions.
