// First-Penguins 앱 관리 시스템
// 새로운 앱을 추가할 때는 이 파일을 수정하면 됩니다.

const APPS_CONFIG = {
    'goal-illa': {
        id: 'goal-illa',
        name: 'Goal-Illa',
        icon: '🎯',
        description: '목표 설정과 달성을 도와주는 혁신적인 앱',
        category: 'productivity',
        status: 'active', // active, coming-soon, maintenance
        features: ['목표 관리', '진행률 추적', '통계 분석'],
        dashboardUrl: 'dashboard/goal-illa.html',
        appUrl: 'apps/goal-illa.html',
        apiEndpoint: window.CONFIG ? window.CONFIG.api.baseUrl : 'https://first-penguins-backend-dhci14g1t-minhyuk-jeongs-projects.vercel.app', // Goal-Illa API 서버
        hasWebDashboard: true,
        hasMobileApp: true,
        releaseDate: '2024-01-01',
        version: '1.0.0',
        stats: {
            downloads: 1000,
            rating: 4.5,
            activeUsers: 500
        }
    },
    'future-app-1': {
        id: 'future-app-1',
        name: 'TaskMaster',
        icon: '📋',
        description: '업무 관리와 협업을 위한 통합 플랫폼',
        category: 'productivity',
        status: 'coming-soon',
        features: ['업무 관리', '팀 협업', '프로젝트 추적'],
        dashboardUrl: null,
        appUrl: null,
        apiEndpoint: null,
        hasWebDashboard: false,
        hasMobileApp: false,
        releaseDate: '2024-06-01',
        version: '0.0.0',
        stats: {
            downloads: 0,
            rating: 0,
            activeUsers: 0
        }
    },
    'future-app-2': {
        id: 'future-app-2',
        name: 'HealthTracker',
        icon: '💪',
        description: '건강 관리와 운동 추적을 위한 앱',
        category: 'health',
        status: 'coming-soon',
        features: ['운동 추적', '건강 기록', '영양 관리'],
        dashboardUrl: null,
        appUrl: null,
        apiEndpoint: null,
        hasWebDashboard: false,
        hasMobileApp: false,
        releaseDate: '2024-09-01',
        version: '0.0.0',
        stats: {
            downloads: 0,
            rating: 0,
            activeUsers: 0
        }
    }
};

// 앱 카테고리별 그룹화
const APPS_BY_CATEGORY = {
    'productivity': ['goal-illa', 'future-app-1'],
    'health': ['future-app-2'],
    'entertainment': [],
    'education': []
};

// 사용자별 앱 접근 권한 관리
const USER_APP_ACCESS = {
    // 로그인한 모든 사용자는 Goal-Illa에 접근 가능
    'goal-illa': ['all'],
    // 향후 특정 사용자만 접근 가능한 앱들
    'future-app-1': ['premium'],
    'future-app-2': ['all']
};

// 앱 대시보드 링크 생성 함수
function generateAppDashboardLinks() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return '';
    
    const user = JSON.parse(currentUser);
    let links = '';
    
    Object.values(APPS_CONFIG).forEach(app => {
        if (app.status === 'active' && app.hasWebDashboard) {
            // 사용자 접근 권한 확인
            const accessLevel = USER_APP_ACCESS[app.id];
            if (accessLevel && (accessLevel.includes('all') || accessLevel.includes(user.tier))) {
                links += `
                    <a href="${app.dashboardUrl}" class="dashboard-link" data-app="${app.id}">
                        <div class="dashboard-link-icon">${app.icon}</div>
                        <div class="dashboard-link-info">
                            <h4>${app.name}</h4>
                            <p>${app.description}</p>
                        </div>
                    </a>
                `;
            }
        }
    });
    
    return links;
}

// 앱 카드 생성 함수
function generateAppCards() {
    let cards = '';
    
    Object.values(APPS_CONFIG).forEach(app => {
        const isComingSoon = app.status === 'coming-soon';
        const hasDashboard = app.hasWebDashboard && app.status === 'active';
        
        cards += `
            <div class="app-card ${isComingSoon ? 'coming-soon' : ''}" data-app="${app.id}">
                <div class="app-icon">${app.icon}</div>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="app-features">
                    ${app.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="app-links">
                    ${app.appUrl ? `<a href="${app.appUrl}" class="btn btn-outline">자세히 보기</a>` : ''}
                    ${hasDashboard ? `<a href="${app.dashboardUrl}" class="btn btn-primary dashboard-link" style="display: none;">대시보드</a>` : ''}
                    <a href="support/faq.html" class="btn btn-text">FAQ</a>
                </div>
                ${isComingSoon ? '<div class="coming-soon-badge">준비 중</div>' : ''}
            </div>
        `;
    });
    
    return cards;
}

// 앱 통계 업데이트 함수
function updateAppStats() {
    Object.values(APPS_CONFIG).forEach(app => {
        if (app.status === 'active') {
            // 실제 API에서 통계 데이터를 가져와서 업데이트
            // 현재는 정적 데이터 사용
            console.log(`${app.name} 통계:`, app.stats);
        }
    });
}

// 새로운 앱 추가 함수 (개발자용)
function addNewApp(appConfig) {
    if (APPS_CONFIG[appConfig.id]) {
        console.error('앱 ID가 이미 존재합니다:', appConfig.id);
        return false;
    }
    
    APPS_CONFIG[appConfig.id] = appConfig;
    
    // 카테고리별 그룹에 추가
    if (!APPS_BY_CATEGORY[appConfig.category]) {
        APPS_BY_CATEGORY[appConfig.category] = [];
    }
    APPS_BY_CATEGORY[appConfig.category].push(appConfig.id);
    
    // 사용자 접근 권한 설정
    USER_APP_ACCESS[appConfig.id] = appConfig.defaultAccess || ['all'];
    
    console.log('새 앱이 추가되었습니다:', appConfig.name);
    return true;
}

// 앱 상태 업데이트 함수
function updateAppStatus(appId, newStatus) {
    if (APPS_CONFIG[appId]) {
        APPS_CONFIG[appId].status = newStatus;
        console.log(`${APPS_CONFIG[appId].name} 상태가 ${newStatus}로 변경되었습니다.`);
        return true;
    }
    return false;
}

// 앱 정보 조회 함수
function getAppInfo(appId) {
    return APPS_CONFIG[appId] || null;
}

// 사용자가 접근 가능한 앱 목록 조회
function getUserAccessibleApps(user) {
    const accessibleApps = [];
    
    Object.values(APPS_CONFIG).forEach(app => {
        const accessLevel = USER_APP_ACCESS[app.id];
        if (accessLevel && (accessLevel.includes('all') || accessLevel.includes(user.tier))) {
            accessibleApps.push(app);
        }
    });
    
    return accessibleApps;
}

// 앱 대시보드 링크 표시/숨김 관리
function updateAppDashboardLinks() {
    const currentUser = localStorage.getItem('currentUser');
    
    Object.values(APPS_CONFIG).forEach(app => {
        const dashboardLink = document.querySelector(`[data-app="${app.id}"].dashboard-link`);
        if (dashboardLink) {
            if (currentUser && app.status === 'active' && app.hasWebDashboard) {
                const user = JSON.parse(currentUser);
                const accessLevel = USER_APP_ACCESS[app.id];
                if (accessLevel && (accessLevel.includes('all') || accessLevel.includes(user.tier))) {
                    dashboardLink.style.display = 'inline-block';
                } else {
                    dashboardLink.style.display = 'none';
                }
            } else {
                dashboardLink.style.display = 'none';
            }
        }
    });
}

// 앱 카드 동적 생성 및 삽입
function renderAppCards() {
    const appsContainer = document.querySelector('.apps-grid');
    if (appsContainer) {
        appsContainer.innerHTML = generateAppCards();
        updateAppDashboardLinks();
    }
}

// 초기화 함수
function initializeAppsSystem() {
    // 앱 카드 렌더링
    renderAppCards();
    
    // 앱 통계 업데이트
    updateAppStats();
    
    // 대시보드 링크 관리
    updateAppDashboardLinks();
    
    console.log('앱 관리 시스템이 초기화되었습니다.');
}

// 전역으로 사용할 수 있도록 export
window.APPS_CONFIG = APPS_CONFIG;
window.APPS_BY_CATEGORY = APPS_BY_CATEGORY;
window.USER_APP_ACCESS = USER_APP_ACCESS;
window.generateAppDashboardLinks = generateAppDashboardLinks;
window.generateAppCards = generateAppCards;
window.updateAppStats = updateAppStats;
window.addNewApp = addNewApp;
window.updateAppStatus = updateAppStatus;
window.getAppInfo = getAppInfo;
window.getUserAccessibleApps = getUserAccessibleApps;
window.updateAppDashboardLinks = updateAppDashboardLinks;
window.renderAppCards = renderAppCards;
window.initializeAppsSystem = initializeAppsSystem;
