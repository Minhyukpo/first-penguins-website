// First-Penguins 혁신 시스템
// 모든 창의적 보상 및 커뮤니티 기능을 관리하는 시스템

class InnovationSystem {
    constructor() {
        this.baseUrl = window.CONFIG ? window.CONFIG.api.baseUrl : 'https://3.38.27.53:3000';
        this.init();
    }

    init() {
        this.initializeBadgeSystem();
        this.initializeMonthlyChampion();
        this.initializeRoyaltySystem();
        this.initializeChallenges();
        this.initializeStorytelling();
        this.initializeCrowdsourcing();
        this.initializeCreativeRewards();
        this.initializeDiscordIntegration();
        this.initializeFranchiseSystem();
        this.initializeIncubator();
        this.initializeAppStore();
    }

    // 1. 배지 시스템
    initializeBadgeSystem() {
        this.badges = {
            'problem-detective': { name: '불편함 탐정', icon: '🕵️‍♂️', description: '첫 번째 문제를 발견한 사용자', points: 10 },
            'problem-expert': { name: '불편함 전문가', icon: '🎓', description: '10개 이상의 문제를 발견한 사용자', points: 50 },
            'solution-master': { name: '해결책 마스터', icon: '💡', description: '5개 이상의 해결책을 제안한 사용자', points: 100 },
            'community-leader': { name: '커뮤니티 리더', icon: '👑', description: '월간 가장 활발한 사용자', points: 200 },
            'innovation-pioneer': { name: '혁신 개척자', icon: '🚀', description: '혁신적인 아이디어를 제안한 사용자', points: 300 },
            'first-penguin-partner': { name: 'First-Penguins 파트너', icon: '🐧', description: '최고 레벨 달성자', points: 500 }
        };
        
        this.userBadges = this.getUserBadges();
        this.renderBadgeSystem();
    }

    // 2. 월간 챔피언 시스템
    initializeMonthlyChampion() {
        this.monthlyChampions = this.getMonthlyChampions();
        this.currentChampion = this.getCurrentChampion();
        this.renderMonthlyChampion();
    }

    // 3. 로열티 시스템
    initializeRoyaltySystem() {
        this.royaltyRate = 0.1; // 10% 로열티
        this.royaltyHistory = this.getRoyaltyHistory();
        this.renderRoyaltySystem();
    }


    // 5. 월간 챌린지 시스템
    initializeChallenges() {
        this.monthlyChallenges = {
            'january': { theme: '새해 불편함', description: '새해 목표 관련 불편함 발견하기', reward: 50 },
            'february': { theme: '연애 불편함', description: '데이트, 커플 관련 불편함 발견하기', reward: 50 },
            'march': { theme: '봄 불편함', description: '봄철 특화 불편함 발견하기', reward: 50 },
            'april': { theme: '업무 불편함', description: '직장인 특화 불편함 발견하기', reward: 50 },
            'may': { theme: '가족 불편함', description: '가족 관련 불편함 발견하기', reward: 50 },
            'june': { theme: '여행 불편함', description: '여행 관련 불편함 발견하기', reward: 50 },
            'july': { theme: '여름 불편함', description: '여름철 특화 불편함 발견하기', reward: 50 },
            'august': { theme: '휴가 불편함', description: '휴가 관련 불편함 발견하기', reward: 50 },
            'september': { theme: '학습 불편함', description: '학습 관련 불편함 발견하기', reward: 50 },
            'october': { theme: '건강 불편함', description: '건강 관련 불편함 발견하기', reward: 50 },
            'november': { theme: '소비 불편함', description: '쇼핑 관련 불편함 발견하기', reward: 50 },
            'december': { theme: '연말 불편함', description: '연말 정리 관련 불편함 발견하기', reward: 50 }
        };
        this.renderChallenges();
    }


    // 7. 스토리텔링 시스템
    initializeStorytelling() {
        this.storyContests = this.getStoryContests();
        this.renderStorytelling();
    }

    // 8. 크라우드소싱 시스템
    initializeCrowdsourcing() {
        this.crowdsourcingProblems = this.getCrowdsourcingProblems();
        this.renderCrowdsourcing();
    }

    // 9. 창의적 보상 시스템
    initializeCreativeRewards() {
        this.honoraryPositions = {
            'chief-problem-officer': { name: '최고 불편함 책임자', icon: '🎖️', benefits: ['월간 미팅', '신제품 우선 체험'] },
            'innovation-consultant': { name: '혁신 컨설턴트', icon: '💼', benefits: ['컨설팅 수수료', '프로젝트 참여'] },
            'solution-architect': { name: '해결책 설계사', icon: '🏗️', benefits: ['설계 수수료', '공동 개발'] }
        };
        this.renderCreativeRewards();
    }

    // 10. Discord 통합
    initializeDiscordIntegration() {
        this.discordInvites = this.getDiscordInvites();
        this.renderDiscordIntegration();
    }

    // 11. 프랜차이즈 시스템
    initializeFranchiseSystem() {
        this.franchisePrograms = this.getFranchisePrograms();
        this.renderFranchiseSystem();
    }

    // 12. 인큐베이터 시스템
    initializeIncubator() {
        this.incubatorProjects = this.getIncubatorProjects();
        this.renderIncubator();
    }

    // 13. 앱 스토어 시스템
    initializeAppStore() {
        this.solutionApps = this.getSolutionApps();
        this.renderAppStore();
    }

    // 데이터 가져오기 메서드들
    getUserBadges() {
        try {
            return JSON.parse(localStorage.getItem('userBadges') || '[]');
        } catch {
            return [];
        }
    }

    getMonthlyChampions() {
        try {
            return JSON.parse(localStorage.getItem('monthlyChampions') || '[]');
        } catch {
            return [];
        }
    }

    getCurrentChampion() {
        const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
        return this.monthlyChampions.find(champion => champion.month === currentMonth) || null;
    }

    getRoyaltyHistory() {
        try {
            return JSON.parse(localStorage.getItem('royaltyHistory') || '[]');
        } catch {
            return [];
        }
    }




    getStoryContests() {
        try {
            return JSON.parse(localStorage.getItem('storyContests') || '[]');
        } catch {
            return [];
        }
    }

    getCrowdsourcingProblems() {
        try {
            return JSON.parse(localStorage.getItem('crowdsourcingProblems') || '[]');
        } catch {
            return [];
        }
    }

    getDiscordInvites() {
        try {
            return JSON.parse(localStorage.getItem('discordInvites') || '[]');
        } catch {
            return [];
        }
    }

    getFranchisePrograms() {
        try {
            return JSON.parse(localStorage.getItem('franchisePrograms') || '[]');
        } catch {
            return [];
        }
    }

    getIncubatorProjects() {
        try {
            return JSON.parse(localStorage.getItem('incubatorProjects') || '[]');
        } catch {
            return [];
        }
    }

    getSolutionApps() {
        try {
            return JSON.parse(localStorage.getItem('solutionApps') || '[]');
        } catch {
            return [];
        }
    }

    // 렌더링 메서드들
    renderBadgeSystem() {
        const badgeContainer = document.querySelector('.badge-system');
        if (!badgeContainer) return;

        let badgeHTML = '<div class="badge-collection">';
        badgeHTML += '<h3>🏆 내 배지 컬렉션</h3>';
        
        this.userBadges.forEach(badgeId => {
            const badge = this.badges[badgeId];
            if (badge) {
                badgeHTML += `
                    <div class="badge-item earned">
                        <div class="badge-icon">${badge.icon}</div>
                        <div class="badge-info">
                            <h4>${badge.name}</h4>
                            <p>${badge.description}</p>
                        </div>
                    </div>
                `;
            }
        });

        // 획득하지 않은 배지들
        Object.keys(this.badges).forEach(badgeId => {
            if (!this.userBadges.includes(badgeId)) {
                const badge = this.badges[badgeId];
                badgeHTML += `
                    <div class="badge-item locked">
                        <div class="badge-icon">🔒</div>
                        <div class="badge-info">
                            <h4>${badge.name}</h4>
                            <p>${badge.description}</p>
                        </div>
                    </div>
                `;
            }
        });

        badgeHTML += '</div>';
        badgeContainer.innerHTML = badgeHTML;
    }

    renderMonthlyChampion() {
        const championContainer = document.querySelector('.monthly-champion');
        if (!championContainer) return;

        if (this.currentChampion) {
            championContainer.innerHTML = `
                <div class="champion-card">
                    <h3>👑 이번 달 불편함 발견왕</h3>
                    <div class="champion-info">
                        <div class="champion-avatar">${this.currentChampion.avatar || '🏆'}</div>
                        <div class="champion-details">
                            <h4>${this.currentChampion.name}</h4>
                            <p>${this.currentChampion.problemsFound}개의 문제 발견</p>
                            <p>${this.currentChampion.points}점 획득</p>
                        </div>
                    </div>
                    <div class="champion-rewards">
                        <span class="reward-item">🎁 특별 보상</span>
                        <span class="reward-item">📜 인증서</span>
                        <span class="reward-item">💰 보너스 포인트</span>
                    </div>
                </div>
            `;
        } else {
            championContainer.innerHTML = `
                <div class="champion-card">
                    <h3>👑 이번 달 불편함 발견왕</h3>
                    <p>아직 선정되지 않았습니다. 여러분이 첫 번째 챔피언이 될 수 있습니다!</p>
                </div>
            `;
        }
    }

    renderRoyaltySystem() {
        const royaltyContainer = document.querySelector('.royalty-system');
        if (!royaltyContainer) return;

        const totalRoyalty = this.royaltyHistory.reduce((sum, royalty) => sum + royalty.amount, 0);
        
        royaltyContainer.innerHTML = `
            <div class="royalty-dashboard">
                <h3>💰 로열티 대시보드</h3>
                <div class="royalty-stats">
                    <div class="stat-item">
                        <span class="stat-number">${totalRoyalty.toLocaleString()}원</span>
                        <span class="stat-label">총 로열티 수익</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${(this.royaltyRate * 100).toFixed(1)}%</span>
                        <span class="stat-label">로열티 비율</span>
                    </div>
                </div>
                <div class="royalty-history">
                    <h4>최근 로열티 내역</h4>
                    ${this.royaltyHistory.slice(-5).map(royalty => `
                        <div class="royalty-item">
                            <span class="royalty-date">${new Date(royalty.date).toLocaleDateString()}</span>
                            <span class="royalty-amount">+${royalty.amount.toLocaleString()}원</span>
                            <span class="royalty-source">${royalty.source}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }


    renderChallenges() {
        const challengeContainer = document.querySelector('.monthly-challenges');
        if (!challengeContainer) return;

        const currentMonth = new Date().toLocaleDateString('ko-KR', { month: 'long' });
        const currentChallenge = this.monthlyChallenges[Object.keys(this.monthlyChallenges).find(key => 
            this.monthlyChallenges[key].theme.includes(currentMonth)
        )];

        if (currentChallenge) {
            challengeContainer.innerHTML = `
                <div class="challenge-card active">
                    <h3>🎯 ${currentMonth} 챌린지</h3>
                    <h4>${currentChallenge.theme}</h4>
                    <p>${currentChallenge.description}</p>
                    <div class="challenge-reward">
                        <span class="reward-amount">${currentChallenge.reward}점</span>
                        <span class="reward-label">보상</span>
                    </div>
                    <button class="btn btn-primary" onclick="joinChallenge('${currentMonth}')">챌린지 참여하기</button>
                </div>
            `;
        }
    }


    renderStorytelling() {
        const storyContainer = document.querySelector('.storytelling-system');
        if (!storyContainer) return;

        storyContainer.innerHTML = `
            <div class="storytelling-dashboard">
                <h3>📖 불편함 스토리텔링</h3>
                <div class="story-contests">
                    <h4>진행 중인 스토리 콘테스트</h4>
                    ${this.storyContests.map(contest => `
                        <div class="contest-card">
                            <h5>${contest.title}</h5>
                            <p>${contest.description}</p>
                            <div class="contest-prize">
                                <span class="prize-amount">${contest.prize}</span>
                                <span class="prize-label">상금</span>
                            </div>
                            <button class="btn btn-outline" onclick="joinStoryContest('${contest.id}')">참여하기</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="submitStory()">스토리 제출하기</button>
            </div>
        `;
    }

    renderCrowdsourcing() {
        const crowdsourcingContainer = document.querySelector('.crowdsourcing-system');
        if (!crowdsourcingContainer) return;

        crowdsourcingContainer.innerHTML = `
            <div class="crowdsourcing-dashboard">
                <h3>🤝 불편함 크라우드소싱</h3>
                <div class="crowdsourcing-problems">
                    <h4>해결이 필요한 문제들</h4>
                    ${this.crowdsourcingProblems.map(problem => `
                        <div class="problem-card">
                            <h5>${problem.title}</h5>
                            <p>${problem.description}</p>
                            <div class="problem-meta">
                                <span class="problem-reward">${problem.reward}점</span>
                                <span class="problem-solver-count">${problem.solvers}명 참여</span>
                            </div>
                            <button class="btn btn-primary" onclick="solveProblem('${problem.id}')">해결하기</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="postProblem()">문제 올리기</button>
            </div>
        `;
    }

    renderCreativeRewards() {
        const rewardsContainer = document.querySelector('.creative-rewards');
        if (!rewardsContainer) return;

        rewardsContainer.innerHTML = `
            <div class="creative-rewards-dashboard">
                <h3>🎖️ 창의적 보상 시스템</h3>
                <div class="honorary-positions">
                    ${Object.values(this.honoraryPositions).map(position => `
                        <div class="position-card">
                            <div class="position-icon">${position.icon}</div>
                            <h4>${position.name}</h4>
                            <ul class="position-benefits">
                                ${position.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                            <button class="btn btn-outline" onclick="applyPosition('${position.name}')">지원하기</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderDiscordIntegration() {
        const discordContainer = document.querySelector('.discord-integration');
        if (!discordContainer) return;

        discordContainer.innerHTML = `
            <div class="discord-dashboard">
                <h3>💬 Discord 커뮤니티</h3>
                <div class="discord-channels">
                    <div class="channel-card">
                        <h4>🕵️‍♂️ 불편함 해결사 채널</h4>
                        <p>전용 Discord 채널에 초대받으세요!</p>
                        <button class="btn btn-discord" onclick="joinDiscord()">Discord 참여하기</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderFranchiseSystem() {
        const franchiseContainer = document.querySelector('.franchise-system');
        if (!franchiseContainer) return;

        franchiseContainer.innerHTML = `
            <div class="franchise-dashboard">
                <h3>🏪 불편함 해결사 프랜차이즈</h3>
                <div class="franchise-programs">
                    <div class="program-card">
                        <h4>🎓 전문가 양성 프로그램</h4>
                        <p>불편함 해결 전문가로 성장하세요</p>
                        <ul>
                            <li>전문 교육 과정</li>
                            <li>자격증 발급</li>
                            <li>컨설팅 기회</li>
                        </ul>
                        <button class="btn btn-primary" onclick="joinFranchise()">프랜차이즈 참여</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderIncubator() {
        const incubatorContainer = document.querySelector('.incubator-system');
        if (!incubatorContainer) return;

        incubatorContainer.innerHTML = `
            <div class="incubator-dashboard">
                <h3>🚀 불편함 기반 스타트업 인큐베이터</h3>
                <div class="incubator-projects">
                    <h4>진행 중인 프로젝트들</h4>
                    ${this.incubatorProjects.map(project => `
                        <div class="project-card">
                            <h5>${project.title}</h5>
                            <p>${project.description}</p>
                            <div class="project-meta">
                                <span class="project-stage">${project.stage}</span>
                                <span class="project-funding">${project.funding}원 투자</span>
                            </div>
                            <button class="btn btn-outline" onclick="joinProject('${project.id}')">프로젝트 참여</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="submitStartupIdea()">스타트업 아이디어 제출</button>
            </div>
        `;
    }

    renderAppStore() {
        const appStoreContainer = document.querySelector('.app-store');
        if (!appStoreContainer) return;

        appStoreContainer.innerHTML = `
            <div class="app-store-dashboard">
                <h3>📱 불편함 해결사 앱 스토어</h3>
                <div class="solution-apps">
                    ${this.solutionApps.map(app => `
                        <div class="app-card">
                            <div class="app-icon">${app.icon}</div>
                            <h4>${app.name}</h4>
                            <p>${app.description}</p>
                            <div class="app-meta">
                                <span class="app-price">${app.price}원</span>
                                <span class="app-rating">⭐ ${app.rating}</span>
                            </div>
                            <button class="btn btn-primary" onclick="downloadApp('${app.id}')">다운로드</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="publishApp()">앱 출시하기</button>
            </div>
        `;
    }

    // 액션 메서드들
    awardBadge(badgeId) {
        if (!this.userBadges.includes(badgeId)) {
            this.userBadges.push(badgeId);
            localStorage.setItem('userBadges', JSON.stringify(this.userBadges));
            this.showBadgeNotification(badgeId);
            this.renderBadgeSystem();
        }
    }

    showBadgeNotification(badgeId) {
        const badge = this.badges[badgeId];
        if (badge) {
            showNotification(`🏆 새로운 배지 획득: ${badge.name}`, 'success');
        }
    }

    calculateMonthlyChampion() {
        const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
        // 실제로는 서버에서 월간 통계를 가져와야 함
        const mockChampion = {
            month: currentMonth,
            name: '김혁신',
            avatar: '🚀',
            problemsFound: 15,
            points: 750
        };
        
        this.monthlyChampions.push(mockChampion);
        localStorage.setItem('monthlyChampions', JSON.stringify(this.monthlyChampions));
        this.renderMonthlyChampion();
    }

    payRoyalty(amount, source) {
        const royalty = {
            date: new Date().toISOString(),
            amount: amount,
            source: source
        };
        
        this.royaltyHistory.push(royalty);
        localStorage.setItem('royaltyHistory', JSON.stringify(this.royaltyHistory));
        this.renderRoyaltySystem();
    }

}

// 전역 인스턴스 생성
window.InnovationSystem = new InnovationSystem();

// 액션 함수들

window.joinChallenge = function(month) {
    showNotification(`${month} 챌린지에 참여했습니다!`, 'success');
};


window.joinStoryContest = function(contestId) {
    showNotification('스토리 콘테스트에 참여했습니다!', 'success');
};

window.submitStory = function() {
    showNotification('스토리 제출 모달을 열었습니다!', 'info');
};

window.solveProblem = function(problemId) {
    showNotification('문제 해결에 참여했습니다!', 'success');
};

window.postProblem = function() {
    showNotification('문제 등록 모달을 열었습니다!', 'info');
};

window.applyPosition = function(positionName) {
    showNotification(`${positionName}에 지원했습니다!`, 'success');
};

window.joinDiscord = function() {
    showNotification('Discord 초대 링크를 복사했습니다!', 'success');
};

window.joinFranchise = function() {
    showNotification('프랜차이즈 신청을 완료했습니다!', 'success');
};

window.joinProject = function(projectId) {
    showNotification('프로젝트에 참여했습니다!', 'success');
};

window.submitStartupIdea = function() {
    showNotification('스타트업 아이디어 제출 모달을 열었습니다!', 'info');
};

window.downloadApp = function(appId) {
    showNotification('앱 다운로드를 시작했습니다!', 'success');
};

window.publishApp = function() {
    showNotification('앱 출시 모달을 열었습니다!', 'info');
};

