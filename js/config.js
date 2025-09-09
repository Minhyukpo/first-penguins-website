// First-Penguins 웹사이트 환경 설정
// 개발/프로덕션 환경에 따라 자동으로 설정됩니다.

const CONFIG = {
    // 환경 감지
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // API 엔드포인트 설정
    api: {
        baseUrl: (() => {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'http://localhost:3001'; // 개발 환경
            } else {
                return 'https://first-penguins-backend-dhci14g1t-minhyuk-jeongs-projects.vercel.app'; // 프로덕션 환경
            }
        })(),
        
        endpoints: {
            login: '/login',
            register: '/register',
            items: '/api/items',
            checkId: '/check-id',
            devStatus: '/dev/status',
            devReset: '/dev/reset'
        }
    },
    
    // 앱 설정
    apps: {
        goalIlla: {
            name: 'Goal-Illa',
            icon: '🎯',
            dashboardUrl: 'dashboard/goal-illa.html',
            appUrl: 'apps/goal-illa.html'
        }
    },
    
    // UI 설정
    ui: {
        theme: {
            default: 'light',
            storageKey: 'theme'
        },
        auth: {
            tokenKey: 'currentUser',
            refreshTokenKey: 'refreshToken'
        }
    },
    
    // 외부 서비스
    external: {
        googleAnalytics: {
            enabled: false, // 필요시 true로 변경
            measurementId: 'GA_MEASUREMENT_ID' // 실제 ID로 교체
        },
        instagram: {
            username: 'goal_illa.office',
            url: 'https://instagram.com/goal_illa.office'
        }
    }
};

// API URL 헬퍼 함수
CONFIG.api.getUrl = function(endpoint) {
    return this.baseUrl + this.endpoints[endpoint];
};

// 환경 정보 출력 (개발 모드에서만)
if (CONFIG.isDevelopment) {
    console.log('🔧 개발 환경 설정:', CONFIG);
}

// 전역에서 사용할 수 있도록 window 객체에 추가
window.CONFIG = CONFIG;
