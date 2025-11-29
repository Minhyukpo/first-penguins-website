// First-Penguins 혁신 시스템 API
// 새로운 기능들을 위한 데이터베이스 연동 및 API 엔드포인트

class InnovationAPI {
    constructor() {
        this.baseUrl = window.CONFIG ? window.CONFIG.api.baseUrl : 'https://3.38.27.53:3000';
        this.endpoints = {
            badges: '/api/innovation/badges',
            champions: '/api/innovation/champions',
            royalties: '/api/innovation/royalties',
            challenges: '/api/innovation/challenges',
            stories: '/api/innovation/stories',
            crowdsourcing: '/api/innovation/crowdsourcing',
            rewards: '/api/innovation/rewards',
            discord: '/api/innovation/discord',
            franchise: '/api/innovation/franchise',
            incubator: '/api/innovation/incubator',
            appstore: '/api/innovation/appstore'
        };
    }

    // 인증 토큰 가져오기
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // API 요청 헬퍼
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = this.getAuthToken();
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API 요청 실패');
            }
            
            return data;
        } catch (error) {
            console.error('Innovation API 요청 오류:', error);
            // 오프라인 모드에서는 로컬 스토리지 사용
            return this.getOfflineData(endpoint, options);
        }
    }

    // 오프라인 데이터 가져오기
    getOfflineData(endpoint, options) {
        const endpointKey = Object.keys(this.endpoints).find(key => this.endpoints[key] === endpoint);
        if (!endpointKey) return null;

        const localData = localStorage.getItem(`innovation_${endpointKey}`);
        return localData ? JSON.parse(localData) : { [endpointKey]: [] };
    }

    // 배지 관련 API
    async getUserBadges() {
        return await this.makeRequest(this.endpoints.badges);
    }

    async awardBadge(badgeId, userId = null) {
        const data = await this.makeRequest(this.endpoints.badges, {
            method: 'POST',
            body: JSON.stringify({ badgeId, userId })
        });
        
        // 로컬 스토리지에도 저장
        this.saveToLocal('badges', data);
        return data;
    }

    // 월간 챔피언 관련 API
    async getMonthlyChampions() {
        return await this.makeRequest(this.endpoints.champions);
    }

    async getCurrentChampion() {
        const champions = await this.getMonthlyChampions();
        const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
        return champions.champions.find(champion => champion.month === currentMonth);
    }

    async setMonthlyChampion(championData) {
        const data = await this.makeRequest(this.endpoints.champions, {
            method: 'POST',
            body: JSON.stringify(championData)
        });
        
        this.saveToLocal('champions', data);
        return data;
    }

    // 로열티 관련 API
    async getRoyaltyHistory() {
        return await this.makeRequest(this.endpoints.royalties);
    }

    async payRoyalty(amount, source, problemId = null) {
        const data = await this.makeRequest(this.endpoints.royalties, {
            method: 'POST',
            body: JSON.stringify({ amount, source, problemId })
        });
        
        this.saveToLocal('royalties', data);
        return data;
    }


    // 챌린지 관련 API
    async getMonthlyChallenges() {
        return await this.makeRequest(this.endpoints.challenges);
    }

    async joinChallenge(challengeId) {
        const data = await this.makeRequest(this.endpoints.challenges, {
            method: 'POST',
            body: JSON.stringify({ challengeId })
        });
        
        this.saveToLocal('challenges', data);
        return data;
    }


    // 스토리텔링 관련 API
    async getStoryContests() {
        return await this.makeRequest(this.endpoints.stories);
    }

    async submitStory(storyData) {
        const data = await this.makeRequest(this.endpoints.stories, {
            method: 'POST',
            body: JSON.stringify(storyData)
        });
        
        this.saveToLocal('stories', data);
        return data;
    }

    // 크라우드소싱 관련 API
    async getCrowdsourcingProblems() {
        return await this.makeRequest(this.endpoints.crowdsourcing);
    }

    async postCrowdsourcingProblem(problemData) {
        const data = await this.makeRequest(this.endpoints.crowdsourcing, {
            method: 'POST',
            body: JSON.stringify(problemData)
        });
        
        this.saveToLocal('crowdsourcing', data);
        return data;
    }

    async solveCrowdsourcingProblem(problemId, solution) {
        const data = await this.makeRequest(`${this.endpoints.crowdsourcing}/${problemId}/solve`, {
            method: 'POST',
            body: JSON.stringify({ solution })
        });
        
        this.saveToLocal('crowdsourcing', data);
        return data;
    }

    // 창의적 보상 관련 API
    async getHonoraryPositions() {
        return await this.makeRequest(this.endpoints.rewards);
    }

    async applyForPosition(positionId, applicationData) {
        const data = await this.makeRequest(this.endpoints.rewards, {
            method: 'POST',
            body: JSON.stringify({ positionId, ...applicationData })
        });
        
        this.saveToLocal('rewards', data);
        return data;
    }

    // Discord 관련 API
    async getDiscordInvite() {
        return await this.makeRequest(this.endpoints.discord);
    }

    // 프랜차이즈 관련 API
    async getFranchisePrograms() {
        return await this.makeRequest(this.endpoints.franchise);
    }

    async applyForFranchise(applicationData) {
        const data = await this.makeRequest(this.endpoints.franchise, {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
        
        this.saveToLocal('franchise', data);
        return data;
    }

    // 인큐베이터 관련 API
    async getIncubatorProjects() {
        return await this.makeRequest(this.endpoints.incubator);
    }

    async submitStartupIdea(ideaData) {
        const data = await this.makeRequest(this.endpoints.incubator, {
            method: 'POST',
            body: JSON.stringify(ideaData)
        });
        
        this.saveToLocal('incubator', data);
        return data;
    }

    async joinIncubatorProject(projectId) {
        const data = await this.makeRequest(`${this.endpoints.incubator}/${projectId}/join`, {
            method: 'POST'
        });
        
        this.saveToLocal('incubator', data);
        return data;
    }

    // 앱 스토어 관련 API
    async getSolutionApps() {
        return await this.makeRequest(this.endpoints.appstore);
    }

    async publishApp(appData) {
        const data = await this.makeRequest(this.endpoints.appstore, {
            method: 'POST',
            body: JSON.stringify(appData)
        });
        
        this.saveToLocal('appstore', data);
        return data;
    }

    async downloadApp(appId) {
        const data = await this.makeRequest(`${this.endpoints.appstore}/${appId}/download`, {
            method: 'POST'
        });
        
        return data;
    }

    // 로컬 스토리지에 저장
    saveToLocal(key, data) {
        try {
            localStorage.setItem(`innovation_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
        }
    }

    // 데이터베이스 스키마 업데이트 (개발자용)
    async updateDatabaseSchema() {
        const schema = {
            badges: {
                id: 'string',
                userId: 'string',
                badgeId: 'string',
                earnedAt: 'datetime',
                points: 'number'
            },
            champions: {
                id: 'string',
                month: 'string',
                userId: 'string',
                problemsFound: 'number',
                points: 'number',
                rewards: 'array'
            },
            royalties: {
                id: 'string',
                userId: 'string',
                amount: 'number',
                source: 'string',
                problemId: 'string',
                paidAt: 'datetime'
            },
            challenges: {
                id: 'string',
                month: 'string',
                theme: 'string',
                participants: 'array',
                winner: 'string',
                reward: 'number'
            },
            stories: {
                id: 'string',
                userId: 'string',
                title: 'string',
                content: 'text',
                contestId: 'string',
                votes: 'number',
                submittedAt: 'datetime'
            },
            crowdsourcing: {
                id: 'string',
                userId: 'string',
                title: 'string',
                description: 'text',
                category: 'string',
                reward: 'number',
                solvers: 'array',
                solutions: 'array',
                status: 'string'
            },
            rewards: {
                id: 'string',
                userId: 'string',
                positionId: 'string',
                status: 'string',
                benefits: 'array',
                appliedAt: 'datetime'
            },
            franchise: {
                id: 'string',
                userId: 'string',
                programType: 'string',
                status: 'string',
                qualifications: 'array',
                appliedAt: 'datetime'
            },
            incubator: {
                id: 'string',
                userId: 'string',
                title: 'string',
                description: 'text',
                stage: 'string',
                funding: 'number',
                teamMembers: 'array',
                status: 'string'
            },
            appstore: {
                id: 'string',
                userId: 'string',
                name: 'string',
                description: 'text',
                category: 'string',
                price: 'number',
                downloads: 'number',
                rating: 'number',
                publishedAt: 'datetime'
            }
        };

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/schema`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ schema })
            });

            if (response.ok) {
                console.log('데이터베이스 스키마가 성공적으로 업데이트되었습니다.');
                return true;
            } else {
                console.error('데이터베이스 스키마 업데이트 실패:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('데이터베이스 스키마 업데이트 오류:', error);
            return false;
        }
    }
}

// 전역 인스턴스 생성
window.InnovationAPI = new InnovationAPI();

// 혁신 시스템 초기화 시 API 연동
document.addEventListener('DOMContentLoaded', function() {
    // 혁신 시스템이 로드된 후 API 데이터 동기화
    if (window.InnovationSystem) {
        initializeInnovationAPI();
    }
});

async function initializeInnovationAPI() {
    try {
        // API에서 최신 데이터 가져오기
        const [badges, champions, royalties] = await Promise.all([
            window.InnovationAPI.getUserBadges(),
            window.InnovationAPI.getMonthlyChampions(),
            window.InnovationAPI.getRoyaltyHistory()
        ]);

        // 혁신 시스템에 데이터 전달
        if (badges) window.InnovationSystem.userBadges = badges.badges || [];
        if (champions) window.InnovationSystem.monthlyChampions = champions.champions || [];
        if (royalties) window.InnovationSystem.royaltyHistory = royalties.royalties || [];

        // UI 업데이트
        window.InnovationSystem.renderBadgeSystem();
        window.InnovationSystem.renderMonthlyChampion();
        window.InnovationSystem.renderRoyaltySystem();

        console.log('혁신 시스템 API 연동 완료');
    } catch (error) {
        console.log('혁신 시스템 API 연동 실패, 로컬 데이터 사용:', error);
    }
}

