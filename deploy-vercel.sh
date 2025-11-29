#!/bin/bash

# Vercel 배포 스크립트
echo "🚀 Vercel 배포 시작..."
echo "=================================="

# Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI 설치 중..."
    npm i -g vercel
fi

echo "✅ Vercel CLI 확인 완료"

# 프로덕션 배포
echo "🌐 프로덕션 배포 중..."
vercel --prod

echo ""
echo "🎉 배포 완료!"
echo "=================================="
echo "📋 다음 단계:"
echo "1. 배포된 URL 확인"
echo "2. 백엔드 서버 연결 확인"
echo "3. CORS 설정 확인 (필요시)"

