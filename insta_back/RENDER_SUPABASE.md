# Render 배포 시 Supabase ENETUNREACH 오류 해결

## 원인

Render 무료 플랫폼에서는 **IPv6 아웃바운드**가 제한됩니다.  
Supabase **Direct 연결**(`db.xxx.supabase.co`)은 IPv6를 기본으로 사용하므로 Render에서 `ENETUNREACH`가 발생합니다.

## 해결: Supabase Session Pooler 사용

**Session Pooler**는 IPv4를 지원하므로 Render에서 정상 동작합니다.

### 1. Supabase 대시보드에서 연결 정보 확인

1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. **Project Settings** (좌측 하단 톱니바퀴) → **Database**
3. **Connection string** 섹션에서 **URI** 탭 선택
4. **Session pooler** (포트 5432) 선택
5. 표시되는 연결 문자열 예시:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

### 2. Render 환경 변수 설정

Render Dashboard → Web Service → **Environment** 탭에서 아래와 같이 설정하세요:

| 변수 | 값 |
|------|-----|
| `DB_HOST` | `aws-0-[REGION].pooler.supabase.com` (예: `aws-0-ap-southeast-1.pooler.supabase.com`) |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres.[PROJECT-REF]` (예: `postgres.wqqwuktgmoiknbktcuvv`) |
| `DB_PASS` | Supabase DB 비밀번호 |
| `DB_NAME` | `postgres` |
| `DB_SCHEMA` | `insta` |

> **REGION** 예시: Singapore → `ap-southeast-1`, Seoul → `ap-northeast-2`  
> **PROJECT-REF**는 Supabase URL의 `https://[PROJECT-REF].supabase.co` 부분입니다.

### 3. 저장 후 재배포

**Save Changes** 클릭 시 자동으로 재배포됩니다. 배포 완료 후 `/health` 엔드포인트로 연결을 확인하세요.

---

## "Tenant or user not found" 오류

이 오류는 **DB_USER 형식이 잘못됐을 때** 발생합니다. Session Pooler에서는 반드시 아래 형식을 사용해야 합니다.

### DB_USER 형식

| 잘못됨 (Direct 연결용) | 맞음 (Session Pooler용) |
|------------------------|-------------------------|
| `postgres`             | `postgres.[프로젝트ID]` |

### 확인 방법

1. **프로젝트 ID 확인**: Supabase 대시보드 주소 또는 API URL  
   - 예: `https://wqqwuktgmoiknbktcuvv.supabase.co` → 프로젝트 ID는 `wqqwuktgmoiknbktcuvv`
2. **DB_USER**: `postgres` + `.` + 프로젝트ID  
   - 예: `postgres.wqqwuktgmoiknbktcuvv` (중간에 점 하나)
3. **공백/오타**: Render 환경 변수에 앞뒤 공백이나 오타가 없는지 확인

### Supabase에서 정확한 값 복사

1. **Project Settings** → **Database**
2. **Connection string** → **URI** 탭
3. **Session pooler** 선택
4. 표시되는 URI를 파싱:
   ```
   postgresql://postgres.[여기가_PROJECT-REF]:비밀번호@aws-0-[리전].pooler.supabase.com:5432/postgres
   ```
   - `postgres.` 다음부터 `:` 직전까지가 **DB_USER 전체**
   - `@` 다음부터 `:` 직전이 **DB_HOST**
