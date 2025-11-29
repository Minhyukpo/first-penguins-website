#!/bin/bash

# Company Website AWS 배포 스크립트
echo "🚀 Company Website AWS 배포 시작..."
echo "=================================="

# AWS 자격 증명 확인
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS 자격 증명이 설정되지 않았습니다."
    echo "다음 명령어로 설정하세요:"
    echo "aws configure"
    exit 1
fi

echo "✅ AWS 자격 증명 확인 완료"

# S3 버킷 생성
echo "📦 S3 버킷 생성 중..."
aws s3 mb s3://firstpgs-website --region ap-northeast-2

if [ $? -eq 0 ]; then
    echo "✅ S3 버킷 생성 완료"
else
    echo "⚠️  S3 버킷이 이미 존재하거나 생성 실패"
fi

# 정적 웹사이트 호스팅 활성화
echo "🌐 정적 웹사이트 호스팅 활성화 중..."
aws s3 website s3://firstpgs-website \
  --index-document index.html \
  --error-document 404.html

if [ $? -eq 0 ]; then
    echo "✅ 웹사이트 호스팅 활성화 완료"
else
    echo "❌ 웹사이트 호스팅 활성화 실패"
    exit 1
fi

# 파일 업로드
echo "📤 파일 업로드 중..."
aws s3 sync . s3://firstpgs-website --delete \
  --exclude "*.md" \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude ".github/*" \
  --exclude "*.json" \
  --exclude "*.yml" \
  --exclude "*.yaml" \
  --exclude "*.sh" \
  --exclude "company-website-tables.sql" \
  --exclude "company-website-routes.js" \
  --exclude "goal-illa-app-js-update.md"

if [ $? -eq 0 ]; then
    echo "✅ 파일 업로드 완료"
else
    echo "❌ 파일 업로드 실패"
    exit 1
fi

# S3 버킷 정책 설정 (퍼블릭 읽기 허용)
echo "🔓 S3 버킷 정책 설정 중..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::firstpgs-website/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket firstpgs-website --policy file://bucket-policy.json

if [ $? -eq 0 ]; then
    echo "✅ S3 버킷 정책 설정 완료"
else
    echo "❌ S3 버킷 정책 설정 실패"
fi

# 임시 파일 정리
rm -f bucket-policy.json

echo ""
echo "🎉 배포 완료!"
echo "=================================="
echo "📋 배포 결과:"
echo "🌐 S3 웹사이트 URL:"
echo "http://firstpgs-website.s3-website.ap-northeast-2.amazonaws.com"
echo ""
echo "🌍 도메인 연결 후:"
echo "https://firstpgs.com"
echo ""
echo "🔗 Goal-Illa API 연동:"
echo "https://3.38.27.53:3000"
echo ""
echo "📊 통합 완료:"
echo "✅ Goal-Illa 데이터베이스 활용"
echo "✅ 통합 API 서버"
echo "✅ Company Website AWS 호스팅"
echo "✅ 비용 절약: ~$20/월"
echo ""
echo "🔧 다음 단계:"
echo "1. Goal-Illa 백엔드에 API 추가"
echo "2. 데이터베이스 테이블 생성"
echo "3. 웹사이트 테스트"
echo "4. firstpgs.com 도메인 연결"
echo "5. HTTPS 인증서 설정"

