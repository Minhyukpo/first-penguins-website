#!/bin/bash

# Git 저장소 초기화 및 자동 배포 설정 스크립트

echo "🚀 Git 저장소 초기화 및 자동 배포 설정"
echo "=========================================="

# Git 저장소가 이미 초기화되어 있는지 확인
if [ -d ".git" ]; then
    echo "✅ Git 저장소가 이미 초기화되어 있습니다."
else
    echo "📦 Git 저장소 초기화 중..."
    git init
    git branch -M main
fi

# .gitignore 확인
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore 파일이 있습니다."
else
    echo "⚠️  .gitignore 파일이 없습니다."
fi

# 변경사항 추가
echo "📝 변경사항 추가 중..."
git add .

# 커밋
echo "💾 커밋 중..."
git commit -m "feat: 사이트 개선 및 자동 배포 설정

- SEO 메타 태그 URL 업데이트 (firstpgs.com)
- 이미지 최적화 (lazy loading, width/height 속성)
- 접근성 개선 (ARIA 레이블 추가)
- 전역 에러 핸들러 추가
- 보안 헤더 강화
- 캐싱 헤더 추가
- 자동 배포 설정 (GitHub Actions)"

echo ""
echo "✅ Git 커밋 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. GitHub에서 새 저장소 생성: https://github.com/new"
echo "2. 저장소 이름 입력 (예: first-penguins-website)"
echo "3. 다음 명령어 실행:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/first-penguins-website.git"
echo "   git push -u origin main"
echo ""
echo "4. Vercel 대시보드에서 Git 연동:"
echo "   - Settings > Git > Connect Git Repository"
echo "   - GitHub 저장소 선택"
echo ""
echo "🎉 완료되면 자동 배포가 활성화됩니다!"

