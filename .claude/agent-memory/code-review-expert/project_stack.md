---
name: Project Stack
description: Core technology versions and configuration choices for this Next.js 16 starter project
type: project
---

Next.js 16.2.1 with React 19.2.4, TypeScript strict mode, Tailwind CSS v4 (CSS-based @theme, no tailwind.config.js), shadcn/ui 4.1.1 (radix-nova style), lucide-react 1.7.x, next-themes for dark/light toggle, radix-ui 1.4.x (monorepo package), react-hook-form + zod for forms.

**Why:** Production-ready starter kit designed for Korean-language apps; App Router only, no Pages Router.

**How to apply:** Always verify against these versions when checking Next.js breaking changes. The project uses the new `radix-ui` monorepo package (not `@radix-ui/*` scoped packages) — this affects import paths like `import { Dialog } from "radix-ui"` instead of `import * as Dialog from "@radix-ui/react-dialog"`.
