---
name: Product Admin - Notion CMS Project
description: 상품 등록 & 관리 어드민 프로젝트. Notion을 CMS로 사용하며 Next.js 16 App Router 기반.
type: project
---

이 프로젝트는 Next.js 16 스타터 템플릿을 기반으로 Notion API를 CMS로 활용한 상품 관리 어드민을 구축하는 것이다.

핵심 요구사항:
- `/products/new` - 상품 등록 폼 (react-hook-form + zod)
- `/products` - 목록 조회 (ISR 60초, on-demand revalidation)
- `/products/[productId]` - 상품 상세 (동적 라우팅)
- `/api/products` - Notion API 연동 라우트

필드: 상품명(필수), 카테고리(Select: 전자제품/의류/기타), 가격(필수), 재고(선택), 설명(선택), 이미지URL(선택), 출시일(선택)

**Why:** @notionhq/client 패키지가 미설치 상태이며 스타터 템플릿 콘텐츠(홈페이지 소개, docs 페이지, dashboard 통계 데모)를 제거하고 상품 어드민 콘텐츠로 교체 필요.

**How to apply:** MVP 범위는 Feature 1~4. Feature 5(편집/삭제)는 v1.1 범위 제외. CSP에 Notion API(api.notion.com) connect-src 추가 필요.
