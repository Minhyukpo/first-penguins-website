#!/bin/bash

# GitHub 저장소에 푸시하는 스크립트

echo "🚀 GitHub 저장소에 푸시하기"
echo "=========================================="

# 현재 원격 저장소 확인
echo "📋 현재 원격 저장소:"
git remote -v

echo ""
echo "⚠️  원격 저장소가 올바른지 확인하세요!"
echo ""
echo "원격 저장소를 설정하려면:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/first-penguins-website.git"
echo ""
echo "또는 기존 원격 저장소를 변경하려면:"
echo "  git remote set-url origin https://github.com/YOUR_USERNAME/first-penguins-website.git"
echo ""
read -p "계속하시겠습니까? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 1
fi

# 브랜치를 main으로 변경
echo "🌿 브랜치를 main으로 변경 중..."
git branch -M main

# 변경사항 확인
echo "📝 변경사항 확인 중..."
git status

# 푸시
echo ""
echo "📤 GitHub에 푸시 중..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 푸시 완료!"
    echo ""
    echo "🎉 다음 단계:"
    echo "1. Vercel 대시보드 접속: https://vercel.com/dashboard"
    echo "2. 프로젝트 선택 > Settings > Git"
    echo "3. 'Connect Git Repository' 클릭"
    echo "4. GitHub 저장소 선택"
    echo "5. 완료! 이제 자동 배포가 활성화됩니다!"
else
    echo ""
    echo "❌ 푸시 실패!"
    echo ""
    echo "가능한 원인:"
    echo "1. 원격 저장소가 설정되지 않았습니다"
    echo "2. GitHub 인증이 필요합니다"
    echo "3. 저장소 권한이 없습니다"
    echo ""
    echo "해결 방법:"
    echo "1. 원격 저장소 설정: git remote add origin https://github.com/USERNAME/first-penguins-website.git"
    echo "2. GitHub 인증: GitHub Personal Access Token 사용 또는 SSH 키 설정"
fi

