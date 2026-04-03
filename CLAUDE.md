# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
npm run dev       # Start Turbopack dev server on http://localhost:3000
npm run build     # Build for production
npm start         # Run production server
npm run lint      # ESLint: eslint app/ components/ types/ lib/ hooks/
npx tsc --noEmit  # TypeScript type checking
```

## Critical: Next.js 16 Breaking Changes

**This is Next.js 16.2.1 with breaking changes from 15.x and earlier versions.** ALWAYS consult `node_modules/next/dist/docs/` before writing code. Key differences:

- **Turbopack is the default** for `next dev` and `next build` (no more `--turbopack` flag)
- **`next lint` command removed** → Use ESLint CLI directly
- **Middleware → Proxy**: Replace `middleware.js` with `proxy.js` for route interception
- **App Router conventions**: Parallel routes require explicit `default.js` in all slots
- **Router segment config**: Some options like `dynamicIO` renamed to `cacheComponents`
- **Type imports**: May need type imports in strict mode contexts

See version guide at `node_modules/next/dist/docs/` for complete breaking changes.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **UI**: React 19.2.4 with shadcn/ui components (package: `shadcn@4.1.1`)
- **Styling**: Tailwind CSS v4 (no `tailwind.config.js` — configure via `@theme inline` in CSS)
- **Animation**: tw-animate-css (imported in `globals.css`)
- **Forms**: react-hook-form + zod validation
- **Toast**: sonner (use `toast.success()`, `toast.error()` etc.)
- **Icons**: lucide-react (LucideIcon type)
- **Theme**: next-themes (light/dark/system toggle)
- **MCP**: Playwright MCP server configured in `.mcp.json`

### Directory Structure

```
app/
├── layout.tsx              # Root layout (ThemeProvider, Header, Footer)
├── page.tsx               # Homepage (Hero, features, tech stack)
├── error.tsx              # Error boundary (use client, Link for navigation)
├── loading.tsx            # Suspense fallback
├── not-found.tsx          # 404 page
└── (dashboard)/           # Route group
    ├── layout.tsx         # Dashboard layout (sidebar, main content)
    └── dashboard/
        ├── page.tsx       # Overview/statistics dashboard
        ├── docs/page.tsx  # Documentation page
        └── settings/
            ├── page.tsx   # Settings page (Server Component)
            └── _components/
                └── settings-form.tsx  # Client form component

components/
├── layout/
│   ├── header.tsx         # Top navigation — CLIENT COMPONENT (usePathname, useTheme)
│   ├── footer.tsx         # Footer with site info and links
│   ├── mobile-sidebar.tsx # Mobile nav drawer (Sheet) — CLIENT COMPONENT
│   └── dashboard-nav.tsx  # Dashboard sidebar nav — CLIENT COMPONENT (usePathname)
├── ui/
│   ├── button.tsx, badge.tsx, card.tsx, input.tsx, label.tsx
│   ├── separator.tsx, sheet.tsx
└── theme-provider.tsx     # Next-themes wrapper

lib/
├── constants.ts           # SITE_CONFIG (nav, footer), TECH_STACK
└── utils.ts              # cn() utility (clsx + tailwind-merge)

hooks/
└── use-mobile.ts          # Mobile screen detection hook

types/
└── index.ts              # NavItem, SiteConfig, TechStackItem types
```

### Critical Architecture Decisions

#### 1. **Active Navigation State**
Both `Header` and `MobileSidebar` are **Client Components** for `usePathname()`:
- `header.tsx`: also uses `useTheme()` for ThemeToggle — must be `"use client"`
- `mobile-sidebar.tsx`: uses `usePathname()` for active state
- `dashboard-nav.tsx`: uses `usePathname()` — extracted from Server Component layout

```tsx
"use client"
const pathname = usePathname()  // Only works in client components
const isActive = pathname === item.href
```

#### 2. **`_components/` Pattern for Client Sub-components**
Server pages that need client interactivity use a `_components/` directory:
```
app/(dashboard)/dashboard/settings/
├── page.tsx               # Server Component (metadata, layout)
└── _components/
    └── settings-form.tsx  # "use client" — handles form state, toast
```
This keeps pages as Server Components while isolating client-side logic.

#### 3. **Icon Type Usage**
The `NavItem` type uses `icon?: LucideIcon` (not `string`):
```tsx
import type { LucideIcon } from "lucide-react"
type NavItem = { icon?: LucideIcon }  // Component reference, not string
```
When adding icons, import the component: `import { Home } from "lucide-react"` and use `icon: Home`.

#### 4. **Toast Notifications**
Uses `sonner`. Import and call directly in client components:
```tsx
import { toast } from "sonner"
toast.success("저장되었습니다")
toast.error("오류가 발생했습니다")
```

#### 5. **Theme Provider Integration**
`ThemeProvider` wraps the entire app in `app/layout.tsx`:
- Enables light/dark/system toggle via `next-themes`
- `ThemeToggle` in `header.tsx` cycles: system → light → dark → system

#### 6. **Tailwind CSS v4 Configuration**
No `tailwind.config.js` — v4 uses CSS-based configuration in `globals.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  /* ... */
}

:root {
  --background: oklch(1 0 0);  /* oklch color format */
}
```
When adding colors, add to the `@theme inline` block AND define the CSS variable in `:root` / `.dark`.

#### 7. **Security Headers in `next.config.ts`**
`next.config.ts` applies security headers to all routes:
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- `Permissions-Policy`, `Strict-Transport-Security`, `Content-Security-Policy`

Do not remove these headers. When adding external resources (fonts, APIs), update the CSP accordingly.

### Type System

**TypeScript strict mode** is enabled. Key types:

```tsx
// types/index.ts
export type NavItem = {
  label: string
  href: string
  icon?: LucideIcon    // Always a React component, never a string
  external?: boolean
  badge?: string
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  nav: NavItem[]
  footerLinks: { title: string; items: NavItem[] }[]
}

export type TechStackItem = {
  name: string
  version: string
  description: string
  href: string
  badgeLabel?: string
}
```

`lib/constants.ts` exports both `SITE_CONFIG` (single source of truth for nav/site metadata) and `TECH_STACK` (homepage tech stack display).

## Common Development Tasks

### Add a New Page
1. Create file: `app/new-page/page.tsx` (or `app/(group)/new-page/page.tsx` for grouped routes)
2. Export a default component (Server Component by default)
3. Optionally export metadata: `export const metadata: Metadata = { title: "..." }`

### Add a New Dashboard Page
1. Create: `app/(dashboard)/dashboard/new-page/page.tsx`
2. Layout is automatically inherited from `app/(dashboard)/layout.tsx`
3. Add to `DASHBOARD_NAV` array in `components/layout/dashboard-nav.tsx`
4. If the page needs client interactivity, put client components in `_components/` subdirectory

### Make a Component Interactive (Client-side)
Add `"use client"` at the top of the file:
```tsx
"use client"
import { usePathname, useRouter } from "next/navigation"
```

### Add a New shadcn/ui Component
```bash
npx shadcn@latest add component-name
# Components are installed to components/ui/
```

### Check for TypeScript/ESLint Errors
```bash
npx tsc --noEmit                                    # TypeScript strict mode check
npx eslint app/ components/ types/ lib/ hooks/      # ESLint
```

## Debugging & Testing

### Use Playwright MCP for Web Testing
The project includes Playwright MCP configuration (`.mcp.json`):
```bash
# In Claude Code, use Playwright MCP tools to:
# - Navigate to pages and capture snapshots
# - Collect console errors (browser_console_messages)
# - Evaluate JavaScript on the page (browser_evaluate)
# - Simulate user interactions (browser_click, browser_type)
```

Example workflow for debugging:
1. Start dev server: `npm run dev`
2. Use `browser_navigate` to visit pages
3. Use `browser_console_messages` to check for errors
4. Use `browser_snapshot` to verify UI state

### Common Issues & Solutions

**Issue**: `usePathname()` / `useTheme()` used in Server Component
- **Symptom**: Error about hook not available
- **Fix**: Add `"use client"` to the file, or extract to a `"use client"` component

**Issue**: Tailwind CSS colors not applying
- **Cause**: Color not defined in CSS
- **Fix**: Add CSS variable to `:root` / `.dark` AND add mapping in `@theme inline` block in `globals.css`

**Issue**: TypeScript error on icon property
- **Cause**: Passing string instead of LucideIcon component
- **Fix**: Import component: `import { Home } from "lucide-react"` and use `icon: Home`

**Issue**: CSP blocking external resource (font, API, script)
- **Cause**: `Content-Security-Policy` in `next.config.ts` blocks unlisted origins
- **Fix**: Add the origin to the relevant CSP directive in `next.config.ts`

## Performance Notes

### Turbopack Dev Performance
- Turbopack is significantly faster than Webpack for `next dev`
- HMR (Hot Module Reload) should be nearly instant

### Builds
- Production builds use Turbopack by default in Next.js 16
- Static generation happens at build time (ISR can be configured per route)

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and connect repo to Vercel
vercel  # CLI for local testing
```

### Self-Hosted
```bash
npm run build  # Creates optimized production build in .next/
npm start      # Runs Node.js server (requires Node 20.9.0+)
```

Environment variables: Create `.env.local` (local dev only) or `.env.production` (deployment)

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, metadata, ThemeProvider |
| `app/globals.css` | Tailwind v4 CSS config (`@theme inline`, `oklch` vars) |
| `components/layout/header.tsx` | Top nav — CLIENT COMPONENT |
| `components/layout/mobile-sidebar.tsx` | Mobile nav drawer — CLIENT COMPONENT |
| `components/layout/dashboard-nav.tsx` | Dashboard active state — CLIENT COMPONENT |
| `lib/constants.ts` | `SITE_CONFIG` and `TECH_STACK` — navigation and site metadata |
| `types/index.ts` | TypeScript types (NavItem, SiteConfig, TechStackItem) |
| `next.config.ts` | Next.js config with HTTP security headers |
| `.mcp.json` | Playwright MCP server config |

## Additional Resources

- **Next.js 16 Docs**: Read `node_modules/next/dist/docs/` for authoritative guide
- **shadcn/ui**: https://ui.shadcn.com/ (component patterns and usage)
- **Tailwind CSS v4**: https://tailwindcss.com/docs (new CSS-based config)
- **TypeScript**: Strict mode enabled — prefer type safety over convenience
