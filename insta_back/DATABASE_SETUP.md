# PostgreSQL 데이터베이스 설정 가이드 (NestJS Instagram 프로젝트)

## 방법 1: SQL 스크립트 사용 (직접 실행)

### 1단계: DBeaver에서 데이터베이스 생성

1. DBeaver를 실행하고 PostgreSQL 연결을 생성합니다.
2. 새 데이터베이스를 생성합니다:
   ```sql
   CREATE DATABASE insta_db;
   ```
   또는 DBeaver UI에서 우클릭 → "Create Database"를 선택합니다.

### 2단계: SQL 스크립트 실행

1. DBeaver에서 생성한 데이터베이스에 연결합니다.
2. `init_database.sql` 파일을 열거나 내용을 복사합니다.
3. DBeaver의 SQL 편집기에서 전체 스크립트를 실행합니다.
   - SQL 편집기 열기: `Alt + Shift + X` 또는 상단 메뉴에서 "SQL Editor" 선택
   - 스크립트 붙여넣기 후 실행: `Ctrl + Enter` 또는 실행 버튼 클릭

### 3단계: 환경 변수 설정

백엔드 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
# 데이터베이스 설정
DB_HOST=호스트주소
DB_PORT=5432
DB_USER=사용자명
DB_PASS=비밀번호
DB_NAME=데이터베이스명
DB_SCHEMA=insta

# JWT 설정 (기존 값 유지)
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS 설정
CORS_ORIGIN=http://localhost:3000

# Supabase 설정 (기존 값 유지)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

**예시 (로컬 PostgreSQL):**

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=insta_db
DB_SCHEMA=insta
```

**예시 (원격 PostgreSQL):**

```env
DB_HOST=your_host_address
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=insta_db
DB_SCHEMA=insta
```

### 4단계: SSL 설정 (원격 데이터베이스인 경우)

로컬 데이터베이스를 사용하는 경우, `app.module.ts`에서 SSL 설정을 제거하거나 조건부로 설정할 수 있습니다:

```typescript
// app.module.ts
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isRemote = config.get<string>('DB_HOST') !== 'localhost';
    return {
      type: 'postgres',
      host: config.get<string>('DB_HOST'),
      port: Number(config.get<string>('DB_PORT')),
      username: config.get<string>('DB_USER'),
      password: config.get<string>('DB_PASS'),
      database: config.get<string>('DB_NAME'),
      schema: config.get<string>('DB_SCHEMA'),
      autoLoadEntities: true,
      logging: true,
      synchronize: false,
      // 원격 데이터베이스인 경우에만 SSL 설정
      ...(isRemote && {
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      }),
    };
  },
}),
```

---

## 방법 2: TypeORM Synchronize 사용 (개발 환경만)

⚠️ **주의**: 이 방법은 개발 환경에서만 사용하세요. 프로덕션에서는 사용하지 마세요.

### 1단계: 데이터베이스 생성

DBeaver에서 데이터베이스를 생성합니다:

```sql
CREATE DATABASE insta_db;
```

### 2단계: 환경 변수 설정

`.env` 파일을 생성하고 데이터베이스 설정을 추가합니다 (방법 1의 3단계 참조).

### 3단계: synchronize 활성화

`app.module.ts`에서 `synchronize: true`로 변경:

```typescript
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    // ... 기존 설정 ...
    synchronize: true, // ⚠️ 개발 환경에서만 사용
  }),
}),
```

### 4단계: 애플리케이션 실행

```bash
npm run start:dev
```

TypeORM이 자동으로 엔티티를 기반으로 테이블을 생성합니다.

---

## 문제 해결

### 연결 오류가 발생하는 경우

1. **호스트/포트 확인**: PostgreSQL이 실행 중인지 확인하세요.
2. **인증 정보 확인**: 사용자명과 비밀번호가 올바른지 확인하세요.
3. **방화벽 설정**: 원격 데이터베이스인 경우 포트가 열려있는지 확인하세요.
4. **스키마 확인**: `DB_SCHEMA=insta`가 올바르게 설정되었는지 확인하세요.

### 테이블이 이미 존재하는 경우

SQL 스크립트는 기존 테이블을 삭제하고 다시 생성합니다. 데이터를 보존하려면:

- SQL 스크립트에서 `DROP TABLE` 부분을 제거하거나
- 기존 데이터를 백업한 후 실행하세요.

### SSL 연결 오류

로컬 데이터베이스를 사용하는 경우 SSL 설정을 제거하세요 (위의 4단계 참조).

### 스키마 관련 오류

- `DB_SCHEMA=insta`가 `.env` 파일에 설정되어 있는지 확인하세요.
- 데이터베이스에 `insta` 스키마가 생성되었는지 확인하세요.

---

## 데이터베이스 구조

### 스키마: `insta`

생성되는 테이블:

1. **users** (사용자)
   - `id`: BIGSERIAL (PK)
   - `username`: VARCHAR(30), UNIQUE
   - `nickname`: VARCHAR(30)
   - `password_hash`: VARCHAR(255)
   - `profile_image_url`: TEXT (nullable)
   - `created_at`: TIMESTAMP WITH TIME ZONE
   - `updated_at`: TIMESTAMP WITH TIME ZONE

2. **feeds** (피드)
   - `id`: BIGSERIAL (PK)
   - `user_id`: BIGINT (FK → users.id)
   - `photo_url`: TEXT
   - `description`: TEXT
   - `created_at`: TIMESTAMP WITH TIME ZONE
   - `updated_at`: TIMESTAMP WITH TIME ZONE

3. **refresh_tokens** (리프레시 토큰)
   - `id`: BIGSERIAL (PK)
   - `user_id`: BIGINT (FK → users.id)
   - `token_hash`: VARCHAR(255)
   - `is_revoked`: BOOLEAN (default: false)
   - `expires_at`: TIMESTAMP WITH TIME ZONE
   - `created_at`: TIMESTAMP WITH TIME ZONE

### 관계:

- `feeds.user_id` → `users.id` (CASCADE 삭제/업데이트)
- `refresh_tokens.user_id` → `users.id` (CASCADE 삭제)

### 인덱스:

- `users.username`: UNIQUE 인덱스
- `feeds.user_id`: 인덱스
- `refresh_tokens.user_id`: 인덱스
- `refresh_tokens.expires_at`: 인덱스

---

## 다음 단계

데이터베이스 설정이 완료되면:

1. 애플리케이션 실행:

   ```bash
   npm run start:dev
   ```

2. API 테스트:
   - 회원가입: `POST /auth/signup`
   - 로그인: `POST /auth/login`
   - 피드 조회: `GET /feeds`
