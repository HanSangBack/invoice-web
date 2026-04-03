# invoice-web 개발 규칙 (AI 에이전트용)

이 문서는 invoice-web 프로젝트에서 AI 에이전트가 준수해야 할 프로젝트 특정 규칙을 정의합니다.

## 프로젝트 개요

- **프로젝트**: invoice-web
- **프레임워크**: Next.js 16.2.1 (App Router)
- **UI 라이브러리**: shadcn/ui + React 19.2.4
- **스타일링**: Tailwind CSS v4 (CSS 기반 설정)
- **상태 관리**: react-hook-form + zod
- **알림**: sonner (toast)
- **아이콘**: lucide-react (LucideIcon 타입)
- **테마**: next-themes (light/dark/system)

## 프로젝트 아키텍처

### 디렉토리 구조

```
invoice-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (ThemeProvider, Header, Footer)
│   ├── page.tsx                 # 홈페이지
│   ├── error.tsx                # 에러 바운더리
│   ├── loading.tsx              # Suspense 폴백
│   ├── not-found.tsx            # 404 페이지
│   ├── globals.css              # 전역 CSS (Tailwind v4 설정)
│   └── (dashboard)/             # 라우트 그룹
│       ├── layout.tsx           # 대시보드 레이아웃 (사이드바)
│       └── dashboard/
│           ├── page.tsx         # 대시보드 홈
│           ├── docs/page.tsx    # 문서 페이지
│           └── settings/
│               ├── page.tsx     # 설정 페이지 (서버 컴포넌트)
│               └── _components/
│                   └── settings-form.tsx  # 클라이언트 폼
├── components/                  # React 컴포넌트
│   ├── layout/
│   │   ├── header.tsx           # 헤더 (클라이언트 컴포넌트)
│   │   ├── footer.tsx           # 푸터
│   │   ├── mobile-sidebar.tsx   # 모바일 사이드바 (클라이언트)
│   │   └── dashboard-nav.tsx    # 대시보드 네비게이션 (클라이언트)
│   ├── ui/                      # shadcn/ui 컴포넌트
│   └── theme-provider.tsx       # next-themes 래퍼
├── lib/
│   ├── constants.ts             # SITE_CONFIG, DASHBOARD_NAV, TECH_STACK
│   └── utils.ts                 # cn() 유틸리티
├── types/
│   └── index.ts                 # TypeScript 타입 (NavItem, SiteConfig)
├── hooks/
│   └── use-mobile.ts            # 모바일 감지 훅
├── next.config.ts              # Next.js 설정 (보안 헤더)
├── tsconfig.json               # TypeScript 설정
├── package.json                # 패키지 의존성
└── CLAUDE.md                   # 개발 가이드 (자세한 정보)
```

## 파일 간 상호작용 규칙

### ✅ 필수 동시 업데이트 파일

| 변경 파일 | 함께 업데이트할 파일 | 이유 |
|----------|------------------|------|
| `lib/constants.ts` - SITE_CONFIG 수정 | `components/layout/header.tsx` | 네비게이션 항목 반영 |
| `lib/constants.ts` - DASHBOARD_NAV 수정 | `components/layout/dashboard-nav.tsx` | 대시보드 네비게이션 반영 |
| `app/globals.css` - 색상 변수 추가 | CSS 변수 `:root` / `.dark` 블록 정의 필수 | Tailwind 설정과 동기화 |
| `next.config.ts` - 외부 API/리소스 추가 | CSP (Content-Security-Policy) 업데이트 | 보안 헤더 유지 |
| `components/layout/header.tsx` 수정 | metadata 및 관련 타입 검토 | 클라이언트 컴포넌트 동작 확인 |

## 클라이언트/서버 컴포넌트 규칙

### ✅ 클라이언트 컴포넌트 (must have "use client")

다음 파일들은 **반드시** `"use client"` 선언이 필요합니다:

```
components/layout/header.tsx        (useTheme 사용)
components/layout/mobile-sidebar.tsx (usePathname 사용)
components/layout/dashboard-nav.tsx  (usePathname 사용)
components/theme-provider.tsx        (ThemeProvider 래퍼)
```

### ❌ 금지: 서버 컴포넌트에서 다음 훅 사용

```typescript
// ❌ FORBIDDEN in Server Components
"use client" 없이:
- usePathname()
- useRouter()
- useTheme()
- useCallback(), useState() 등 클라이언트 훅
```

### ✅ 클라이언트 로직 분리 패턴

**대시보드 페이지가 클라이언트 인터액션 필요 시:**

```
app/(dashboard)/dashboard/new-feature/
├── page.tsx                (서버 컴포넌트 - metadata 내보내기)
└── _components/
    └── feature-form.tsx    ("use client" - 상태, 폼, 토스트 처리)
```

## 네비게이션 규칙

### 네비게이션 항목 추가/수정

1. **메인 네비게이션** (홈페이지, 헤더):
   - `lib/constants.ts` → `SITE_CONFIG.nav` 배열 수정
   - `components/layout/header.tsx`에서 자동으로 렌더링됨

2. **대시보드 네비게이션** (대시보드 사이드바):
   - `lib/constants.ts` → `DASHBOARD_NAV` 배열 수정
   - `components/layout/dashboard-nav.tsx`에서 자동으로 렌더링됨

3. **아이콘 정의 방식**:
   ```typescript
   // ✅ CORRECT
   import { Home } from "lucide-react"
   export const SITE_CONFIG = {
     nav: [{ label: "Home", href: "/", icon: Home }]
   }
   
   // ❌ FORBIDDEN
   export const SITE_CONFIG = {
     nav: [{ label: "Home", href: "/", icon: "home" }]  // 문자열 X
   }
   ```

## Tailwind CSS v4 규칙

### ✅ CSS 기반 설정

Tailwind CSS v4는 `tailwind.config.js` **없음**. 모든 설정은 `app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  /* 추가 테마 변수 */
}

:root {
  --primary: oklch(...);
  --secondary: oklch(...);
}

.dark {
  --primary: oklch(...);
  --secondary: oklch(...);
}
```

### ❌ 금지 사항

```
- tailwind.config.js 생성 금지
- tailwind.config.ts 생성 금지
- colors를 CSS 없이 정의 금지
```

### 새 색상 추가 시

1. `app/globals.css`의 `:root` 블록에 CSS 변수 정의
2. `.dark` 블록에 다크 모드 변수 정의
3. `@theme inline` 블록에 매핑 추가
4. 모든 컴포넌트에서 `bg-primary`, `text-secondary` 등으로 사용 가능

## React Hook Form + Zod 규칙

### 폼 구현 패턴

```typescript
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "이름 필수"),
})

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // API 호출
      toast.success("저장되었습니다")
    } catch (error) {
      toast.error("오류가 발생했습니다")
    }
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>
}
```

## Toast 알림 규칙

### ✅ 올바른 사용 (sonner)

```typescript
import { toast } from "sonner"

toast.success("성공 메시지")
toast.error("에러 메시지")
toast.info("정보 메시지")
toast.loading("로딩 중...")
```

### ❌ 금지

- react-toastify 사용 금지
- 다른 toast 라이브러리 사용 금지

## Next.js 16 Breaking Changes 규칙

### ✅ 필수 준수 사항

1. **Turbopack 기본값**: `next dev`와 `next build`에서 자동으로 사용됨
2. **ESLint 직접 사용**: `next lint` 명령 제거됨
   ```bash
   # ✅ CORRECT
   npx eslint app/ components/ types/ lib/ hooks/
   
   # ❌ FORBIDDEN
   next lint
   ```
3. **TypeScript 타입 확인**:
   ```bash
   npx tsc --noEmit
   ```

### ❌ 금지 패턴

- `middleware.js` 사용 금지 (→ `proxy.js` 사용)
- 병렬 라우트에서 `default.js` 미정의 금지
- 이전 App Router 컨벤션 사용 금지

### 의심 사항 시

`node_modules/next/dist/docs/` 디렉토리에서 공식 문서 참조

## 메타데이터 규칙

### 페이지 메타데이터

```typescript
// ✅ 모든 새 페이지에서 metadata 내보내기
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "페이지 제목",
  description: "페이지 설명",
}

export default function Page() {
  return <div>...</div>
}
```

### 동적 메타데이터

서버 컴포넌트에서만 `generateMetadata()` 사용:

```typescript
export async function generateMetadata() {
  return { title: "동적 제목" }
}
```

## 패키지 의존성 규칙

### 설치된 라이브러리

| 라이브러리 | 용도 | 사용 방식 |
|----------|------|---------|
| shadcn/ui | UI 컴포넌트 | `npx shadcn@latest add component-name` |
| tailwindcss | 스타일링 | CSS 임포트 (`@import "tailwindcss"`) |
| lucide-react | 아이콘 | 컴포넌트 임포트 (`import { Home } from "lucide-react"`) |
| react-hook-form | 폼 상태 | `useForm()` 훅 |
| zod | 유효성 검사 | `z.object()` 스키마 정의 |
| sonner | Toast 알림 | `toast.success()` 등 |
| next-themes | 테마 토글 | `useTheme()` 훅 (클라이언트에서만) |
| clsx + tailwind-merge | CSS 클래스 병합 | `cn()` 유틸리티 |

### 새 패키지 추가 시

1. `package.json`에 추가되었는지 확인
2. `CLAUDE.md`의 Tech Stack 섹션 업데이트
3. 보안 헤더(`next.config.ts`)가 필요하면 CSP 업데이트

## TypeScript 규칙

### Strict Mode 활성화

`tsconfig.json`에서 `"strict": true` 설정됨.

### 타입 정의

모든 주요 타입은 `types/index.ts`에 정의:

```typescript
// types/index.ts
export type NavItem = {
  label: string
  href: string
  icon?: LucideIcon        // ✅ 컴포넌트 참조
  external?: boolean
  badge?: string
}

export type SiteConfig = {
  name: string
  nav: NavItem[]
  // ...
}
```

### 임포트 규칙

```typescript
// ✅ 타입은 type 임포트 사용
import type { NavItem } from "@/types"

// ✅ 컴포넌트는 일반 임포트
import { Button } from "@/components/ui/button"

// ✅ 아이콘은 컴포넌트 임포트
import { Home } from "lucide-react"
```

## 보안 헤더 규칙

### next.config.ts의 보안 헤더 (수정 금지)

```typescript
// ✅ 모든 라우트에 다음 헤더 자동 적용:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: (제한된 권한)
- Strict-Transport-Security: max-age=31536000; includeSubDomains
- Content-Security-Policy: (정의된 정책)
```

### 외부 리소스 추가 시

CSP 업데이트 필수:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://new-domain.com; ...",
  },
  // ...
]
```

## 개발 결정 트리

### 상황별 처리 방법

#### Q: `usePathname()`이 필요합니다. 어떻게 하나요?
**A**: 그 파일을 클라이언트 컴포넌트로 변경하세요:
```typescript
"use client"
import { usePathname } from "next/navigation"
```

#### Q: 새로운 네비게이션 항목을 추가하려면?
**A**: `lib/constants.ts`의 해당 배열을 수정하세요:
```typescript
// SITE_CONFIG.nav 또는 DASHBOARD_NAV
nav: [
  { label: "새 항목", href: "/new", icon: NewIcon }
]
```

#### Q: 새로운 색상을 추가해야 합니다.
**A**: 3단계로 진행하세요:
1. `app/globals.css`의 `:root` / `.dark`에 CSS 변수 정의
2. `@theme inline` 블록에 매핑 추가
3. `bg-new-color`, `text-new-color` 등으로 사용

#### Q: 외부 API를 호출해야 합니다.
**A**: CSP 업데이트 필수:
1. `next.config.ts`의 CSP 정책에 도메인 추가
2. 필요하면 API 라우트(`app/api/`) 생성

#### Q: 새로운 UI 컴포넌트가 필요합니다.
**A**: shadcn/ui에서 추가하세요:
```bash
npx shadcn@latest add component-name
# components/ui/component-name.tsx에 설치됨
```

## 금지된 패턴 (DO NOT)

| 패턴 | 이유 | 올바른 방법 |
|------|------|----------|
| `middleware.js` 사용 | Next.js 16에서 제거됨 | `proxy.js` 사용 (필요 시) |
| 서버 컴포넌트에서 `usePathname()` | 훅은 클라이언트 전용 | `"use client"` 추가 또는 클라이언트 컴포넌트 분리 |
| 문자열 아이콘 (`icon: "home"`) | 타입 검사 실패 | LucideIcon 컴포넌트 임포트: `import { Home }` |
| `next lint` 실행 | 명령 제거됨 | `npx eslint app/ components/ types/ lib/ hooks/` 실행 |
| `tailwind.config.js` 생성 | Tailwind v4는 CSS 기반 | `app/globals.css`의 `@theme inline` 사용 |
| react-toastify 사용 | 프로젝트는 sonner 사용 | `import { toast } from "sonner"` 사용 |
| 보안 헤더 제거 | 보안 위험 | `next.config.ts`의 헤더 유지, CSP 업데이트만 |
| App Router 레이아웃 계층 깨뜨리기 | 라우팅 오류 | `_components/` 패턴으로 클라이언트 로직 분리 |

## 코드 리뷰 체크리스트

새 기능 또는 수정 추가 시 다음 확인:

- [ ] `"use client"` 선언이 필요한가? (usePathname, useRouter, useTheme 사용 시)
- [ ] 네비게이션 항목을 추가했다면 `lib/constants.ts`도 수정했는가?
- [ ] 새 색상을 사용한다면 `app/globals.css`에 CSS 변수가 정의되었는가?
- [ ] 외부 리소스를 추가했다면 `next.config.ts`의 CSP를 업데이트했는가?
- [ ] 새 페이지가 있다면 `metadata` 객체를 내보냈는가?
- [ ] 타입 안정성: `npx tsc --noEmit` 통과하는가?
- [ ] 린트: `npx eslint app/ components/ types/ lib/ hooks/` 통과하는가?
- [ ] 금지된 패턴을 사용했는가? (위의 금지 테이블 참조)

## 파일 수정 가이드

### 수정 불가 파일

다음 파일들은 구조를 임의로 변경하지 말 것:

- `app/layout.tsx` - ThemeProvider 레이아웃 유지
- `components/layout/header.tsx` - 구조 유지, SITE_CONFIG 네비게이션 의존
- `components/layout/dashboard-nav.tsx` - 구조 유지, DASHBOARD_NAV 의존
- `app/globals.css` - `@import` 순서 유지, `@theme inline` 블록 보존
- `next.config.ts` - 보안 헤더 유지, CSP 정책 업데이트만

### 안전한 수정 방법

| 기능 | 파일 | 작업 |
|------|------|------|
| 네비게이션 항목 추가 | `lib/constants.ts` | SITE_CONFIG / DASHBOARD_NAV 배열 수정 |
| 색상 추가 | `app/globals.css` | `:root`, `.dark`, `@theme inline` 모두 수정 |
| 아이콘 변경 | 해당 파일 | `lucide-react`에서 올바른 아이콘 임포트 |
| API 도메인 추가 | `next.config.ts` | CSP 정책 구문 유지하고 도메인 추가 |
| 새 페이지 추가 | `app/new-page/page.tsx` | metadata 내보내고 기본 구조 따르기 |

## 의존성 및 버전

### 핵심 버전

- **Node.js**: 20.9.0+ (권장)
- **Next.js**: 16.2.1
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Tailwind CSS**: v4 (설정 방식 변경됨)
- **shadcn/ui**: 4.1.1

### 버전 변경 금지

이 프로젝트의 핵심 프레임워크 버전은 안정적입니다. 임의로 변경하지 마세요.

## 참고 자료

- **CLAUDE.md**: 이 파일의 더 자세한 내용 (개발자용)
- **node_modules/next/dist/docs/**: Next.js 16 공식 문서
- **https://ui.shadcn.com/**: shadcn/ui 컴포넌트 가이드
- **https://tailwindcss.com/docs**: Tailwind CSS v4 설정 및 클래스 레퍼런스
