-- =============================================================================
-- Instagram Clone 프로젝트 - 최초 DB 세팅용 SQL (PostgreSQL)
-- DBeaver에서 연결한 DB 선택 후 이 스크립트 전체 실행
-- 테이블은 public 스키마에 생성됩니다. .env의 DB_SCHEMA=public 로 설정하고
-- 백엔드 엔티티의 schema: 'insta' 를 schema: 'public' 으로 변경하세요.
-- =============================================================================

-- 1. users 테이블
CREATE TABLE IF NOT EXISTS users (
  id                BIGSERIAL PRIMARY KEY,
  username          VARCHAR(30)  NOT NULL UNIQUE,
  nickname          VARCHAR(30)  NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. refresh_tokens 테이블
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- 3. feeds 테이블
CREATE TABLE IF NOT EXISTS feeds (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  photo_url   TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT feeds_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS feeds_user_id_idx ON feeds(user_id);
CREATE INDEX IF NOT EXISTS feeds_created_at_idx ON feeds(created_at DESC);

-- 4. updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. users / feeds 의 updated_at 자동 갱신 트리거
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feeds_updated_at ON feeds;
CREATE TRIGGER update_feeds_updated_at
  BEFORE UPDATE ON feeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 완료
SELECT '테이블 초기화 완료 (public 스키마).' AS message;
