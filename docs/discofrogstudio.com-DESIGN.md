# Design System Inspired by Disco Frog Studio

## 1. Visual Theme & Atmosphere

Disco Frog Studio's design system embodies bold sophistication with playful warmth. The aesthetic balances a dark, professional foundation with vibrant golden accents that command attention, creating an energetic yet refined digital presence. The palette evokes creativity and confidence—suitable for a design studio that crafts premium brand identities. The system emphasizes generous whitespace, elevated typography, and purposeful color placement to guide users through thoughtfully curated experiences. Motion and interactivity feel intentional rather than frivolous, reinforcing the studio's commitment to high-performance web design.

**Key Characteristics**
- Dark base with warm golden highlights
- Generous spacing and breathing room
- High contrast for readability and focus
- Balanced playfulness with professional credibility
- Emphasis on premium, handcrafted quality
- Modern, minimalist layout strategy
- Smooth interactions and refined animations

## 2. Color Palette & Roles

### Primary
- **Golden Accent** (`#FDD26E`): Primary call-to-action, highlights, logo accent, interactive states, and premium branding elements
- **Deep Charcoal** (`#332A16`): Primary button backgrounds, navigation accents, and secondary UI elements

### Accent Colors
- **Teal Success** (`#00B388`): Success states, positive feedback, accent highlights
- **Light Mint** (`#CCF0E7`): Secondary accent, subtle backgrounds, gentle highlights
- **Muted Teal** (`#009571`): Hover states for teal elements, deeper accent variations
- **Deep Teal** (`#00241B`): Premium backgrounds, premium card overlays, atmospheric depth

### Interactive
- **Warm Gold** (`#FDD26E`): Primary CTA buttons, hover states on links
- **Dark Brown Button** (`#332A16`): Secondary button background with golden text

### Neutral Scale
- **Primary Text** (`#E8E8E8`): Body text, primary readable content
- **Secondary Text** (`#A2A2A2`): Metadata, secondary information, disabled states
- **Tertiary Text** (`#737373`): Placeholder text, subtle labels
- **Muted Gray** (`#5C5C5C`): Borders, dividers, tertiary UI
- **Dark Gray** (`#454545`): Deep neutral backgrounds, card backgrounds
- **Nearly Black** (`#161616`): Text on light backgrounds, dark emphasis
- **Pure White** (`#FFFFFF`): Highlights, inverse text, premium containers

### Surface & Borders
- **Card Background Dark** (`#454545`): Main card and container backgrounds
- **Light Surface** (`#E8E8E8`): Light mode backgrounds, subtle contrast surfaces
- **Warm Cream** (`#FFF6E2`): Warm neutral surfaces, premium light backgrounds
- **Soft Cream** (`#FEF0CF`): Lighter warm surfaces, subtle backgrounds

### Semantic / Status
- **Error Red** (`#E54848`): Error messages, validation failures, destructive states

## 3. Typography Rules

### Font Family
**Primary:** Inter Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
**Fallback:** system-ui, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Inter Display | 56px | 400 | 64px | -0.5px | Hero headlines, page titles |
| Heading / H2 | Inter Display | 40px | 500 | 48px | -0.25px | Section headers, major divisions |
| Heading / H3 | Inter Display | 32px | 500 | 40px | 0px | Subsection headers, card titles |
| Heading / H4 | Inter Display | 24px | 500 | 32px | 0px | Component headers, medium emphasis |
| Body / Regular | Inter Display | 16px | 400 | 24px | 0px | Primary body text, descriptions |
| Body / Emphasis | Inter Display | 16px | 500 | 24px | 0px | Bold body text, button text |
| Caption / Small | Inter Display | 14px | 400 | 20px | 0.25px | Metadata, timestamps, helper text |
| Code / Monospace | "Courier New", monospace | 14px | 400 | 20px | 0px | Technical content, code blocks |

### Principles
- Use generous line heights to enhance readability against dark backgrounds
- Maintain strong contrast ratios between text and surface colors
- Reserve weight 500+ for emphasis and interactive elements
- Limit to three font sizes per section to maintain visual hierarchy
- Letter spacing increases subtly for smaller text to maintain clarity
- All interactive text defaults to weight 500 for tactile feedback

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#332A16`
- **Text Color:** `#E8E8E8`
- **Padding:** `0px 24px`
- **Height:** `48px`
- **Border Radius:** `48px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 500
- **Line Height:** `24px`
- **Hover State:** Background shifts to `#454545`, text remains `#E8E8E8`
- **Active State:** Background deepens to `#1A1A1A`
- **Disabled State:** Background `#737373`, text `#A2A2A2`

#### Secondary Button (Golden)
- **Background:** `#FDD26E`
- **Text Color:** `#332A16`
- **Padding:** `0px 24px`
- **Height:** `48px`
- **Border Radius:** `48px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 500
- **Line Height:** `24px`
- **Hover State:** Background `#FED590`, text `#332A16`
- **Active State:** Background `#FCC840`
- **Disabled State:** Background `#E8D9A0`, text `#A2A2A2`

#### Ghost Button
- **Background:** transparent
- **Text Color:** `#E8E8E8`
- **Padding:** `4px 4px`
- **Height:** `48px`
- **Border Radius:** `48px`
- **Border:** `1px solid #332A16`
- **Font:** Inter Display, 16px, weight 500
- **Line Height:** `24px`
- **Hover State:** Background `rgba(51, 42, 22, 0.1)`, text `#FDD26E`, border `1px solid #FDD26E`
- **Active State:** Background `rgba(51, 42, 22, 0.2)`

#### Icon Button
- **Background:** transparent
- **Text Color:** `#E8E8E8`
- **Padding:** `0px`
- **Height:** `24px`
- **Width:** `24px`
- **Border Radius:** `0px`
- **Border:** none
- **Font Size:** 16px, weight 400
- **Hover State:** Color shifts to `#FDD26E`

### Cards & Containers

#### Dark Card (Standard)
- **Background:** `#454545`
- **Text Color:** `#E8E8E8`
- **Padding:** `20px`
- **Border Radius:** `16px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Line Height:** `24px`
- **Shadow:** none (flat design)
- **Hover State:** Background `#505050`, subtle lift effect

#### Premium Dark Card
- **Background:** `rgba(0, 36, 27, 0.7)` (semi-transparent deep teal)
- **Text Color:** `#E8E8E8`
- **Padding:** `20px`
- **Border Radius:** `16px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Line Height:** `24px`
- **Shadow:** `0px 2px 10px rgba(0, 0, 0, 0.3)`
- **Hover State:** Background opacity increases to 0.85

#### Light Card (Inverse)
- **Background:** `#E8E8E8`
- **Text Color:** `#161616`
- **Padding:** `20px`
- **Border Radius:** `16px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Line Height:** `24px`
- **Shadow:** `0px 2px 10px rgba(0, 0, 0, 0.05)`

### Inputs & Forms

#### Text Input
- **Background:** `#454545`
- **Text Color:** `#E8E8E8`
- **Placeholder Color:** `#A2A2A2`
- **Padding:** `12px 16px`
- **Height:** `48px`
- **Border Radius:** `8px`
- **Border:** `1px solid #5C5C5C`
- **Font:** Inter Display, 16px, weight 400
- **Focus State:** Border `1px solid #FDD26E`, shadow `0px 0px 0px 3px rgba(253, 210, 110, 0.2)`
- **Error State:** Border `1px solid #E54848`, shadow `0px 0px 0px 3px rgba(229, 72, 72, 0.1)`

#### Form Label
- **Color:** `#E8E8E8`
- **Font:** Inter Display, 14px, weight 500
- **Line Height:** `20px`
- **Margin Bottom:** `8px`
- **Required Indicator:** `#E54848`

#### Form Help Text
- **Color:** `#A2A2A2`
- **Font:** Inter Display, 12px, weight 400
- **Line Height:** `18px`
- **Margin Top:** `4px`

### Navigation

#### Top Navigation Bar
- **Background:** transparent
- **Text Color:** `#E8E8E8`
- **Padding:** `0px 20px`
- **Height:** `48px`
- **Border Radius:** `0px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Shadow:** `0px 2px 10px rgba(0, 0, 0, 0.05)` (subtle elevation)
- **Active Link Color:** `#FDD26E`
- **Hover Link Color:** `#E8E8E8` with opacity 0.7

#### Navigation Link
- **Background:** transparent
- **Text Color:** `#E8E8E8`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Hover State:** Text color `#FDD26E`, underline appears `1px solid #FDD26E`
- **Active State:** Text color `#FDD26E`, border-bottom `2px solid #FDD26E`

#### Navigation Link (Secondary)
- **Background:** transparent
- **Text Color:** `#8B8B8B`
- **Padding:** `0px 24px`
- **Height:** `48px`
- **Border Radius:** `12px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 500
- **Hover State:** Background `rgba(253, 210, 110, 0.1)`, text `#FDD26E`

### Links

#### Inline Link
- **Background:** transparent
- **Text Color:** `#E8E8E8`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 400
- **Hover State:** Text color `#FDD26E`, text-decoration `underline`, text-decoration-thickness `2px`
- **Visited State:** Text color `#A2A2A2`

#### Call-to-Action Link
- **Background:** `#332A16`
- **Text Color:** `#FDD26E`
- **Padding:** `0px 24px`
- **Height:** `48px`
- **Border Radius:** `12px`
- **Border:** none
- **Font:** Inter Display, 16px, weight 500
- **Hover State:** Background `#454545`, text `#FDD26E`
- **Active State:** Background `#1A1A1A`

## 5. Layout Principles

### Spacing System

**Base Unit:** `8px`

**Scale:**
- `4px` — Micro spacing, internal component gaps
- `8px` — Tight spacing, component gaps
- `16px` — Standard spacing, element separation
- `20px` — Component padding (default)
- `24px` — Button padding, dense sections
- `40px` — Medium section padding
- `80px` — Section margin, content blocks
- `100px` — Large section padding
- `120px` — Extra-large section padding
- `192px` — Hero/feature spacing, premium sections

**Usage Context:**
- Use `4px–8px` for internal button/input padding and icon spacing
- Use `16px–24px` for card content and form field spacing
- Use `40px–80px` to separate content sections
- Use `100px–192px` for hero sections and major layout divisions

### Grid & Container

**Max Width:** `1440px` (standard desktop viewport)
**Column Strategy:** 12-column grid at desktop (80px columns + 20px gutters)
**Breakpoint Behavior:** Scales to 8-column at tablet, 4-column on mobile

**Container Padding:**
- Desktop: `40px` left/right
- Tablet (768px): `24px` left/right
- Mobile (320px): `16px` left/right

**Section Patterns:**
- Hero section: full-width, `192px` vertical padding
- Content grid: max-width container, `80px` bottom margin between sections
- Card grid: 3-column on desktop, 2-column on tablet, 1-column on mobile

### Whitespace Philosophy

Whitespace is deliberate and purposeful. The system embraces breathing room around typography and interactive elements, preventing visual fatigue on dark backgrounds. Sections are clearly separated by minimum `80px` vertical spacing, allowing content to feel premium and uncluttered. Micro-spacing within components (buttons, inputs) uses smaller increments (`4px–8px`), while macro-spacing between sections uses larger multiples (`80px–192px`).

### Border Radius Scale

- **`0px`** — Navigation bars, full-width elements, raw geometry
- **`8px`** — Subtle rounding for inputs and small components
- **`12px`** — Navigation buttons, soft call-to-action links
- **`16px`** — Primary card containers, main content blocks
- **`24px`** — Images and featured content with emphasis
- **`40px`** — Large image cards, premium content containers
- **`48px`** — Fully rounded buttons, circular/pill-shaped elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow | Flat design elements, buttons on solid backgrounds |
| Subtle (1) | `0px 2px 10px rgba(0, 0, 0, 0.05)` | Navigation bars, light cards, minimal lift |
| Raised (2) | `0px 4px 16px rgba(0, 0, 0, 0.15)` | Modals, dropdown menus, floating elements |
| Elevated (3) | `0px 8px 24px rgba(0, 0, 0, 0.25)` | Premium cards, featured content, hero overlays |
| Maximum (4) | `0px 12px 32px rgba(0, 0, 0, 0.35)` | Highest priority interactive elements, full-screen overlays |

**Shadow Philosophy:**
Shadows are used sparingly to maintain the modern, minimalist aesthetic. The system favors flat design with selective elevation for interactive and premium content. Dark backgrounds mean shadows are subtle (lower opacity) to avoid visual noise. Shadows increase opacity only on focused, interactive, or call-to-action elements. All shadows use pure black with transparency rather than colored shadows, maintaining consistency across the palette.

## 7. Do's and Don'ts

### Do
- Use `#FDD26E` to highlight primary actions, draw attention, and create visual hierarchy
- Apply `#332A16` as the foundation for secondary buttons and dark UI accents
- Maintain minimum `48px` height for all touch targets and interactive elements
- Use generous whitespace (`80px+` between sections) to reduce cognitive load
- Pair dark backgrounds with `#E8E8E8` text for accessibility and readability
- Apply `16px` border radius to card containers for soft, premium appearance
- Reserve animations for interactive states—avoid gratuitous motion
- Use the teal accent (`#00B388`) sparingly for positive actions and success states
- Keep component padding at `20px` minimum to maintain premium feel
- Test color combinations against WCAG AA contrast standards

### Don't
- Avoid using more than two colors per component (except gradient overlays)
- Don't use `#FDD26E` for body text or secondary information—it should command attention
- Avoid border radius below `8px` for primary components
- Don't place light text (`#E8E8E8`) directly on light surfaces; maintain contrast
- Avoid vertical padding below `12px` for form inputs and buttons
- Don't use shadows heavier than level 2 on non-interactive elements
- Avoid cluttering dark backgrounds with saturated accent colors
- Don't mix warm and cool accent colors in the same component
- Avoid font sizes below `14px` for body content
- Don't break the `48px` minimum height rule for clickable elements

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | 1440px+ | Full 12-column grid, max-width containers, `40px` padding |
| Laptop | 1024px–1439px | Adjust card grids to 2-3 columns, maintain container padding |
| Tablet | 768px–1023px | Shift to 8-column grid, 2-column card layouts, `24px` padding |
| Mobile | 320px–767px | 4-column grid, 1-column card stacks, `16px` padding, 36px type scales |
| Small Mobile | Below 320px | Emergency overrides, minimum `12px` padding |

### Touch Targets

- **Minimum Height:** `48px` for all clickable elements (buttons, links, inputs)
- **Minimum Width:** `48px` for icon buttons and small controls
- **Minimum Spacing:** `8px` between adjacent touch targets
- **Recommended Size:** `56px × 56px` for primary actions on mobile
- **Tap Target Padding:** `12px` minimum safe zone around clickable areas

### Collapsing Strategy

**Desktop to Tablet (1024px):**
- Hero headings scale from `56px` to `40px`
- Container padding reduces from `40px` to `24px`
- 3-column grids collapse to 2 columns
- Navigation may become compact or hamburger menu

**Tablet to Mobile (768px):**
- Navigation collapses to hamburger menu icon
- All grids shift to single column
- Card padding maintains `20px` for consistency
- Font sizes reduce by 1–2 steps for sub-headings
- Container padding reduces to `16px`
- Hero section spacing reduces from `192px` to `120px` vertical padding

**Mobile Considerations:**
- All buttons stack to full-width
- Forms increase padding for thumb accessibility
- Images scale to `100%` width with maintained aspect ratio
- Card components increase padding slightly (`24px`) for mobile tap accuracy
- Navigation links increase height to `56px` minimum

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Golden Accent (`#FDD26E`) — use for high-priority actions and highlights
- **Secondary CTA:** Deep Charcoal (`#332A16`) — use for secondary buttons and dark accents
- **Background:** Card Background Dark (`#454545`) — use for card and container backgrounds
- **Text (Primary):** Primary Text (`#E8E8E8`) — use for all body content and readable text
- **Text (Secondary):** Secondary Text (`#A2A2A2`) — use for metadata, disabled states, help text
- **Success:** Teal Success (`#00B388`) — use for positive feedback and validation
- **Error:** Error Red (`#E54848`) — use for errors and destructive actions
- **Borders:** Muted Gray (`#5C5C5C`) — use for form borders, dividers, subtle lines
- **Neutral (Lightest):** Pure White (`#FFFFFF`) — use for highlights and inverse text
- **Premium Overlay:** Deep Teal (`#00241B`) — use for atmospheric, premium backgrounds

### Iteration Guide

1. **All interactive elements must be minimum `48px` height.** This applies to buttons, inputs, navigation links, and clickable cards. Maintain this standard across all breakpoints.

2. **Use `#FDD26E` as the sole accent color for call-to-action.** Never combine it with other accent colors in the same component. Reserve it for primary buttons, success states, and critical guidance.

3. **Typography defaults to Inter Display at `16px` / `400` weight.** Bold text always uses `500` weight. Headings use `32px` (h3) or `40px` (h2) minimum. All body text maintains `24px` line height.

4. **Card and container padding is always `20px` minimum.** Maintain this baseline across all variants. Increase to `24px` or `40px` only for premium or expanded components.

5. **Border radius follows the scale strictly:** inputs `8px`, cards `16px`, images `24px–40px`, buttons `48px`.

6. **All spacing between sections is `80px` minimum.** Use multiples of `8px` for internal component spacing. Use `40px`, `80px`, `100px`, or `120px` for section separation.

7. **Shadows are applied sparingly.** Only use shadows at level 1 (subtle) for navigation and standard cards. Reserve level 2+ for modals, floating elements, and premium features. Never apply shadows to buttons.

8. **Form inputs have `#454545` background with `5C5C5C` border.** Focus state adds golden border (`#FDD26E`) and subtle shadow `0px 0px 0px 3px rgba(253, 210, 110, 0.2)`.

9. **Text contrast must meet WCAG AA standards.** Primary text `#E8E8E8` on dark backgrounds provides sufficient contrast. Secondary text `#A2A2A2` is acceptable only for non-critical information.

10. **All components respond to dark mode as the primary mode.** Light surfaces use `#E8E8E8` or `#FFF6E2`. No light background should pair with dark text without sufficient contrast testing.