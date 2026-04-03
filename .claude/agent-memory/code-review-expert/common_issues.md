---
name: Common Issues
description: Recurring anti-patterns and issues found during initial full-codebase code review
type: project
---

Issues discovered in the initial full review (2026-04-02):

1. **Footer is a Server Component calling `new Date()` at render time** — `getFullYear()` is called directly in the component body, meaning it executes once at build time for static generation. For a frequently rebuilt project this is fine, but it should be noted as a potential stale-year bug in long-lived deployments.

2. **`npm run lint` script is broken** — `package.json` has `"lint": "eslint"` with no glob paths. ESLint will not scan any files. Must be `eslint app/ components/ types/ lib/ hooks/` — documented in CLAUDE.md as a known issue.

3. **Settings page uses raw `<input type="checkbox">` instead of shadcn/ui Checkbox** — inconsistent with the rest of the UI component system.

4. **Settings page has non-functional Save buttons** — It is a Server Component with interactive form elements but no `onSubmit` handler or server action. The "Save" button does nothing.

5. **`external: true` items in `SITE_CONFIG.footerLinks` with `#fragment` hrefs** — Community section items (Discord, Twitter) are marked `external: true` but have `#fragment` hrefs, not real URLs. They would open `#fragment` in a new tab.

6. **`console.error` in `error.tsx` leaks raw error objects to browser console in production** — Acceptable for development, but production apps should send to an error reporting service (Sentry, etc.) and not expose raw errors.

7. **No `aria-current="page"` on active nav links** — `DashboardNav` and `Header` use visual styling for active state but do not set `aria-current="page"` for screen readers.

8. **`useMobile` hook has SSR hydration flash risk** — Initializes `isMobile` to `false` (desktop), so on mobile there will be a flash from desktop layout to mobile layout after hydration. Should initialize to `undefined` and gate rendering.

9. **Dashboard page `searchParams` is read but `tab` value is only displayed, never used for real tab switching** — Placeholder pattern that could mislead future developers.

10. **FAQ in docs page uses array index as React `key`** — `key={idx}` on a stable static array is low-risk here, but violates best practices.

11. **External links in `DocsPage` using Next.js `<Link>` with `target="_blank"` but no `rel="noopener noreferrer"`** — Security vulnerability; the opened tab can access `window.opener`.
