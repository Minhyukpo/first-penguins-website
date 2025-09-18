# First-Penguins Company Website

First-Penguins의 공식 웹사이트입니다. 혁신적인 모바일 앱 개발과 교육 기술 분야에서 새로운 가치를 창조하는 기업의 소개와 서비스를 제공합니다.

## 주요 기능

### 🏠 메인 웹사이트

- **회사 소개**: First-Penguins의 3R 철학 (재정의, 재도약, 재분배)
- **사업 영역**: 교육 기술, 혁신 기술, 사회적 가치 창출
- **팀 소개**: 3명의 공동창업자 프로필
- **블로그 & 뉴스**: 최신 소식과 인사이트
- **Instagram 연동**: 실시간 소셜 미디어 피드

### 🎯 Goal-Illa 앱

- **목표 관리**: 개인화된 목표 설정 및 추적
- **AI 추천 시스템**: 스마트한 목표 추천
- **진행 상황 분석**: 상세한 통계 및 분석
- **대시보드**: 직관적인 사용자 인터페이스

### 📞 고객 지원

- **문의하기**: 다양한 문의 유형 지원
- **FAQ**: 자주 묻는 질문과 답변
- **공지사항**: 중요한 업데이트 및 소식
- **뉴스레터**: 정기적인 업데이트 구독

### 👨‍💼 관리자 기능

- **관리자 대시보드**: 문의 및 불편함 제출 관리
- **문의 관리**: 모든 문의사항 조회 및 상태 관리
- **불편함 제출 관리**: 사용자가 제출한 불편함 검토 및 처리
- **상태 관리**: 문의 및 불편함 처리 상태 업데이트
- **통계 대시보드**: 실시간 문의 및 불편함 제출 통계
- **데이터 내보내기**: CSV 형태로 데이터 다운로드

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.0
- **Fonts**: Noto Sans KR (Google Fonts)
- **API Integration**: RESTful API with Goal-Illa backend
- **Authentication**: JWT-based authentication
- **PWA**: Progressive Web App support

## 프로젝트 구조

```
company-website/
├── index.html              # 메인 페이지
├── admin/
│   └── dashboard.html      # 관리자 대시보드
├── auth/
│   ├── login.html          # 로그인 페이지
│   ├── register.html       # 회원가입 페이지
│   ├── profile.html        # 프로필 페이지
│   └── forgot-password.html # 비밀번호 찾기
├── support/
│   ├── contact.html        # 문의하기
│   ├── faq.html           # FAQ
│   ├── announcements.html  # 공지사항
│   ├── privacy-policy.html # 개인정보처리방침
│   └── terms-of-service.html # 이용약관
├── dashboard/
│   └── goal-illa.html     # Goal-Illa 대시보드
├── apps/
│   └── goal-illa.html     # Goal-Illa 앱 소개
├── css/
│   ├── style.css          # 메인 스타일시트
│   └── responsive.css     # 반응형 디자인
├── js/
│   ├── main.js            # 메인 JavaScript
│   ├── config.js          # 환경 설정
│   ├── company-website-api.js # API 연동
│   └── apps-config.js     # 앱 설정
└── images/                # 이미지 리소스
```

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/minhyukpo/first-penguins-website.git
cd first-penguins-website
```

### 2. 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server 확장 사용
```

### 3. 브라우저에서 접속

```
http://localhost:8000
```

## 관리자 계정

### 관리자 로그인

- **아이디**: `goalilla`
- **비밀번호**: `goalilla23`

### 관리자 기능

1. **문의 관리**: 모든 문의사항 조회 및 상태 관리
2. **불편함 제출 관리**: 사용자가 제출한 불편함 검토 및 처리
3. **통계 확인**: 실시간 문의 및 불편함 제출 통계
4. **상태 업데이트**: 문의 및 불편함 처리 상태 변경
5. **데이터 내보내기**: CSV 형태로 데이터 내보내기

## API 연동

### Goal-Illa 백엔드 API

- **Base URL**: `https://3.38.27.53:3000` (프로덕션)
- **개발 환경**: `http://localhost:3000`

### 주요 엔드포인트

- `/api/auth/login` - 사용자 로그인
- `/api/auth/register` - 사용자 회원가입
- `/api/items` - Goal-Illa 목표 데이터
- `/api/website/inquiries` - 문의 관리
- `/api/website/announcements` - 공지사항
- `/api/website/faqs` - FAQ

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### GitHub Pages

```bash
# gh-pages 브랜치에 배포
npm run deploy
```

## 개발 가이드

### 코드 스타일

- **HTML**: 시맨틱 마크업 사용
- **CSS**: BEM 방법론 적용
- **JavaScript**: ES6+ 문법 사용

### 브라우저 지원

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 반응형 디자인

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 라이선스

© 2025 First-Penguins. All rights reserved.

## 연락처

- **이메일**: goalillaoffice@gmail.com
- **Instagram**: [@goal_illa.office](https://instagram.com/goal_illa.office)
- **웹사이트**: [First-Penguins](https://minhyukpo.github.io/first-penguins-website)

---

**First-Penguins** - 새로운 영역을 개척하는 혁신 기업 🐧
