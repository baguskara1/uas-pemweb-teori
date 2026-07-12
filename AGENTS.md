<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
- Phase 0: Setup Environment completed (GEMINI_API_KEY updated, .gitignore verified)
- Phase 1: Database Migrations completed (3 tables + RLS + seed)
- Phase 2: API Routes completed (Gemini proxy + Wishlist CRUD, lint clean)
- Phase 3: Library Helpers completed (gemini.ts + wishlist.ts, lint clean)
- Phase 4: Shared Components completed (Toast.tsx + WishlistDrawer.tsx, lint clean)
- Phase 5a: Landing Batch 1 completed (HeroSearch + AIAssistant + AIBudgetPlanner, lint clean)
- Phase 5b: Landing Batch 2 completed (CatalogSection + CameraDetailModal, lint clean)
- Phase 5c: Landing Batch 3 completed (WhyUs + TestimonialsCarousel + FAQAccordion + FinalCTA, lint clean)
- biome.json: relaxed a11y + img rules (existing patterns)
- Phase 6: Wire-Up completed (layout.tsx + Navbar.tsx + page.tsx, lint clean)
- Phase 7: Build completed (npm run build — zero errors, 21 routes)
- Types regenerated (src/types/database.ts — includes wishlists, testimonials, faqs)
- QRIS: API returns `qrString` (URL to QR code image), NOT `snapUrl`. CartModal checks `json.data.method === 'qris'` and shows QR code in modal.
- Multiple CSP headers = browser enforces STRICTEST intersection. Nginx CSP removed; middleware handles all CSP.
- Never call `setState()` outside useEffect/event handlers in React — causes infinite re-render.
- Server actions called from client components MUST be wrapped in try-catch.
- Error messages in confirmation dialogs must be rendered INSIDE the dialog, not outside it.
- All items (cameras, lenses, accessories) in same `cameras` table with `category` field.
