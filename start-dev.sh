#!/bin/bash

# 로컬 개발 서버 시작 스크립트

echo "🚀 로컬 개발 서버 시작 중..."
echo ""

# 포트 확인
PORT=8000

# 포트가 사용 중인지 확인
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # 포트 사용 중
    else
        return 1  # 포트 사용 가능
    fi
}

if check_port $PORT; then
    echo "⚠️  포트 $PORT가 이미 사용 중입니다."
    echo "다른 포트를 사용하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        while true; do
            echo "사용할 포트 번호를 입력하세요:"
            read -r NEW_PORT
            if [[ ! "$NEW_PORT" =~ ^[0-9]+$ ]] || [ "$NEW_PORT" -lt 1024 ] || [ "$NEW_PORT" -gt 65535 ]; then
                echo "❌ 올바른 포트 번호를 입력하세요 (1024-65535)"
                continue
            fi
            if check_port $NEW_PORT; then
                echo "⚠️  포트 $NEW_PORT도 이미 사용 중입니다. 다른 포트를 선택해주세요."
                continue
            else
                PORT=$NEW_PORT
                echo "✅ 포트 $PORT 사용 가능"
                break
            fi
        done
    else
        echo "기존 프로세스를 종료하고 계속하시겠습니까? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            lsof -ti:$PORT | xargs kill -9 2>/dev/null
            echo "✅ 기존 프로세스 종료됨"
            sleep 1
        else
            echo "❌ 서버 시작 취소"
            exit 1
        fi
    fi
fi

# Python 버전 확인
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 발견"
    echo ""
    echo "🌐 서버 시작됨!"
    echo "📍 로컬 주소: http://localhost:$PORT"
    echo "📍 네트워크 주소: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):$PORT"
    echo ""
    echo "💡 브라우저에서 위 주소로 접속하세요"
    echo "💡 서버를 중지하려면 Ctrl+C를 누르세요"
    echo ""
    echo "=================================="
    echo ""
    # 서버 시작
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ Python 발견"
    echo ""
    echo "🌐 서버 시작됨!"
    echo "📍 로컬 주소: http://localhost:$PORT"
    echo ""
    echo "💡 브라우저에서 위 주소로 접속하세요"
    echo "💡 서버를 중지하려면 Ctrl+C를 누르세요"
    echo ""
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Python이 설치되어 있지 않습니다."
    echo ""
    echo "Node.js를 사용하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        if command -v npx &> /dev/null; then
            echo "✅ Node.js 발견"
            echo ""
            echo "🌐 서버 시작됨!"
            echo "📍 로컬 주소: http://localhost:$PORT"
            echo ""
            echo "💡 브라우저에서 위 주소로 접속하세요"
            echo "💡 서버를 중지하려면 Ctrl+C를 누르세요"
            echo ""
            npx http-server -p $PORT -o
        else
            echo "❌ Node.js가 설치되어 있지 않습니다."
            exit 1
        fi
    else
        echo "❌ 서버 시작 실패"
        exit 1
    fi
fi

