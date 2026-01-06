-- PostgreSQL 데이터베이스 초기화 SQL 스크립트 (public 스키마 버전)
-- NestJS Instagram 프로젝트용
-- DBeaver에서 실행하거나 psql에서 실행할 수 있습니다.

-- 1. 데이터베이스 생성 (필요한 경우)
-- 주의: DBeaver에서 이미 데이터베이스를 생성했다면 이 부분은 건너뛰세요
-- CREATE DATABASE insta_db;

-- 2. 데이터베이스 연결 (psql을 사용하는 경우)
-- \c insta_db;

-- 3. 기존 테이블 삭제 (이미 존재하는 경우)
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS feeds CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 4. 기존 인덱스 삭제 (혹시 남아있을 수 있음)
DROP INDEX IF EXISTS users_username_key;
DROP INDEX IF EXISTS feeds_user_id_fkey;
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;
DROP INDEX IF EXISTS idx_refresh_tokens_expires_at;

-- 5. 기존 트리거 및 함수 삭제
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_feeds_updated_at ON feeds;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 6. users 테이블 생성
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    nickname VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. users 테이블 인덱스 생성
CREATE UNIQUE INDEX users_username_key ON users(username);

-- 8. feeds 테이블 생성
CREATE TABLE feeds (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    photo_url TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT feeds_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 9. feeds 테이블 인덱스 생성
-- 주의: feeds_pkey는 PRIMARY KEY가 자동으로 생성하므로 별도로 만들 필요 없음
CREATE INDEX feeds_user_id_fkey ON feeds(user_id);

-- 10. refresh_tokens 테이블 생성
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- 11. refresh_tokens 테이블 인덱스 생성
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- 12. updated_at 자동 업데이트를 위한 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. users 테이블의 updated_at 자동 업데이트 트리거 생성
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 14. feeds 테이블의 updated_at 자동 업데이트 트리거 생성
CREATE TRIGGER update_feeds_updated_at 
    BEFORE UPDATE ON feeds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
SELECT 'Instagram 데이터베이스 초기화가 완료되었습니다!' AS message;

