// 실제 데이터베이스 연결 및 관리
class DatabaseManager {
    constructor() {
        this.data = {
            users: [],
            problems: [],
            solutions: [],
            stats: {
                totalUsers: 0,
                totalProblems: 0,
                solvedProblems: 0,
                communityGoals: 0,
                supportMessages: 0,
                achievementRate: 0,
                lastUpdated: new Date().toISOString()
            },
            investments: [],
            collaborations: []
        };
        
        this.loadData();
        this.calculateAndUpdateStats();
        this.startRealTimeUpdates();
    }

    // 로컬 스토리지에서 데이터 로드
    loadData() {
        try {
            const savedData = localStorage.getItem('firstPenguinsDB');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // 기존 데이터가 있어도 사용자와 통계 관련 데이터는 초기화
                // (관리자와 팀 데이터만 유지)
                this.data = { 
                    ...this.data, 
                    ...parsedData,
                    users: [], // 일반 사용자 초기화
                    problems: [], // 문제 초기화
                    solutions: [], // 솔루션 초기화
                    communityFeed: [], // 커뮤니티 피드 초기화
                    recentIdeas: [], // 아이디어 초기화
                    investments: [], // 투자 초기화
                    collaborations: [], // 협업 초기화
                    newsletterSubscribers: [] // 뉴스레터 구독자 초기화
                };
                
                console.log('데이터베이스 로드 완료 (사용자 데이터 초기화됨):', this.data);
            } else {
                // 초기 데이터 생성
                this.initializeData();
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.initializeData();
        }
    }

    // 초기 데이터 생성
    initializeData() {
        this.data = {
            // 팀 멤버 정보 (데이터베이스로 이전)
            team: [
                {
                    id: 1,
                    name: '정민혁',
                    role: 'CEO & Co-Founder',
                    description: '개척자 정신으로 새로운 영역을 탐험하는 것을 사명으로 하는 혁신가입니다. Goal-Illa의 비전을 설계하고 팀을 이끌어갑니다.',
                    skills: ['Leadership', 'Strategy', 'Innovation'],
                    email: 'minhyuk@firstpgs.com',
                    linkedin: '',
                    github: '',
                    avatar: 'https://via.placeholder.com/150',
                    joinDate: '2024-01-01',
                    featured: true
                },
                {
                    id: 2,
                    name: '오다령',
                    role: 'COO & Co-Founder',
                    description: '사업 운영과 사용자 성장을 담당하는 운영 전문가입니다. Goal-Illa의 비즈니스 모델과 사용자 확장을 이끌어갑니다.',
                    skills: ['Business Operations', 'Growth Strategy', 'User Experience'],
                    email: 'daryeong@firstpgs.com',
                    linkedin: '',
                    github: '',
                    avatar: 'https://via.placeholder.com/150',
                    joinDate: '2024-01-01',
                    featured: false
                },
                {
                    id: 3,
                    name: '유승준',
                    role: 'CTO & Co-Founder',
                    description: '기술적 혁신과 사용자 경험을 중시하는 개발자입니다. Goal-Illa의 핵심 기술을 개발하고 시스템을 구축합니다.',
                    skills: ['Full-Stack Development', 'System Architecture', 'UI/UX'],
                    email: 'seungjun@firstpgs.com',
                    linkedin: '',
                    github: '',
                    avatar: 'https://via.placeholder.com/150',
                    joinDate: '2024-01-01',
                    featured: false
                }
            ],
            // 커뮤니티 피드 데이터 (현재는 비어있음)
            communityFeed: [],
            // 앱 정보 데이터
            apps: [
                {
                    id: 'goal-illa',
                    name: 'Goal-Illa',
                    icon: '🎯',
                    description: '목표 설정과 달성을 도와주는 혁신적인 앱',
                    category: 'productivity',
                    status: 'active',
                    features: ['목표 관리', '진행률 추적', '통계 분석'],
                    dashboardUrl: 'dashboard/goal-illa.html',
                    appUrl: 'apps/goal-illa.html',
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
                {
                    id: 'future-app-1',
                    name: 'TaskMaster',
                    icon: '📋',
                    description: '업무 관리와 협업을 위한 통합 플랫폼',
                    category: 'productivity',
                    status: 'coming-soon',
                    features: ['업무 관리', '팀 협업', '프로젝트 추적'],
                    dashboardUrl: null,
                    appUrl: null,
                    hasWebDashboard: false,
                    hasMobileApp: false,
                    releaseDate: '2024-06-01',
                    version: '0.0.0',
                    stats: {
                        downloads: 0,
                        rating: 0,
                        activeUsers: 0
                    }
                }
            ],
            // 최근 아이디어 데이터 (현재는 없음)
            recentIdeas: [],
            // 문제-해결책 카드 데이터
            problemSolutionCards: [
                {
                    id: 'planning',
                    problem: {
                        emoji: '😰',
                        title: '계획 세우기 어려움',
                        description: '"무엇을 해야 할지, 어떻게 시작해야 할지 모르겠어요"',
                    quote: '"목표는 있는데 구체적인 계획을 세우기가 너무 어려워요."',
                    author: '사용자 피드백 (예시)'
                    },
                    solution: {
                        emoji: '🎯',
                        title: 'Goal-Illa 앱',
                        description: 'AI가 개인 맞춤형 목표와 단계별 계획을 자동으로 생성해드립니다',
                        features: [
                            { icon: 'fas fa-magic', text: '스마트 목표 생성' },
                            { icon: 'fas fa-list-check', text: '단계별 계획 수립' },
                            { icon: 'fas fa-bell', text: '맞춤형 알림' }
                        ]
                    }
                },
                {
                    id: 'motivation',
                    problem: {
                        emoji: '😔',
                        title: '동기부여 부족',
                        description: '"시작은 좋은데 금방 포기하게 되네요"',
                        quote: '"처음엔 열심히 하다가도 며칠 지나면 의욕이 떨어져요. 지속하기가 어려워요."',
                        author: '사용자 피드백 (예시)'
                    },
                    solution: {
                        emoji: '🔥',
                        title: '동기부여 시스템',
                        description: '게임화된 요소와 커뮤니티 응원으로 지속적인 동기를 제공합니다',
                        features: [
                            { icon: 'fas fa-trophy', text: '성취 뱃지 시스템' },
                            { icon: 'fas fa-users', text: '커뮤니티 응원' },
                            { icon: 'fas fa-chart-line', text: '진행률 시각화' }
                        ]
                    }
                },
                {
                    id: 'tracking',
                    problem: {
                        emoji: '📊',
                        title: '진행상황 파악 어려움',
                        description: '"얼마나 잘하고 있는지 모르겠어요"',
                        quote: '"목표를 향해 나아가고 있는지, 제대로 하고 있는지 확신이 서지 않아요."',
                        author: '사용자 피드백 (예시)'
                    },
                    solution: {
                        emoji: '📈',
                        title: '스마트 분석',
                        description: 'AI 기반 분석으로 개인의 성향과 패턴을 파악하여 최적의 가이드를 제공합니다',
                        features: [
                            { icon: 'fas fa-brain', text: 'AI 패턴 분석' },
                            { icon: 'fas fa-chart-pie', text: '상세 통계' },
                            { icon: 'fas fa-lightbulb', text: '개선 제안' }
                        ]
                    }
                }
            ],
            // 관리자 계정 (별도 관리)
            admins: [
                {
                    id: 'goalilla',
                    username: 'goalilla',
                    password: 'goalilla23', // 실제로는 해시화해야 함
                    name: '관리자',
                    email: 'admin@firstpgs.com',
                    role: 'admin',
                    permissions: ['all'],
                    createdAt: '2024-01-01T00:00:00Z',
                    lastLogin: null
                }
            ],
            
            // 실제 사용자 (현재는 없음 - 진짜 가입자만)
            users: [],
            
            // 실제 제출된 문제들 (현재는 없음)
            problems: [],
            
            // 해결된 솔루션들 (현재는 없음)
            solutions: [],
            // 실제 데이터 기반 통계 (동적 계산)
            stats: {},
            
            // 실시간 피드 반응 수치
            feedReactions: {
                post1: { clap: 12, fire: 8 },
                post2: { muscle: 15, book: 6 },
                post3: { cooking: 9, thumbsUp: 11 }
            },
            // 블로그 포스트 데이터
            blogPosts: [
                {
                    id: 1,
                    title: 'First-Penguins의 혁신적인 3R 철학',
                    summary: '재정의, 재도약, 재분배로 이루어진 우리의 핵심 가치관을 소개합니다.',
                    content: 'First-Penguins는 3R 철학을 바탕으로 새로운 가치를 창조합니다...',
                    author: '정민혁',
                    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'philosophy',
                    tags: ['3R철학', '혁신', '기업문화'],
                    readTime: 5,
                    featured: true
                },
                {
                    id: 2,
                    title: 'Goal-Illa 개발 여정: 목표 관리의 새로운 패러다임',
                    summary: 'Goal-Illa 앱 개발 과정에서 겪은 도전과 성과를 공유합니다.',
                    content: 'Goal-Illa는 사용자들의 목표 달성을 돕기 위해 개발된 혁신적인 앱입니다...',
                    author: '유승준',
                    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'technology',
                    tags: ['Goal-Illa', '앱개발', '기술'],
                    readTime: 8,
                    featured: false
                },
                {
                    id: 3,
                    title: '스타트업 성장 전략: 사용자 중심 접근법',
                    summary: '사용자의 실제 니즈를 파악하고 해결하는 우리만의 방법론을 설명합니다.',
                    content: 'First-Penguins는 사용자의 불편함을 발견하고 해결하는 것을 최우선으로 합니다...',
                    author: '오다령',
                    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'business',
                    tags: ['스타트업', '성장전략', '사용자경험'],
                    readTime: 6,
                    featured: false
                }
            ],
            // 투자 관심 등록 (현재는 없음)
            investments: [],
            
            // 협업 제안 (현재는 없음)
            collaborations: [],
            
            // 뉴스레터 구독자 (현재는 없음)
            newsletterSubscribers: [],
            
            // 설정값들 (관리자가 설정 가능)
            settings: {
                expectedROI: 0, // 예상 수익률 (관리자 설정)
                averageGoalCreationTime: 3, // 평균 목표 생성 시간 (분)
                targetNewsletterSatisfaction: 85 // 목표 뉴스레터 만족도
            }
        };
        
        this.calculateAndUpdateStats();
        this.saveData();
    }

    // 실제 데이터 기반 통계 계산
    calculateRealStats() {
        const realStats = {
            // 기본 통계 (실제 데이터 기반)
            totalUsers: this.data.users ? this.data.users.length : 0,
            totalProblems: this.data.problems ? this.data.problems.length : 0,
            solvedProblems: this.data.problems ? this.data.problems.filter(p => p.status === 'solved').length : 0,
            communityGoals: this.data.communityFeed ? this.data.communityFeed.filter(f => f.type === 'new-goal' || f.type === 'progress').length : 0,
            supportMessages: this.data.communityFeed ? this.data.communityFeed.length : 0,
            achievementRate: this.calculateAchievementRate(),
            
            // Hero Section 통계 (실제 데이터 기반)
            goalsAchieved: this.data.communityFeed ? this.data.communityFeed.filter(f => f.type === 'achievement').length : 0,
            userSatisfaction: this.calculateUserSatisfaction(),
            goalCreationTime: this.calculateGoalCreationTime(),
            
            // 피드백 시스템 통계 (실제 데이터 기반)
            totalIdeas: this.data.recentIdeas ? this.data.recentIdeas.length : 0,
            implementedIdeas: this.data.recentIdeas ? this.data.recentIdeas.filter(i => i.status === 'implemented').length : 0,
            activeUsers: this.data.users ? this.data.users.filter(u => u.goals > 0).length : 0,
            
            // About Section 통계 (실제 데이터 기반)
            discoveredProblems: this.data.problems ? this.data.problems.length : 0,
            userSatisfactionSurvey: this.calculateUserSatisfaction(),
            
            // Newsletter 통계 (실제 데이터 기반)
            newsletterSubscribers: this.calculateNewsletterSubscribers(),
            newsletterSatisfaction: this.calculateNewsletterSatisfaction(),
            
            // 투자 & 협업 통계 (실제 데이터 기반)
            investmentProgress: this.calculateInvestmentProgress(),
            expectedROI: this.calculateExpectedROI(),
            activeCollaborations: this.data.collaborations ? this.data.collaborations.filter(c => c.status === 'active').length : 0,
            collaborationSuccessRate: this.calculateCollaborationSuccessRate(),
            
            lastUpdated: new Date().toISOString()
        };
        
        return realStats;
    }

    // 통계 계산 및 업데이트
    calculateAndUpdateStats() {
        this.data.stats = this.calculateRealStats();
    }

    // 목표 달성률 계산
    calculateAchievementRate() {
        if (!this.data.users || this.data.users.length === 0) return 0;
        
        const totalGoals = this.data.users.reduce((sum, user) => sum + (user.goals || 0), 0);
        const totalAchievements = this.data.users.reduce((sum, user) => sum + (user.achievements || 0), 0);
        
        return totalGoals > 0 ? Math.round((totalAchievements / totalGoals) * 100) : 0;
    }

    // 사용자 만족도 계산
    calculateUserSatisfaction() {
        // 실제 사용자가 없으면 만족도도 0
        if (!this.data.users || this.data.users.length === 0) {
            return 0;
        }
        
        // 만족도 조사에 참여한 사용자들만 계산
        const satisfactionSurveys = this.data.users.filter(user => user.satisfactionRating !== undefined);
        
        if (satisfactionSurveys.length === 0) {
            return 0; // 조사 참여자가 없으면 0
        }
        
        const totalSatisfaction = satisfactionSurveys.reduce((sum, user) => sum + (user.satisfactionRating || 0), 0);
        const averageSatisfaction = totalSatisfaction / satisfactionSurveys.length;
        
        // 5점 만점을 100점 만점으로 변환
        return Math.round((averageSatisfaction / 5) * 100);
    }

    // 투자 진행률 계산
    calculateInvestmentProgress() {
        if (!this.data.investments || this.data.investments.length === 0) return 0;
        
        const targetAmount = 1000000000; // 10억원 목표
        const currentAmount = this.data.investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        
        return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
    }

    // 협업 성공률 계산
    calculateCollaborationSuccessRate() {
        if (!this.data.collaborations || this.data.collaborations.length === 0) return 0;
        
        const completedCollaborations = this.data.collaborations.filter(c => c.status === 'completed').length;
        const totalCollaborations = this.data.collaborations.length;
        
        return totalCollaborations > 0 ? Math.round((completedCollaborations / totalCollaborations) * 100) : 0;
    }

    // 목표 생성 시간 계산
    calculateGoalCreationTime() {
        // 실제 데이터가 있다면 평균 계산, 없으면 설정값 사용
        if (this.data.users && this.data.users.length > 0) {
            // 실제 사용자 데이터에서 평균 목표 생성 시간 계산 (향후 구현)
            return this.data.settings?.averageGoalCreationTime || 3;
        }
        return this.data.settings?.averageGoalCreationTime || 3;
    }

    // 뉴스레터 구독자 수 계산
    calculateNewsletterSubscribers() {
        return this.data.newsletterSubscribers ? this.data.newsletterSubscribers.length : 0;
    }

    // 뉴스레터 만족도 계산
    calculateNewsletterSatisfaction() {
        if (!this.data.newsletterSubscribers || this.data.newsletterSubscribers.length === 0) {
            return 0; // 구독자가 없으면 만족도도 0
        }
        
        // 실제 만족도 조사 데이터가 있다면 계산
        const satisfiedSubscribers = this.data.newsletterSubscribers.filter(sub => sub.satisfied === true).length;
        const totalResponses = this.data.newsletterSubscribers.filter(sub => sub.satisfied !== undefined).length;
        
        if (totalResponses === 0) return 0;
        return Math.round((satisfiedSubscribers / totalResponses) * 100);
    }

    // 예상 수익률 계산
    calculateExpectedROI() {
        return this.data.settings?.expectedROI || 0;
    }

    // 데이터 저장
    saveData() {
        try {
            localStorage.setItem('firstPenguinsDB', JSON.stringify(this.data));
        } catch (error) {
            console.error('데이터 저장 실패:', error);
        }
    }

    // 실시간 통계 업데이트
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateStats();
        }, 30000); // 30초마다 업데이트
    }

    // 통계 업데이트 (실제 데이터 기반)
    updateStats() {
        const now = new Date();
        
        // 실제 데이터를 기반으로 통계 재계산
        this.calculateAndUpdateStats();
        
        // 실시간 피드 반응 수치만 약간의 변동 허용
        Object.keys(this.data.feedReactions).forEach(postKey => {
            const reactions = this.data.feedReactions[postKey];
            Object.keys(reactions).forEach(reactionKey => {
                // 가끔 반응 수가 증가 (10% 확률)
                if (Math.random() < 0.1) {
                    reactions[reactionKey] += 1;
                }
            });
        });
        
        this.data.stats.lastUpdated = now.toISOString();
        this.saveData();
        
        // 실시간 업데이트 이벤트 발생
        this.notifyStatsUpdate();
    }

    // 통계 업데이트 알림
    notifyStatsUpdate() {
        const event = new CustomEvent('statsUpdated', {
            detail: this.data.stats
        });
        window.dispatchEvent(event);
    }

    // API 메서드들
    getStats() {
        return this.data.stats;
    }

    getUsers() {
        return this.data.users;
    }

    getProblems() {
        return this.data.problems;
    }

    getSolutions() {
        return this.data.solutions;
    }

    getInvestments() {
        return this.data.investments;
    }

    getCollaborations() {
        return this.data.collaborations;
    }

    // 새로운 데이터 조회 메서드들
    getTeam() {
        return this.data.team;
    }

    getCommunityFeed() {
        return this.data.communityFeed;
    }

    getApps() {
        return this.data.apps;
    }

    getRecentIdeas() {
        return this.data.recentIdeas;
    }

    getProblemSolutionCards() {
        return this.data.problemSolutionCards;
    }

    getBlogPosts() {
        return this.data.blogPosts || [];
    }

    // 커뮤니티 피드 추가
    addCommunityFeedItem(feedData) {
        const newFeed = {
            id: this.data.communityFeed.length + 1,
            ...feedData,
            timestamp: new Date().toISOString(),
            reactions: feedData.reactions || {}
        };
        
        this.data.communityFeed.unshift(newFeed); // 최신 순으로 추가
        
        // 최대 20개까지만 유지
        if (this.data.communityFeed.length > 20) {
            this.data.communityFeed = this.data.communityFeed.slice(0, 20);
        }
        
        this.saveData();
        return newFeed;
    }

    // 아이디어 추가
    addIdea(ideaData) {
        const newIdea = {
            id: this.data.recentIdeas.length + 1,
            ...ideaData,
            status: 'reviewing',
            submittedAt: new Date().toISOString()
        };
        
        this.data.recentIdeas.unshift(newIdea);
        this.calculateAndUpdateStats();
        this.saveData();
        return newIdea;
    }

    // 앱 정보 업데이트
    updateApp(appId, updateData) {
        const appIndex = this.data.apps.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
            this.data.apps[appIndex] = { ...this.data.apps[appIndex], ...updateData };
            this.saveData();
            return this.data.apps[appIndex];
        }
        return null;
    }

    // 팀 멤버 업데이트
    updateTeamMember(memberId, updateData) {
        const memberIndex = this.data.team.findIndex(member => member.id === memberId);
        if (memberIndex !== -1) {
            this.data.team[memberIndex] = { ...this.data.team[memberIndex], ...updateData };
            this.saveData();
            return this.data.team[memberIndex];
        }
        return null;
    }

    // 새 문제 제출
    submitProblem(problemData) {
        const newProblem = {
            id: this.data.problems.length + 1,
            ...problemData,
            status: 'active',
            votes: 0,
            createdAt: new Date().toISOString()
        };
        
        this.data.problems.push(newProblem);
        this.calculateAndUpdateStats();
        this.saveData();
        
        return newProblem;
    }

    // 새 사용자 등록
    // 일반 사용자 추가 (관리자와 별도)
    addUser(userData) {
        const newUser = {
            id: this.data.users.length + 1,
            name: userData.name || 'Anonymous',
            email: userData.email || '',
            role: 'user', // 일반 사용자
            goals: userData.goals || 0,
            achievements: userData.achievements || 0,
            satisfactionRating: undefined, // 만족도 조사 참여 전까지 undefined
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        this.data.users.push(newUser);
        this.calculateAndUpdateStats();
        this.saveData();
        
        return newUser;
    }

    // 사용자 만족도 업데이트
    updateUserSatisfaction(userId, satisfactionRating) {
        const user = this.data.users.find(u => u.id === userId);
        if (user) {
            user.satisfactionRating = Math.max(1, Math.min(5, satisfactionRating)); // 1-5 범위로 제한
            this.calculateAndUpdateStats();
            this.saveData();
            return user;
        }
        return null;
    }

    // 뉴스레터 구독 추가
    addNewsletterSubscriber(email, name = null) {
        const newSubscriber = {
            id: this.data.newsletterSubscribers.length + 1,
            email: email,
            name: name,
            subscribedAt: new Date().toISOString(),
            satisfied: undefined // 만족도 조사는 나중에
        };
        
        // 이미 구독한 이메일인지 확인
        const existingSubscriber = this.data.newsletterSubscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            return existingSubscriber; // 이미 구독중
        }
        
        this.data.newsletterSubscribers.push(newSubscriber);
        this.calculateAndUpdateStats();
        this.saveData();
        
        return newSubscriber;
    }

    // 뉴스레터 만족도 업데이트
    updateNewsletterSatisfaction(email, satisfied) {
        const subscriber = this.data.newsletterSubscribers.find(sub => sub.email === email);
        if (subscriber) {
            subscriber.satisfied = satisfied;
            this.calculateAndUpdateStats();
            this.saveData();
            return subscriber;
        }
        return null;
    }

    // 설정값 업데이트
    updateSetting(key, value) {
        if (!this.data.settings) {
            this.data.settings = {};
        }
        
        this.data.settings[key] = value;
        this.calculateAndUpdateStats();
        this.saveData();
        
        return this.data.settings[key];
    }

    // 투자 관심 등록
    addInvestmentInterest(investmentData) {
        const newInvestment = {
            id: this.data.investments.length + 1,
            ...investmentData,
            status: 'pending',
            contactDate: new Date().toISOString()
        };
        
        this.data.investments.push(newInvestment);
        this.calculateAndUpdateStats();
        this.saveData();
        
        return newInvestment;
    }

    // 협업 제안
    proposeCollaboration(collaborationData) {
        const newCollaboration = {
            id: this.data.collaborations.length + 1,
            ...collaborationData,
            status: 'proposed',
            progress: 0,
            startDate: new Date().toISOString()
        };
        
        this.data.collaborations.push(newCollaboration);
        this.calculateAndUpdateStats();
        this.saveData();
        
        return newCollaboration;
    }

    // 문제에 투표
    voteProblem(problemId) {
        const problem = this.data.problems.find(p => p.id === problemId);
        if (problem) {
            problem.votes++;
            this.saveData();
            return problem;
        }
        return null;
    }

    // 특정 통계 값 조회
    getStatValue(key) {
        return this.data.stats[key] || 0;
    }

    // 여러 통계 값 조회
    getStatValues(keys) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.data.stats[key] || 0;
        });
        return result;
    }

    // 설정값들 조회
    getSettings() {
        return this.data.settings || {};
    }

    // 뉴스레터 구독자 조회
    getNewsletterSubscribers() {
        return this.data.newsletterSubscribers || [];
    }

    // 관리자 인증
    authenticateAdmin(username, password) {
        const admin = this.data.admins.find(a => a.username === username && a.password === password);
        if (admin) {
            // 마지막 로그인 시간 업데이트
            admin.lastLogin = new Date().toISOString();
            this.saveData();
            
            // 비밀번호 제외하고 반환
            const { password: _, ...adminInfo } = admin;
            return adminInfo;
        }
        return null;
    }

    // 관리자 권한 확인
    isAdmin(userId) {
        return this.data.admins.some(admin => admin.id === userId);
    }

    // 관리자 목록 조회 (비밀번호 제외)
    getAdmins() {
        return this.data.admins.map(admin => {
            const { password, ...adminInfo } = admin;
            return adminInfo;
        });
    }

    // 데이터베이스 완전 초기화 (관리자용)
    resetDatabase() {
        console.warn('데이터베이스를 완전히 초기화합니다...');
        
        // localStorage 완전 삭제
        localStorage.removeItem('firstPenguinsDB');
        
        // 초기 데이터로 재설정
        this.initializeData();
        
        console.log('데이터베이스가 완전히 초기화되었습니다.');
        
        // 페이지 새로고침으로 완전히 적용
        if (window.location) {
            window.location.reload();
        }
    }

    // 피드 반응 수 조회
    getFeedReactions() {
        return this.data.stats.feedReactions;
    }

    // 피드 반응 수 업데이트
    updateFeedReaction(postKey, reactionKey, increment = 1) {
        if (!this.data.stats.feedReactions[postKey]) {
            this.data.stats.feedReactions[postKey] = {};
        }
        if (!this.data.stats.feedReactions[postKey][reactionKey]) {
            this.data.stats.feedReactions[postKey][reactionKey] = 0;
        }
        this.data.stats.feedReactions[postKey][reactionKey] += increment;
        this.saveData();
        return this.data.stats.feedReactions[postKey][reactionKey];
    }

    // 통계 값 직접 업데이트 (관리자용)
    updateStatValue(key, value) {
        this.data.stats[key] = value;
        this.data.stats.lastUpdated = new Date().toISOString();
        this.saveData();
        this.notifyStatsUpdate();
        return value;
    }
}

// 전역 데이터베이스 인스턴스
window.DatabaseManager = DatabaseManager;
window.db = new DatabaseManager();

console.log('데이터베이스 시스템 초기화 완료');

