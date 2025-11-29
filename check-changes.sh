#!/bin/bash

# 변경사항 확인 스크립트

echo "📋 현재 변경사항 확인"
echo "===================="
echo ""

# Git 상태 확인
echo "🔍 Git 상태:"
git status --short
echo ""

# 변경된 파일 목록
CHANGED_FILES=$(git diff --name-only)
if [ -z "$CHANGED_FILES" ]; then
    echo "✅ 변경된 파일 없음 (모두 커밋됨)"
else
    echo "📝 변경된 파일:"
    echo "$CHANGED_FILES" | while read file; do
        echo "  - $file"
    done
    echo ""
    
    echo "📊 변경 통계:"
    git diff --stat
    echo ""
    
    echo "💡 변경사항을 확인하려면:"
    echo "   git diff"
    echo ""
    echo "💡 특정 파일만 확인하려면:"
    echo "   git diff [파일명]"
fi

echo ""
echo "🚀 배포하려면:"
echo "   git add ."
echo "   git commit -m '변경사항 설명'"
echo "   git push origin main"

