-- =============================================================================
-- Instagram Clone 프로젝트 - 최초 DB 세팅용 SQL (PostgreSQL)
-- Supabase SQL Editor: 프로젝트 선택 → SQL Editor → New query → 붙여넣기 → Run
-- DBeaver: 연결한 DB 선택 후 이 스크립트 전체 실행
-- 테이블은 insta 스키마에 생성됩니다. .env의 DB_SCHEMA=insta 로 설정하세요.
-- =============================================================================

-- 1. insta 스키마 생성
CREATE SCHEMA IF NOT EXISTS insta;

-- 2. users 테이블
CREATE TABLE IF NOT EXISTS insta.users (
  id                BIGSERIAL PRIMARY KEY,
  username          VARCHAR(30)  NOT NULL UNIQUE,
  nickname          VARCHAR(30)  NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. refresh_tokens 테이블
CREATE TABLE IF NOT EXISTS insta.refresh_tokens (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES insta.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON insta.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON insta.refresh_tokens(expires_at);

-- 4. feeds 테이블
CREATE TABLE IF NOT EXISTS insta.feeds (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  photo_url   TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT feeds_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES insta.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS feeds_user_id_idx ON insta.feeds(user_id);
CREATE INDEX IF NOT EXISTS feeds_created_at_idx ON insta.feeds(created_at DESC);

-- 5. updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION insta.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. users / feeds 의 updated_at 자동 갱신 트리거
DROP TRIGGER IF EXISTS update_users_updated_at ON insta.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON insta.users
  FOR EACH ROW
  EXECUTE FUNCTION insta.update_updated_at_column();

DROP TRIGGER IF EXISTS update_feeds_updated_at ON insta.feeds;
CREATE TRIGGER update_feeds_updated_at
  BEFORE UPDATE ON insta.feeds
  FOR EACH ROW
  EXECUTE FUNCTION insta.update_updated_at_column();

-- 완료
SELECT '테이블 초기화 완료 (insta 스키마)' AS message;
