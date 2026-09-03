# 🛡️ 네트워크 보안 & 웹 개발자 포트폴리오 (v2.0)
> **W3C WebAuthn(FIDO2) 기반 Passwordless Passkey & Supabase DB 연동 기밀 노트 시스템**

본 프로젝트는 React 18과 Vite로 구축된 싱글 페이지 포트폴리오에, W3C WebAuthn(FIDO2) 표준을 완벽히 준수하는 **무암호화(Passwordless) 생체인증 패스키 시스템**과 **Supabase PostgreSQL 데이터베이스**를 연동하여 기밀 노트(Confidential Notes)를 안전하게 보호하는 고보안 웹 애플리케이션입니다.

---

## 🌟 핵심 기능 및 보안 아키텍처 (v2.0 주요 변경사항)

### 1. 🔑 무암호화 비대칭 공개키 암호학 (Zero-Password Architecture)
- **비밀번호 0건 수집**: 사용자 등록 시 패스워드를 요구하지 않으며, 오직 식별자(Username)만 입력받습니다.
- **개인키의 물리적 기기 격리**: 개인키(Private Key)는 클라이언트의 하드웨어 보안 칩(Windows Hello TPM, Secure Enclave)에만 안전하게 보관되며 네트워크 통신이나 서버로 절대 유출되지 않습니다.
- **Supabase DB 공개키 저장**: 백엔드 서버는 브라우저가 전송한 FIDO2 COSE 포맷의 공개키(Base64)만을 Supabase의 `passkeys` 테이블에 보관합니다.

### 2. ⚡ 일회용 챌린지 및 재전송 공격(Replay Attack) 방어
- 인증 시마다 서버가 `crypto.randomBytes(32)` 기반 암호학적 난수 챌린지를 생성합니다.
- 서명 검증 완료 즉시 해당 챌린지를 DB에서 영구 파기(`DELETE`)하여, 패킷 도청을 통한 재전송 공격을 `400 Bad Request`로 즉시 무력화합니다.
- 서명 카운터(Counter) 검증을 통해 복제된 인증기(Cloned Authenticator)의 접근을 탐지합니다.

### 3. 🛡️ BOLA / IDOR 수평적 권한 상승 원천 방어
- 패스키 인증 성공 시 암호학적 난수 기반의 `sessionId`를 발급하고 `HttpOnly; SameSite=Lax` 쿠키로 안전하게 전달합니다.
- 기밀 데이터 조회 API(`/api/vault/data`)는 클라이언트 요청 파라미터(`userId`)를 신뢰하지 않고 서버 세션의 `req.user.username`과 엄격히 대조하여, 타 계정 접근 시도시 `403 Forbidden`을 반환하고 침해 경고를 로깅합니다.

### 4. 📱 다중 기기(Multi-Device) 관리 및 활성 기기 보호
- 한 계정당 여러 대의 기기(노트북, 모바일, 보안키 등)를 순차적(`Device #1`, `Device #2`...)으로 등록하여 사용할 수 있습니다.
- **활성 기기 보호**: 현재 로그인 세션을 유지 중인 기기는 초록색 `[현재 기기]` 뱃지가 표시되며 삭제 버튼이 원천 비활성화됩니다. API 레벨에서도 현재 세션 키 삭제 시도를 `HTTP 400 ACTIVE_KEY_PROTECTED`로 차단하여 의도치 않은 계정 잠금(Lockout)을 방지합니다.
- **분실 기기 삭제**: 분실한 기기나 보조 기기는 원클릭으로 안전하게 폐기할 수 있으며, 폐기된 키로 로그인 시도 시 즉시 거부됩니다.
- **신속한 타임아웃 & 즉시 취소**: 일치하지 않는 인증기 선택 시 무한 대기를 방지하기 위해 6초 타임아웃 및 프론트엔드 수동 `[취소]` 기능을 제공합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 버전 및 비고 |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | SPA 구조, JavaScript (JSX) |
| **Styling & UI** | Tailwind CSS, Lucide React | 다크 사이버보안 테마 (`#070a12`, Cyan/Emerald) |
| **Client Auth** | `@simplewebauthn/browser` | v14.0.0 (W3C WebAuthn 브라우저 API) |
| **Backend API** | Node.js (v24), Express (v5) | `node --watch` 지원, RESTful API |
| **Server Auth** | `@simplewebauthn/server` | v14.0.0 (FIDO2 COSE 공개키 디코딩 및 서명 검증) |
| **Database** | Supabase (PostgreSQL) | `@supabase/supabase-js` v2.49.1, RLS 보안 활성화 |
| **Session** | `cookie-parser`, Node `crypto` | UUID 기반 `HttpOnly` 쿠키 세션 |
| **i18n** | 자체 다국어 Context | 한국어(`KO`) / 영어(`EN`) 완벽 지원 |

---

## 🚀 설치 및 실행 가이드 (Getting Started)

### 1. 의존성 패키지 설치
```bash
npm install
```

### 2. Supabase 데이터베이스 설정 (원클릭)
1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트를 생성합니다.
2. 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. 프로젝트에 포함된 [`supabase_schema.sql`](file:///c:/Users/user/Desktop/task/portfolio_v0/supabase_schema.sql) 파일 내용을 전체 복사하여 붙여넣고 **`Run`** 버튼을 실행합니다. (5개 테이블 및 RLS 자동 생성)
4. 프로젝트 루트 디렉터리에 **`.env`** 파일을 생성하고 Supabase 접속 정보를 입력합니다:
```env
SUPABASE_URL=https://내프로젝트ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=내_service_role_비밀키
```

### 3. 개발 서버 실행 (프론트엔드 + 백엔드 동시 구동)
```bash
npm run dev
```
* **프론트엔드 웹 앱**: `http://localhost:5173`
* **백엔드 API 서버**: `http://127.0.0.1:3000` (Vite 프록시 자동 연동)
* 프론트엔드와 백엔드가 `concurrently`를 통해 단일 터미널에서 동시에 실행됩니다.

---

## 📁 디렉터리 구조 (Directory Structure)

```text
portfolio_v0/
├── docs/
│   ├── Verification_v2.md   # 공식 과제 제출 및 카드 1~5번 상세 검증 보고서 (v2)
│   └── VERIFICATION.md      # (구버전 AES 검증 문서 보관)
├── IMG/                     # 카드 1~5번 평가 검증 캡처 이미지 모음
├── src/
│   ├── components/
│   │   ├── Vault.jsx        # Passkey 기밀 노트 컴포넌트 (WebAuthn 클라이언트)
│   │   ├── Navbar.jsx       # 상단 네비게이션 (스크롤 스파이)
│   │   ├── Hero.jsx, About.jsx, Experience.jsx, Contact.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx # 테마 관리 컨텍스트
│   │   └── LanguageContext.jsx # 다국어 관리 컨텍스트
│   └── i18n/
│       └── translations.js  # KO/EN 다국어 사전 (하드코딩 문자열 0건)
├── server.js                # Express + WebAuthn + Supabase 백엔드 서버
├── supabase_schema.sql      # Supabase DB DDL 스키마 (RLS 활성화)
├── .env.example             # 환경 변수 템플릿
├── vite.config.js           # Vite 개발 서버 및 API 프록시 설정
└── package.json             # 스크립트 및 의존성 정의
```

---

## 📋 AI 사용 기록 (AI Usage Record v2.0)

1. **AI에게 위임한 작업**:
   - React 컴포넌트 구조화 및 Tailwind CSS 기반 네트워크 보안 감성 UI 구축
   - `@simplewebauthn` v14 라이브러리 연동 백엔드 라우터 및 상태 머신 보일러플레이트 코드 작성
   - Supabase PostgreSQL DDL 쿼리문 및 RLS 활성화 구문 작성
   - 다국어(`translations.js`) 리소스 매핑 및 CSS 반응형 브레이크포인트 최적화
2. **개발자가 직접 판단한 작업**:
   - 외부 서드파티 BaaS(Firebase/Auth0) 의존 대신 자체 Node.js 백엔드 + Supabase DB 연동 아키텍처 채택
   - XSS 방어를 위해 세션 토큰을 `localStorage` 대신 `HttpOnly` 쿠키로 엄격히 관리
   - 동일 계정 다중 기기 등록 시 DB 카운트 기반으로 순차 기기 번호(`Device #1`, `#2`)를 부여하도록 설계
   - 과제 평가의 Zero-Key State 검증과 실제 보안 표준(현재 활성 기기 보호) 간의 절충안 설계
3. **AI 제안을 거부/수정한 작업**:
   - AI가 최초 제안한 소스코드 주석 내 평문 패스워드 기재 방식을 거부하고 주석을 완전 제거함
   - AI가 최초 제안한 단일 인메모리 저장소 방식을 거부하고 영구 저장을 위한 Supabase DB 연동으로 고도화
   - 미등록 인증기 대기 시 60초간 브라우저가 먹통 대기하던 문제를 지적하고, 6초 타임아웃 및 프론트엔드 `WebAuthnAbortService` 즉시 취소 로직으로 수정함
   - 패스키 목록에서 현재 사용 중인 기기를 무차별 삭제할 수 있던 결함을 `[현재 기기]` 뱃지 및 API 삭제 차단으로 방어함

---

## 🔒 공개·비공개 범위 점검표 (Privacy Scope Checklist)

| 구분 | 정보 항목 | 공개 여부 | 검증 및 보호 조치 내용 |
| :--- | :--- | :---: | :--- |
| **공개** | 성명 / 직무 소개 | ✅ 공개 | 네트워크 보안 및 웹/ERP 엔지니어 포트폴리오 메인 공개 |
| **공개** | 경력 사항 및 기술 스택 | ✅ 공개 | 주요 프로젝트 경력 및 개발 기술 스택 공개 |
| **공개** | 이메일 주소 | ✅ 공개 | 업무용 대표 이메일 및 클립보드 원클릭 복사 기능 제공 |
| **기밀** | 내부 기밀 노트 (ERP 설계서 등) | 🔒 패스키 보호 | WebAuthn 생체인증 성공 시에만 복호화되어 열람 가능 |
| **기밀** | 등록된 Passkey 목록 | 🔒 패스키 보호 | 인증된 본인 세션에서만 조회 및 기기 관리 가능 |
| **비공개** | 비밀번호 (Password) | ❌ 비공개 (0건) | Passkey 비대칭키 구조 채택으로 서버/DB에 비밀번호 컬럼 0건 |
| **비공개** | 개인키 (Private Key) | ❌ 비공개 (0건) | 사용자 기기 보안 칩(TPM/Secure Enclave) 외부로 유출 0건 |
| **비공개** | 전화번호 / 상세 집주소 | ❌ 비공개 (0건) | 소스코드, 배포 파일, DB 전체 0건 확인 완료 |
| **비공개** | 주민등록번호 / 생년월일 | ❌ 비공개 (0건) | 소스코드, 배포 파일, DB 전체 0건 확인 완료 |
| **비공개** | DB Secret Key / 토큰 | ❌ 비공개 (0건) | `.env` 격리 및 `.gitignore` 등록으로 Git 저장소 유출 0건 |
