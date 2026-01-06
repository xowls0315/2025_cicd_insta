# 📸 Instagram Clone Project
- 프론트엔드 배포 링크(Vercel): https://2025-cicd-instafront.vercel.app/
- 백엔드 배포 링크(Render): https://two025-cicd-insta-back.onrender.com/
<br /> **=> 백엔드 배포 링크 클릭 후 프론트엔드 배포 링크 실행하기!!**

## 01. 프로젝트 소개 📋

**Instagram Clone**은 `Next.js`와 `Nest.js`를 활용하여 구현한 풀스택 소셜 미디어 애플리케이션입니다.

### 한 줄 요약

Instagram의 핵심 기능을 구현한 풀스택 웹 애플리케이션 (회원가입, 로그인, 프로필 관리, 피드 CRUD)

### 프로젝트의 목적 및 개요

이 프로젝트는 현대적인 웹 개발 기술 스택을 학습하고 실전 경험을 쌓기 위해 진행된 **개인 프로젝트**입니다. <br/> Instagram의 주요 기능들을 구현하면서 프론트엔드와 백엔드의 전체적인 개발 흐름을 이해하고, RESTful API 설계, 인증/인가, 파일 업로드, 데이터베이스 설계 등의 실무 기술을 습득하는 것을 목표로 합니다.

### 해결하고자 하는 문제

- **인증/인가 시스템**: JWT 기반의 Access Token과 Refresh Token을 활용한 안전한 사용자 인증
- **토큰 만료 문제**: Axios Interceptor를 통한 자동 토큰 갱신으로 사용자 경험 개선
- **이미지 저장**: Supabase Storage를 활용한 효율적인 이미지 관리
- **반응형 UI**: Tailwind CSS를 활용한 모던하고 일관된 디자인 시스템

### 주요 특징 및 장점

- ✨ **모던한 기술 스택**: Next.js 16, Nest.js 11, TypeScript로 타입 안정성 보장
- 🔐 **안전한 인증 시스템**: JWT 기반 인증 및 자동 토큰 갱신
- 🎨 **아름다운 UI/UX**: 핑크-바이올렛 그라데이션 테마의 Instagram 스타일 디자인
- 📱 **반응형 디자인**: 다양한 화면 크기에 최적화된 레이아웃
- 🚀 **컴포넌트 기반 아키텍처**: 재사용 가능한 컴포넌트로 유지보수성 향상
- ⚡ **Skeleton UI**: 로딩 상태에 대한 부드러운 사용자 경험 제공

---

## 02. 프로젝트 주요 기능 🎯

### 🔑 인증 기능

- **회원가입**: 아이디, 닉네임, 비밀번호, 프로필 이미지로 계정 생성
- **로그인**: JWT 기반 인증 (Access Token + Refresh Token)
- **자동 토큰 갱신**: Axios Interceptor를 통한 자동 Access Token 갱신
- **로그아웃**: Refresh Token 무효화 및 쿠키 삭제

### 👤 프로필 관리

- **프로필 조회**: 사용자 정보 및 피드 개수 표시
- **프로필 수정**: 사용자명, 닉네임, 비밀번호, 프로필 이미지 수정
- **프로필 이미지**: Supabase Storage에 저장된 이미지 표시

### 📝 피드 기능

- **피드 생성**: 사진과 설명을 포함한 피드 게시물 작성
- **피드 조회**: 내 피드 목록을 그리드 형태로 표시
- **피드 상세 보기**: 모달을 통한 피드 상세 정보 확인
- **피드 수정**: 피드 설명 및 이미지 수정
- **피드 삭제**: 피드 게시물 삭제

### 🎨 UI/UX 기능

- **Skeleton UI**: 로딩 상태 시 스켈레톤 화면 표시
- **모달 시스템**: 피드 생성/수정/조회를 위한 모달 UI
- **Hover 효과**: 인터랙티브한 버튼 및 카드 호버 효과
- **커스텀 폰트**: SchoolSafetyWing 폰트 적용

---

## 03. 프로젝트 기술 스택 🛠️

### Frontend

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios 1.13.2
- **State Management**: React Hooks (useState, useEffect)

### Backend

- **Framework**: Nest.js 11.0.1
- **Language**: TypeScript 5.7.3
- **ORM**: TypeORM 0.3.28
- **Database**: PostgreSQL
- **Authentication**: JWT (@nestjs/jwt 11.0.2)
- **File Upload**: Multer 2.0.2
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: class-validator 0.14.3, class-transformer 0.5.1

### Infrastructure

- **Image Storage**: Supabase Storage
- **Database**: PostgreSQL (Render 또는 로컬)
- **Environment**: Node.js

### 주요 라이브러리 및 프레임워크

- **TypeORM**: 데이터베이스 ORM으로 PostgreSQL과 연동
- **Supabase**: 이미지 파일 저장 및 관리
- **JWT**: 사용자 인증 및 세션 관리
- **Axios Interceptors**: 자동 토큰 갱신 및 에러 핸들링
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

---

## 04. 프로젝트 설치 방법 💻

### 사전 요구사항

- Node.js 18 이상
- PostgreSQL 데이터베이스
- Supabase 계정 (이미지 저장용)

### Frontend 설정 (insta_front)

1. **프로젝트 디렉토리로 이동**

```bash
cd insta_front
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정 (선택사항)**
   `.env.local` 파일을 생성하고 백엔드 API URL을 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **개발 서버 실행**

```bash
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:3000`에서 실행됩니다.

5. **프로덕션 빌드**

```bash
npm run build
npm start
```

### Backend 설정 (insta_back)

1. **프로젝트 디렉토리로 이동**

```bash
cd insta_back
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_SCHEMA=insta

# JWT
JWT_SECRET=your_jwt_secret_key
ACCESS_EXPIRES_IN=3m
REFRESH_EXPIRES_IN=14d

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=your_bucket_name

# Cookie
COOKIE_SECURE=false
```

4. **데이터베이스 테이블 생성**
   PostgreSQL에서 다음 테이블들을 생성하세요:

- `users` 테이블 (id, username, nickname, password_hash, profile_image_url, created_at, updated_at)
- `feeds` 테이블 (id, user_id, photo_url, description, created_at, updated_at)
- `refresh_tokens` 테이블 (id, user_id, token, expires_at, created_at)

5. **서버 실행**

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

---

## 05. 기타 📚

### 프로젝트 구조

#### Frontend (insta_front)

```
insta_front/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx             # 로그인/회원가입 페이지
│   ├── profile/
│   │   └── page.tsx         # 프로필 페이지
│   └── globals.css          # 전역 스타일
├── src/
│   ├── components/
│   │   ├── auth/            # 인증 관련 컴포넌트
│   │   ├── profile/         # 프로필 관련 컴포넌트
│   │   ├── feeds/           # 피드 관련 컴포넌트
│   │   └── ui/              # 공통 UI 컴포넌트
│   ├── lib/
│   │   └── api.ts           # API 클라이언트 (Axios)
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   ├── utils/
│   │   ├── auth.ts          # 인증 유틸리티
│   │   └── validation.ts    # 유효성 검사
│   └── constants/
│       └── styles.ts        # 스타일 상수
└── package.json
```

#### Backend (insta_back)

```
insta_back/
├── src/
│   ├── modules/
│   │   ├── auth/            # 인증 모듈
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── entities/
│   │   ├── users/           # 사용자 모듈
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   └── feeds/           # 피드 모듈
│   │       ├── feeds.controller.ts
│   │       ├── feeds.service.ts
│   │       ├── entities/
│   │       └── dto/
│   ├── common/
│   │   ├── guard/           # JWT 가드
│   │   ├── filter/          # 예외 필터
│   │   └── interceptor/     # 응답 인터셉터
│   ├── infra/
│   │   └── supabase/        # Supabase 서비스
│   ├── configs/             # 설정 파일
│   └── app.module.ts        # 루트 모듈
└── package.json
```

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username (UK)   │
│ nickname        │
│ password_hash   │
│ profile_image   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴─────┐
    │          │
    │          │
┌───▼────┐  ┌─▼──────────────┐
│ feeds  │  │ refresh_tokens │
├────────┤  ├────────────────┤
│ id(PK) │  │ id (PK)        │
│ user_id│  │ user_id (FK)   │
│ photo  │  │ token          │
│ desc   │  │ expires_at     │
│ created│  │ created_at     │
│ updated│  └────────────────┘
└────────┘
```

### SQL문
```
-- users 테이블
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(30)  NOT NULL UNIQUE,     -- "아이디"
  nickname      VARCHAR(30)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- refresh_tokens 테이블 (한 유저 여러 로그인 허용하려면 여러개 저장 가능)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    VARCHAR(255) NOT NULL,
  is_revoked    BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

CREATE TABLE IF NOT EXISTS feeds (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 외래키 제약조건
  CONSTRAINT feeds_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS feeds_user_id_fkey ON feeds(user_id);
CREATE INDEX IF NOT EXISTS feeds_created_at_idx ON feeds(created_at DESC);

-- updated_at 자동 업데이트 트리거 함수 (선택사항)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_feeds_updated_at
  BEFORE UPDATE ON feeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**테이블 관계:**

- `users` : `feeds` = 1 : N (한 사용자는 여러 피드를 가질 수 있음)
- `users` : `refresh_tokens` = 1 : N (한 사용자는 여러 리프레시 토큰을 가질 수 있음)
- `feeds.user_id`는 `users.id`를 참조하며, CASCADE 삭제 설정

### 프로젝트 과정 중 발생한 트러블 슈팅 🔧

#### 1. **Path Alias 해결 문제**

**문제**: 리팩토링 후 `@/components` 경로를 인식하지 못하는 오류 발생 <br />
**원인**: `tsconfig.json`의 `paths` 설정이 `"@/*": ["./*"]`로 되어 있어 `src` 폴더를 제대로 참조하지 못함 <br />
**해결**: `"@/*": ["./src/*"]`로 수정하여 `src` 디렉토리를 올바르게 참조하도록 변경

#### 2. **JWT 의존성 주입 오류**

**문제**: `FeedsModule`에서 `JwtAuthGuard` 사용 시 `JwtService`를 찾을 수 없다는 오류 <br />
**원인**: `FeedsModule`에 `JwtModule`이 import되지 않음 <br />
**해결**: `FeedsModule`의 `imports` 배열에 `JwtModule.register({})` 추가

#### 3. **토큰 만료로 인한 자동 로그아웃**

**문제**: Access Token이 만료되면 사용자가 수동으로 다시 로그인해야 하는 문제 <br />
**원인**: `ACCESS_EXPIRES_IN=3m`으로 설정되어 있어 짧은 시간 내 토큰 만료 <br />
**해결**: Axios Interceptor를 구현하여 401 에러 발생 시 자동으로 Refresh Token을 사용해 Access Token을 갱신하고 원래 요청을 재시도하는 로직 추가

#### 4. **타입 에러: ApiResponse 타입 불일치**

**문제**: API 응답 타입이 `User | ApiResponse<User>`로 추론되어 타입 에러 발생 <br />
**원인**: API 응답 구조가 일관되지 않음 <br />
**해결**: API 클라이언트에서 `res.data?.data ?? res.data`로 응답 데이터를 일관되게 추출하도록 수정

#### 5. **React Hook 조건부 호출 경고**

**문제**: `useMemo`가 조건부로 호출되어 React Hook 규칙 위반 경고 발생 <br />
**원인**: `if (!isOpen || !feed) return null;` 이후에 `useMemo` 호출 <br />
**해결**: `useMemo`를 early return 이전으로 이동하여 항상 호출되도록 수정

### 프로젝트 후기 💭

이 프로젝트를 통해 풀스택 개발의 전반적인 흐름을 경험할 수 있었습니다. 특히 다음과 같은 부분에서 많은 것을 배웠습니다:

1. **인증 시스템 구현**: JWT 기반 인증과 Refresh Token을 활용한 세션 관리의 중요성을 이해했습니다. Axios Interceptor를 통해 자동 토큰 갱신을 구현하면서 클라이언트 측 인증 처리의 복잡성을 경험했습니다.

2. **컴포넌트 아키텍처**: 프론트엔드를 재사용 가능한 컴포넌트로 분리하면서 코드의 가독성과 유지보수성이 크게 향상되었습니다. 특히 `src/components` 폴더 구조를 통해 관심사의 분리를 실현했습니다.

3. **TypeORM과 데이터베이스 설계**: TypeORM을 활용하여 엔티티 간 관계를 정의하고, CASCADE 삭제 등의 데이터베이스 제약 조건을 설정하면서 데이터 무결성의 중요성을 배웠습니다.

4. **파일 업로드 처리**: Multer와 Supabase Storage를 연동하여 이미지 파일을 효율적으로 관리하는 방법을 학습했습니다.

5. **에러 핸들링**: 백엔드의 Exception Filter와 프론트엔드의 에러 처리 로직을 통해 사용자에게 친화적인 에러 메시지를 제공하는 방법을 익혔습니다.

앞으로는 실시간 기능(댓글, 좋아요), 무한 스크롤, 이미지 최적화 등의 기능을 추가하여 더욱 완성도 높은 프로젝트로 발전시키고 싶습니다.

---

## 06. 실행 화면 🖼️

<table>
  <tr>
    <th style="text-align:center;">로그인 화면</th>
    <th style="text-align:center;">회원가입 화면</th>
  </tr>
  <tr>
    <td align="center">
      <div style="background-color:#f5f5f5; padding:10px; border-radius:12px; display:inline-block;">
        <img
          width="444"
          height="379"
          alt="login"
          src="https://github.com/user-attachments/assets/6aaed7e5-fac2-4e56-85d2-cf2c987336b4"
          style="border-radius:12px;"
        />
      </div>
    </td>
    <td align="center">
      <div style="background-color:#f5f5f5; padding:10px; border-radius:12px; display:inline-block;">
        <img
          width="439"
          height="598"
          alt="signup"
          src="https://github.com/user-attachments/assets/28ed8617-1e54-410d-8a1e-c17966a8605e"
          style="border-radius:12px;"
        />
      </div>
    </td>
  </tr>
  <tr>
    <th colspan="2" style="text-align:center;">프로필 화면</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <div style="background-color:#f5f5f5; padding:16px; border-radius:16px; display:inline-block;">
        <img
          width="947"
          height="901"
          alt="profile"
          src="https://github.com/user-attachments/assets/4c6f79e4-be4f-4321-9fad-aeeb9c9a7ff2"
          style="border-radius:16px;"
        />
      </div>
    </td>
  </tr>
</table>


