# LENS 배포 가이드

Ubuntu 22.04 LTS + Nginx + PM2 기준 프로덕션 배포 절차

---

## 아키텍처

```
Browser
  │
  │  HTTPS :443
  ▼
Nginx (reverse proxy)
  ├── /          → dist/index.html  (정적 파일 서빙)
  └── /api/*     → localhost:3001   (Express 백엔드)
```

**보안 원칙:**
- OpenAI API Key는 `lens-api/.env` 파일에만 존재
- 브라우저 bundle에 API Key가 포함되지 않음
- `/api/*` 경로만 백엔드로 프록시, 나머지는 정적 파일 서빙

---

## 사전 준비

```bash
# Node.js 20 LTS 설치 (nvm 사용 권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# PM2 전역 설치
npm install -g pm2

# Nginx 설치
sudo apt update
sudo apt install -y nginx

# (선택) Certbot for HTTPS
sudo apt install -y certbot python3-certbot-nginx
```

---

## 1. 코드 배포

```bash
# 레포지토리 클론
git clone https://github.com/<your-org>/2026-DACON-Invest-Visualizer.git /var/www/lens
cd /var/www/lens
```

---

## 2. 백엔드 설정

```bash
cd /var/www/lens/lens-api

# 의존성 설치
npm install --omit=dev

# 환경변수 설정 (샘플 복사 후 편집)
cp .env.example .env
nano .env
```

`.env` 내용 예시:
```env
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4.1-mini
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com
```

```bash
# TypeScript 빌드
npm run build

# PM2로 실행
pm2 start dist/index.js --name lens-api

# 시스템 재시작 시 자동 실행 등록
pm2 save
pm2 startup
```

PM2 상태 확인:
```bash
pm2 status
pm2 logs lens-api
```

---

## 3. 프론트엔드 빌드

```bash
cd /var/www/lens/lens-local-app

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
# → dist/ 폴더에 정적 파일 생성
```

> **주의:** 빌드 결과물(`dist/`)에 API Key가 포함되어서는 안 됩니다.
> `VITE_OPENAI_API_KEY` 같은 환경변수를 절대 추가하지 마세요.

---

## 4. Nginx 설정

```bash
sudo nano /etc/nginx/sites-available/lens
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL (Certbot이 자동으로 채워줌)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 정적 파일 서빙 (React 빌드 결과물)
    root /var/www/lens/lens-local-app/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 역방향 프록시 → Express 백엔드
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Request body size limit (backend와 일치)
        client_max_body_size 512k;

        # Timeouts
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # 보안 헤더
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy no-referrer-when-downgrade;
}
```

```bash
# 설정 활성화
sudo ln -sf /etc/nginx/sites-available/lens /etc/nginx/sites-enabled/lens

# 설정 검증
sudo nginx -t

# 재시작
sudo systemctl reload nginx
```

---

## 5. HTTPS 인증서 발급 (선택)

```bash
sudo certbot --nginx -d your-domain.com

# 자동 갱신 확인
sudo systemctl status certbot.timer
```

---

## 6. 배포 확인

```bash
# 백엔드 헬스 체크
curl https://your-domain.com/api/health
# → {"status":"ok","timestamp":"...","model":"gpt-4.1-mini","aiConfigured":true}

# 프론트엔드
# 브라우저에서 https://your-domain.com 접속
```

---

## 7. 업데이트 배포

```bash
cd /var/www/lens

# 코드 갱신
git pull

# 백엔드 재빌드
cd lens-api && npm run build && pm2 restart lens-api && cd ..

# 프론트엔드 재빌드
cd lens-local-app && npm run build && cd ..

# Nginx reload (설정 변경 시만 필요)
sudo systemctl reload nginx
```

---

## 8. 개발 환경 실행

두 터미널에서 각각 실행:

```bash
# Terminal 1: 백엔드
cd lens-api
cp .env.example .env   # OPENAI_API_KEY 입력
npm install
npm run dev            # http://localhost:3001

# Terminal 2: 프론트엔드
cd lens-local-app
npm install
npm run dev            # http://localhost:5173
# /api/* 요청은 Vite proxy → localhost:3001 자동 전달
```

백엔드 없이도 프론트엔드는 실행 가능합니다 (rule-based fallback 모드).

---

## 주요 파일 위치

| 파일 | 목적 |
|------|------|
| `lens-api/.env` | OpenAI API Key (git에 포함 금지) |
| `lens-api/.env.example` | 환경변수 샘플 (git에 포함) |
| `lens-api/dist/` | TypeScript 빌드 결과물 |
| `lens-local-app/dist/` | React 빌드 결과물 (Nginx가 서빙) |

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| PM2 프로세스 크래시 | `.env` 미설정 | `pm2 logs lens-api` 확인 후 `.env` 수정 |
| Nginx 502 Bad Gateway | 백엔드 미실행 | `pm2 status` 확인 |
| CORS 오류 | `ALLOWED_ORIGINS` 미등록 | `.env`에 프론트엔드 도메인 추가 |
| 429 Too Many Requests | Rate limit 초과 | `lens-api/src/index.ts` `limit` 값 조정 후 재빌드 |
| AI 분석 안 됨 (fallback 표시) | `OPENAI_API_KEY` 미설정 | `/api/health`에서 `aiConfigured` 확인 |

---

*LENS — Skills.md 기반 투자 데이터 분석 · 배포 가이드*
