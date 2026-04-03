# 메타 프롬프트: Notion 견적서 웹 뷰어 MVP PRD 생성

> **사용 방법**: 이 파일의 전체 내용을 Claude Code에 복사하여 실행하면, 완전한 Notion 견적서 웹 뷰어 MVP PRD가 생성됩니다.

---

## 역할 및 지시사항

당신은 **시니어 프로덕트 매니저**입니다. 다음 조건에 따라 **Notion 견적서 웹 뷰어** MVP의 완전한 PRD(Product Requirements Document)를 작성해주세요.

### 핵심 요구사항
- **입력**: Notion Database에 저장된 견적서 내용
- **산출**: 
  1. 웹 기반 견적서 뷰어 (클라이언트 확인용)
  2. PDF 다운로드 기능
- **목표**: 견적 발행자와 클라이언트 간 견적서 공유 프로세스 자동화

---

## 프로젝트 기술 컨텍스트

이 프로젝트는 다음 기술 스택으로 구축됩니다:

| 항목 | 기술 | 버전 |
|------|------|------|
| **프레임워크** | Next.js (App Router) | 16.2.1 |
| **UI 라이브러리** | React | 19.2.4 |
| **스타일링** | Tailwind CSS (CSS-based config) | v4 |
| **UI 컴포넌트** | shadcn/ui | 4.1.1 |
| **폼 라이브러리** | react-hook-form + Zod | 7.72.0 / 4.3.6 |
| **아이콘** | lucide-react | 1.7.0 |
| **토스트** | sonner | 2.0.7 |
| **외부 API** | Notion API | v1.x |
| **타입 안전** | TypeScript (strict mode) | 5.x |

### 아키텍처 패턴 (CLAUDE.md 기준)
- **Server Components**: 메타데이터, 레이아웃, 데이터 페칭
- **Client Components** (`"use client"`): 상호작용, 폼, 토스트 알림
- **`_components/` 패턴**: 페이지별 클라이언트 컴포넌트는 `_components/` 폴더에 격리
- **타입 정의**: `types/index.ts`에 모든 타입 집중
- **상수 관리**: `lib/constants.ts`에서 설정 관리

### 디렉토리 구조 (예상)
```
app/(dashboard)/
├── invoice/              # 견적서 페이지 그룹
│   ├── layout.tsx       # 견적서 공통 레이아웃
│   ├── [invoiceId]/
│   │   ├── page.tsx     # 개별 견적서 페이지 (Server Component)
│   │   └── _components/
│   │       └── invoice-viewer.tsx  # 견적서 뷰어 (Client Component)
│   ├── list/
│   │   └── page.tsx     # 견적서 목록 페이지
│   └── settings/
│       ├── page.tsx     # 견적서 설정 페이지
│       └── _components/
│           └── invoice-settings-form.tsx

lib/
├── constants.ts         # 기본값, 설정
├── utils.ts             # cn(), 유틸 함수
└── notion-api.ts        # Notion API 헬퍼 (새로 추가)

types/
└── index.ts             # Invoice, Template, Client 등 타입 정의

components/
├── invoice/             # 견적서 특화 컴포넌트
│   ├── invoice-header.tsx
│   ├── invoice-items-table.tsx
│   ├── invoice-total-section.tsx
│   └── invoice-actions.tsx
└── ui/                  # 기존 shadcn/ui 컴포넌트
```

---

## PRD 생성 지시사항

아래 12개 섹션을 모두 포함하여 PRD를 작성하세요. 각 섹션은 개발팀이 즉시 구현 가능한 수준의 구체성을 가져야 합니다.

### 1. 제품 개요 (Product Overview)
- 제품명, 한 줄 요약
- 핵심 가치 제안 (Value Proposition)
- 사용 사례 (Use Case)
- 대상 사용자

### 2. 문제 정의 & 목표 (Problem & Goals)
- **문제**: 현재 견적서 공유 프로세스의 문제점 (수동 작업, 버전 관리 어려움 등)
- **기회**: 웹 기반 통합으로 얻을 수 있는 이점
- **목표**: 
  - 비즈니스 목표 (견적 승인률, 응답 시간 단축)
  - 기술 목표 (API 성능, 확장성)

### 3. 사용자 페르소나 (User Personas)
최소 2명:

#### 페르소나 1: 견적 발행자 (Quotation Issuer)
- 직책: 영업팀 / 프로젝트 매니저
- 목표: 견적서를 빠르게 작성 → Notion에 저장 → 클라이언트 공유 링크 생성
- 통증점: 여러 도구 전환, PDF 수동 변환
- 기술 수준: 중간

#### 페르소나 2: 클라이언트 (Client)
- 목표: 메일/공유 링크로 받은 견적서 확인 → PDF 다운로드
- 통증점: 로그인 불필요, 직관적 UI
- 기술 수준: 낮음~중간

### 4. 핵심 기능 (Core Features) - MVP 범위
최소 포함:

#### Feature 1: Notion 데이터 연동
- Notion API를 통해 Invoice Database에서 견적서 데이터 조회
- 캐싱 전략 (ISR / On-demand revalidation)
- **Acceptance Criteria**:
  - Notion Database 인증 (API Key)
  - 500ms 이내 데이터 로드

#### Feature 2: 견적서 웹 뷰어
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 기본 정보: 회사명, 클라이언트명, 발행일, 유효기간
- 품목 테이블: 항목명, 수량, 단가, 금액
- 합계 섹션: 소계, 세금, 최종 금액
- **Acceptance Criteria**:
  - 모든 스크린 크기에서 가독성 100% 유지
  - 로그인 없이 공개 링크 접근 가능

#### Feature 3: PDF 다운로드
- 버튼 클릭 → 서버사이드 또는 클라이언트사이드 PDF 생성
- 파일명: `Invoice_{InvoiceID}_{Date}.pdf`
- **Acceptance Criteria**:
  - PDF 생성 시간 < 3초
  - 레이아웃 웹 뷰어와 동일

#### Feature 4: 견적서 목록 (선택)
- 발행자용 대시보드 (인증 필요)
- 견적서 목록, 상태(Draft/Sent/Accepted), 필터링
- **Acceptance Criteria**:
  - 100개 항목 이상 페이지네이션

### 5. 사용자 플로우 (User Flows)

#### Flow 1: 견적서 생성 & 공유 (발행자)
```
1. 발행자가 대시보드 접속 (인증)
2. Notion에서 새 견적서 작성 / 기존 견적서 선택
3. 견적서 세부정보 입력 (Notion 또는 웹 폼)
4. "공유 링크 생성" 클릭 → UUID 기반 공개 링크 생성
5. 링크를 클라이언트에게 이메일 / 메시지 전송
```

#### Flow 2: 견적서 확인 & 다운로드 (클라이언트)
```
1. 클라이언트가 공유 링크 클릭 (로그인 X)
2. 견적서 웹 뷰어 로드
3. 내용 확인
4. "PDF 다운로드" 버튼 클릭 → 즉시 PDF 다운로드
```

### 6. 기술 아키텍처 (Technical Architecture)

#### 데이터 플로우
```
Notion Database
      ↓ (Notion API)
Next.js Server Component (API Route 또는 Direct Fetch)
      ↓
React Client Component (Invoice Viewer)
      ↓ (User clicks Download)
PDF Generator (Server-side: Puppeteer / @react-pdf/renderer)
      ↓
Client (PDF 파일 다운로드)
```

#### 주요 의사결정

**Q1: PDF 생성 위치는?**
- **권장**: 서버사이드 (Puppeteer / @react-pdf/renderer)
  - 장점: 성능, 일관성, 폰트/이미지 안정적 처리
  - 단점: 서버 리소스 사용
- **대안**: 클라이언트사이드 (html2pdf / react-pdf)
  - 장점: 서버 부하 없음
  - 단점: 브라우저 호환성 이슈

**Q2: 인증 방식?**
- 발행자: NextAuth.js / 또는 API Key 기반
- 클라이언트: UUID 기반 공개 링크 (비밀번호 선택사항)

**Q3: 캐싱 전략?**
- Notion에서 견적서 변경 → ISR (On-demand revalidation) / 또는 캐시 invalidate API 사용

### 7. API 설계 (API Design)

#### API Endpoints

**A. Notion 동기화 (Server-to-Server)**
```
GET /api/invoices
Query: ?notionDatabaseId=xxx&limit=100&offset=0
Response: { invoices: [], total: 500 }
```

**B. 개별 견적서 조회**
```
GET /api/invoices/[invoiceId]
Response: {
  id: "uuid",
  clientName: "string",
  companyName: "string",
  items: [{ name, qty, unitPrice, tax }],
  total: number,
  createdAt: "ISO8601"
}
```

**C. 공유 링크 생성**
```
POST /api/invoices/[invoiceId]/share
Body: { expiresIn?: "7d" | "30d" | "never", requirePassword?: boolean }
Response: { shareUrl: "https://...", expiryDate: "ISO8601" }
```

**D. PDF 다운로드**
```
GET /api/invoices/[invoiceId]/pdf?token=xxx
Response: PDF file (Content-Type: application/pdf)
```

**E. 공개 견적서 조회 (로그인 X)**
```
GET /api/public/invoices/[shareToken]
Response: 견적서 데이터 (메타데이터 제외)
```

### 8. 데이터 모델 (Data Model)

#### Notion Database 스키마 (기준)
```javascript
{
  id: "property_id",
  title: "견적서 번호",
  clientName: "string",
  clientEmail: "string",
  companyName: "string",
  companyLogo: "url",
  items: [
    {
      name: "string",
      description: "string",
      quantity: "number",
      unitPrice: "number",
      tax: "number", // or "percentage"
    }
  ],
  total: "formula or manual",
  status: "Draft | Sent | Accepted | Rejected",
  createdAt: "date",
  validUntil: "date",
  notes: "string",
  currency: "KRW | USD | EUR",
}
```

#### 애플리케이션 타입 정의 (types/index.ts)
```typescript
export type Invoice = {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  companyName: string
  companyLogo?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "accepted" | "rejected"
  currency: string
  issueDate: Date
  dueDate: Date
  notes?: string
}

export type InvoiceItem = {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  taxRate: number // percentage
  subtotal: number
}

export type ShareToken = {
  id: string
  invoiceId: string
  token: string
  expiresAt?: Date
  requiresPassword: boolean
  passwordHash?: string
  createdAt: Date
}
```

### 9. 비기능 요구사항 (Non-Functional Requirements)

| 요구사항 | 목표 |
|---------|------|
| **응답 시간** | API < 200ms, 페이지 로드 < 1.5s |
| **가용성** | 99.5% uptime |
| **보안** | HTTPS, CORS 제한, 비밀번호 선택 옵션 |
| **접근성** | WCAG 2.1 AA 준수 |
| **모바일** | 모든 페이지 반응형 (모바일 우선) |
| **SEO** | 공개 페이지 meta tags 설정 |
| **동시성** | 100 RPS 이상 처리 |

### 10. 성공 지표 (Success Metrics)

| 지표 | 초기 목표 | 3개월 목표 |
|------|---------|----------|
| DAU (발행자) | 5명 | 20명 |
| 월간 견적서 발행 | 30개 | 150개 |
| 클라이언트 PDF 다운로드율 | 60% | 85% |
| 견적 수락률 | 40% | 65% |
| 평균 응답 시간 | < 500ms | < 200ms |
| 페이지 로드 시간 | < 2s | < 1s |

### 11. MVP 범위 정의

#### ✅ 포함 (MVP)
- [x] Notion Database 연동 (read-only)
- [x] 공개 견적서 뷰어 (로그인 X)
- [x] PDF 다운로드 (서버사이드 생성)
- [x] 반응형 디자인
- [x] 기본 보안 (공유 토큰)

#### ❌ 제외 (v1.1+)
- [ ] 발행자 대시보드 & Notion 쓰기
- [ ] 결제 통합
- [ ] 견적서 서명
- [ ] 자동 리마인더 이메일
- [ ] 다국어 지원 (초기: 한국어만)
- [ ] 고급 분석 & 리포팅
- [ ] SSO / OAuth

### 12. 구현 우선순위 (Implementation Roadmap)

#### Phase 1: 코어 기능 (Week 1-2)
- [ ] Notion API 헬퍼 함수 작성
- [ ] 견적서 데이터 모델 & 타입 정의
- [ ] 공개 링크 토큰 시스템 (DB: SQLite / PrismaORM 또는 메모리)
- [ ] 견적서 뷰어 UI 컴포넌트 (shadcn/ui 기반)
- [ ] PDF 생성 통합 (puppeteer 또는 @react-pdf/renderer)

#### Phase 2: 발행자 기본 기능 (Week 2-3)
- [ ] 발행자 인증 (NextAuth.js / API Key)
- [ ] 발행자 대시보드 (견적서 목록, 상태)
- [ ] 공유 링크 생성 UI
- [ ] 기본 설정 페이지

#### Phase 3: 테스트 & 최적화 (Week 3-4)
- [ ] E2E 테스트 (Playwright 기반)
- [ ] 성능 최적화 (캐싱, 이미지 최적화)
- [ ] SEO & 메타 태그
- [ ] 보안 감시 (CSP, CORS)

#### Phase 4: 런칭 준비
- [ ] 사용자 피드백 수집
- [ ] 모니터링 & 로깅 설정
- [ ] 배포 (Vercel / Self-hosted)

---

## 추가 고려사항

### 의존성 추가 필요
```bash
npm install @react-pdf/renderer    # 또는 puppeteer
npm install next-auth              # 발행자 인증용 (선택)
npm install @notionhq/client       # Notion API
```

### 환경 변수
```
NOTION_API_KEY=xxx
NOTION_DATABASE_ID=xxx
NEXTAUTH_SECRET=xxx (선택)
```

### 참고 자료
- Notion API Docs: https://developers.notion.com/
- Next.js 16 Breaking Changes: https://node_modules/next/dist/docs/
- shadcn/ui Components: https://ui.shadcn.com/
- @react-pdf/renderer: https://react-pdf.org/
- Puppeteer: https://pptr.dev/

---

## 검증 체크리스트

PRD 완성 후 다음을 확인하세요:

- [ ] 12개 섹션 모두 포함
- [ ] 각 섹션에 Acceptance Criteria 또는 구체적 예시 포함
- [ ] 기술 스택 (Next.js 16, Tailwind v4, shadcn/ui) 반영
- [ ] MVP 범위 명확히 구분 (포함/제외)
- [ ] 타입 정의 포함 (TypeScript 코드)
- [ ] API 엔드포인트 모두 정의
- [ ] 사용자 플로우 다이어그램 또는 텍스트 설명 포함
- [ ] 개발자가 즉시 구현 가능한 수준의 상세도

---

**생성일**: 2026-04-02  
**버전**: 1.0 (MVP)  
**상태**: 초안 → Review → Approved → 개발 착수
