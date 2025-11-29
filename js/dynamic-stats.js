// 동적 통계 데이터 로딩 및 관리
class DynamicStatsManager {
    constructor() {
        this.db = window.db;
        this.animationDuration = 2000; // 2초
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // DOM 로드 완료 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeStats());
        } else {
            this.initializeStats();
        }

        // 실시간 업데이트 이벤트 리스너
        window.addEventListener('statsUpdated', (event) => {
            this.updateDisplayedStats(event.detail);
        });
    }

    // 통계 초기화
    initializeStats() {
        if (this.isInitialized || !this.db) return;
        
        this.isInitialized = true;
        
        // data-stat 속성을 가진 모든 요소 업데이트
        this.updateAllStatElements();
        
        // 특별한 처리가 필요한 요소들
        this.updateFeedReactions();
        this.updateSpecialElements();

        console.log('동적 통계 시스템 초기화 완료');
    }

    // data-stat 속성을 가진 모든 요소 업데이트
    updateAllStatElements() {
        const stats = this.db.getStats();
        const statElements = document.querySelectorAll('[data-stat]');
        
        statElements.forEach(element => {
            const statKey = element.getAttribute('data-stat');
            const value = stats[statKey];
            
            if (value !== undefined) {
                // 0인 경우 특별 처리
                if (value === 0) {
                    // 0인 경우 적절한 메시지로 대체
                    if (statKey.includes('communityGoals') || statKey.includes('supportMessages')) {
                        element.textContent = '아직 없음';
                        element.style.fontSize = '0.9em';
                        element.style.color = '#999';
                    } else if (statKey.includes('newsletterSubscribers')) {
                        element.textContent = '준비 중';
                        element.style.fontSize = '0.9em';
                        element.style.color = '#999';
                    } else if (statKey.includes('goalsAchieved')) {
                        element.textContent = '곧 시작!';
                        element.style.fontSize = '0.9em';
                        element.style.color = '#999';
                    } else {
                        element.textContent = '0';
                    }
                } else {
                    // 일반적인 처리
                    if (statKey === 'investmentProgress') {
                        element.textContent = `${value}%`;
                    } else if (statKey === 'expectedROI') {
                        element.textContent = value > 0 ? `${value}%+` : '미정';
                    } else if (statKey === 'totalUsers' && element.tagName === 'STRONG') {
                        element.textContent = `${value.toLocaleString()}명`;
                    } else {
                        // 일반적인 숫자 애니메이션
                        this.animateNumber(element, value);
                        // data-target 속성도 업데이트
                        element.setAttribute('data-target', value);
                    }
                }
            }
        });
    }

    // Hero Section 통계 업데이트
    updateHeroStats() {
        const stats = this.db.getStats();
        
        this.animateNumber('proof-number[data-target="1000"]', stats.goalsAchieved);
        this.animateNumber('proof-number[data-target="95"]', stats.userSatisfaction);
        this.animateNumber('proof-number[data-target="24"]', stats.goalCreationTime);
        
        // data-target 속성도 업데이트
        const elements = document.querySelectorAll('.proof-number');
        elements.forEach(el => {
            const currentTarget = parseInt(el.getAttribute('data-target'));
            if (currentTarget === 1000) {
                el.setAttribute('data-target', stats.goalsAchieved);
            } else if (currentTarget === 95) {
                el.setAttribute('data-target', stats.userSatisfaction);
            } else if (currentTarget === 24) {
                el.setAttribute('data-target', stats.goalCreationTime);
            }
        });
    }

    // Community Section 통계 업데이트
    updateCommunityStats() {
        const stats = this.db.getStats();
        
        this.animateNumber('stat-number[data-target="2847"]', stats.communityGoals);
        this.animateNumber('stat-number[data-target="15432"]', stats.supportMessages);
        this.animateNumber('stat-number[data-target="89"]', stats.achievementRate);
        
        // data-target 속성 업데이트
        const elements = document.querySelectorAll('.stat-number');
        elements.forEach(el => {
            const currentTarget = parseInt(el.getAttribute('data-target'));
            if (currentTarget === 2847) {
                el.setAttribute('data-target', stats.communityGoals);
            } else if (currentTarget === 15432) {
                el.setAttribute('data-target', stats.supportMessages);
            } else if (currentTarget === 89) {
                el.setAttribute('data-target', stats.achievementRate);
            }
        });
    }

    // 피드백 시스템 통계 업데이트
    updateFeedbackStats() {
        const stats = this.db.getStats();
        
        this.updateElementText('totalIdeas', stats.totalIdeas);
        this.updateElementText('implementedIdeas', stats.implementedIdeas);
        this.updateElementText('activeUsers', stats.activeUsers);
    }

    // About Section 통계 업데이트
    updateAboutStats() {
        const stats = this.db.getStats();
        
        // About section의 통계들
        const aboutStatElements = document.querySelectorAll('#about .stat-number');
        if (aboutStatElements.length >= 3) {
            this.animateNumber(aboutStatElements[0], stats.discoveredProblems);
            this.animateNumber(aboutStatElements[1], stats.solvedProblems);
            this.animateNumber(aboutStatElements[2], stats.userSatisfactionSurvey);
            
            // data-target 속성 업데이트
            aboutStatElements[0].setAttribute('data-target', stats.discoveredProblems);
            aboutStatElements[1].setAttribute('data-target', stats.solvedProblems);
            aboutStatElements[2].setAttribute('data-target', stats.userSatisfactionSurvey);
        }
    }

    // Newsletter 통계 업데이트
    updateNewsletterStats() {
        const stats = this.db.getStats();
        
        const newsletterStatElements = document.querySelectorAll('.newsletter-stats .stat-number');
        if (newsletterStatElements.length >= 2) {
            this.animateNumber(newsletterStatElements[0], stats.newsletterSubscribers);
            this.animateNumber(newsletterStatElements[1], stats.newsletterSatisfaction);
            
            // data-target 속성 업데이트
            newsletterStatElements[0].setAttribute('data-target', stats.newsletterSubscribers);
            newsletterStatElements[1].setAttribute('data-target', stats.newsletterSatisfaction);
        }
    }

    // 투자 & 협업 통계 업데이트
    updateInvestmentStats() {
        const stats = this.db.getStats();
        
        // 투자 진행률 업데이트
        const progressElement = document.querySelector('.investment-info .value');
        if (progressElement && progressElement.textContent.includes('%')) {
            progressElement.textContent = `${stats.investmentProgress}%`;
        }
        
        // 협업 통계 업데이트
        this.updateElementText('activeCollabs', stats.activeCollaborations);
        this.updateElementText('successRate', stats.collaborationSuccessRate);
    }

    // 피드 반응 수 업데이트
    updateFeedReactions() {
        const reactions = this.db.getFeedReactions();
        
        // 각 피드의 반응 수 업데이트
        const reactionButtons = document.querySelectorAll('.reaction-btn');
        reactionButtons.forEach(btn => {
            const text = btn.textContent.trim();
            
            // 첫 번째 피드 (👏, 🔥)
            if (text.includes('👏') && reactions.post1) {
                btn.textContent = `👏 ${reactions.post1.clap}`;
            } else if (text.includes('🔥') && reactions.post1) {
                btn.textContent = `🔥 ${reactions.post1.fire}`;
            }
            // 두 번째 피드 (💪, 📚)
            else if (text.includes('💪') && reactions.post2) {
                btn.textContent = `💪 ${reactions.post2.muscle}`;
            } else if (text.includes('📚') && reactions.post2) {
                btn.textContent = `📚 ${reactions.post2.book}`;
            }
            // 세 번째 피드 (🍳, 👍)
            else if (text.includes('🍳') && reactions.post3) {
                btn.textContent = `🍳 ${reactions.post3.cooking}`;
            } else if (text.includes('👍') && reactions.post3) {
                btn.textContent = `👍 ${reactions.post3.thumbsUp}`;
            }
        });
    }

    // Quick Start 통계 업데이트
    updateQuickStartStats() {
        const stats = this.db.getStats();
        
        const ctaNote = document.querySelector('.cta-note strong');
        if (ctaNote) {
            ctaNote.textContent = `${stats.totalUsers.toLocaleString()}명`;
        }
    }

    // 숫자 애니메이션
    animateNumber(selector, targetValue) {
        let element;
        
        if (typeof selector === 'string') {
            element = document.querySelector(selector);
        } else {
            element = selector;
        }
        
        if (!element) return;
        
        const startValue = parseInt(element.textContent) || 0;
        const duration = this.animationDuration;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetValue;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 요소 텍스트 업데이트
    updateElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            this.animateNumber(element, value);
        }
    }

    // 특별한 처리가 필요한 요소들
    updateSpecialElements() {
        // 현재는 특별한 처리가 필요한 요소가 없음
        // 필요시 여기에 추가
    }

    // 실시간 통계 업데이트 처리
    updateDisplayedStats(newStats) {
        // 모든 data-stat 속성 요소 업데이트
        this.updateAllStatElements();
        
        // 특별한 처리가 필요한 요소들
        this.updateFeedReactions();
        this.updateSpecialElements();
        
        console.log('실시간 통계 업데이트 완료:', new Date().toLocaleTimeString());
    }

    // 수동 통계 새로고침
    refreshStats() {
        if (this.db) {
            this.initializeStats();
        }
    }

    // 특정 통계 값 가져오기
    getStatValue(key) {
        return this.db ? this.db.getStatValue(key) : 0;
    }

    // 피드 반응 클릭 처리
    handleFeedReaction(postKey, reactionKey) {
        if (this.db) {
            const newCount = this.db.updateFeedReaction(postKey, reactionKey);
            this.updateFeedReactions();
            return newCount;
        }
        return 0;
    }
}

// 전역 인스턴스 생성
window.DynamicStatsManager = DynamicStatsManager;
window.dynamicStats = new DynamicStatsManager();

// 유틸리티 함수들
window.refreshAllStats = () => {
    if (window.dynamicStats) {
        window.dynamicStats.refreshStats();
    }
};

window.getStatValue = (key) => {
    return window.dynamicStats ? window.dynamicStats.getStatValue(key) : 0;
};

// 피드 반응 클릭 이벤트 핸들러
document.addEventListener('DOMContentLoaded', function() {
    // 반응 버튼에 클릭 이벤트 추가
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 버튼 텍스트에서 포스트와 반응 타입 판단
            const text = this.textContent.trim();
            let postKey, reactionKey;
            
            if (text.includes('👏')) {
                postKey = 'post1';
                reactionKey = 'clap';
            } else if (text.includes('🔥')) {
                postKey = 'post1';
                reactionKey = 'fire';
            } else if (text.includes('💪')) {
                postKey = 'post2';
                reactionKey = 'muscle';
            } else if (text.includes('📚')) {
                postKey = 'post2';
                reactionKey = 'book';
            } else if (text.includes('🍳')) {
                postKey = 'post3';
                reactionKey = 'cooking';
            } else if (text.includes('👍')) {
                postKey = 'post3';
                reactionKey = 'thumbsUp';
            }
            
            if (postKey && reactionKey && window.dynamicStats) {
                window.dynamicStats.handleFeedReaction(postKey, reactionKey);
            }
        });
    });
});

console.log('동적 통계 관리 시스템 로드 완료');
