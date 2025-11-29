// Main JavaScript functionality for Goal-Illa Company website

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        setTimeout(() => {
            loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Check authentication status on page load
    checkAuthStatus();
    
    // Check authentication status when page becomes visible (after logout from other tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkAuthStatus();
        }
    });
    
    // Check authentication status when window gains focus
    window.addEventListener('focus', function() {
        checkAuthStatus();
    });
    
    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            // Handle click events for dropdown
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyActive = dropdown.classList.contains('active');
                
                // Close all dropdowns first
                dropdowns.forEach(otherDropdown => {
                    otherDropdown.classList.remove('active');
                    otherDropdown.querySelector('.dropdown-menu')?.classList.remove('show');
                });
                
                
                // If this dropdown wasn't active, open it
                if (!isCurrentlyActive) {
                    dropdown.classList.add('active');
                    dropdownMenu.classList.add('show');
                }
            });
            
            // Handle mouse enter/leave for desktop
            dropdown.addEventListener('mouseenter', function() {
                if (window.innerWidth > 991) {
                    dropdown.classList.add('active');
                    dropdownMenu.classList.add('show');
                }
            });
            
            dropdown.addEventListener('mouseleave', function() {
                if (window.innerWidth > 991 && !dropdownMenu.matches(':focus-within')) {
                    dropdown.classList.remove('active');
                    dropdownMenu.classList.remove('show');
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                    dropdownMenu.classList.remove('show');
                }
            });
            
            // Close dropdown when pressing Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    dropdown.classList.remove('active');
                    dropdownMenu.classList.remove('show');
                }
            });
            
            // Handle keyboard navigation
            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach((item, index) => {
                item.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = dropdownItems[index + 1];
                        if (nextItem) nextItem.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = dropdownItems[index - 1];
                        if (prevItem) prevItem.focus();
                    }
                });
            });
        }
    });

    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        console.log('Hamburger menu initialized'); // Debug log
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('Menu toggled:', navMenu.classList.contains('active')); // Debug log
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Hamburger or nav menu not found'); // Debug log
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = '#fff';
                navbar.style.backdropFilter = 'none';
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.app-card, .support-card, .value-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Phone mockup animation
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        const goalItems = document.querySelectorAll('.goal-item');
        let currentIndex = 0;

        function animateGoalItems() {
            goalItems.forEach((item, index) => {
                if (index === currentIndex) {
                    item.style.transform = 'translateY(-5px)';
                    item.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
                } else {
                    item.style.transform = 'translateY(0)';
                    item.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }
            });
            
            currentIndex = (currentIndex + 1) % goalItems.length;
        }

        // Start animation after a delay
        setTimeout(() => {
            setInterval(animateGoalItems, 2000);
        }, 1000);
    }

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Form validation (for contact forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            let firstInvalidInput = null;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    if (!firstInvalidInput) firstInvalidInput = input;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '전송 중...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showNotification('모든 필수 필드를 입력해주세요.', 'error');
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                    firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = '#27ae60';
                break;
            case 'error':
                notification.style.background = '#e74c3c';
                break;
            default:
                notification.style.background = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Search functionality (if search input exists)
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.searchable-item');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Back to top functionality
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize tooltips (if any)
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.tooltipElement = null;
            }
        });
    });

    // 로그인 상태 확인 및 네비게이션 업데이트
    updateAuthNavigation();
    
    // 앱 관리 시스템 초기화
    if (typeof initializeAppsSystem === 'function') {
        initializeAppsSystem();
    } else {
        // 앱 대시보드 링크 표시/숨김 (기존 방식)
        updateAppDashboardLinks();
    }

    // 다크 모드 토글 기능
    initializeThemeToggle();
    
    // 실시간 통계 카운터
    initializeCounterAnimation();
    
    // 파티클 배경 효과
    createParticleBackground();
    
    // 타이핑 애니메이션
    initializeTypingAnimation();
    
    // 스크롤 진행률 표시
    initializeScrollProgress();
    
    // 마우스 커서 효과
    initializeMouseEffects();

    // 브라우저 알림 권한 요청
    requestNotificationPermission();
    
    // 실시간 업데이트 체크
    startRealTimeUpdates();
    
    // PWA Service Worker 등록
    registerServiceWorker();
    
    // 뉴스레터 구독 기능 초기화
    initializeNewsletter();
    
    
    // Problem-Solution Section 초기화
    initializeProblemSolutionSection();
    
    // 피드백 시스템 초기화
    initializeFeedbackSystem();
    
    // 모든 데이터베이스 연동 초기화
    initializeAllDatabaseConnections();
    
    // 데이터베이스 기반 콘텐츠 로드
    loadDatabaseContent();
    
    console.log('Goal-Illa Company website loaded successfully! 🎯');
});

// 데이터베이스 기반 콘텐츠 로드 함수
function loadDatabaseContent() {
    // 데이터베이스가 준비될 때까지 대기
    if (!window.db) {
        setTimeout(loadDatabaseContent, 100);
        return;
    }
    
    // 커뮤니티 피드 로드
    loadCommunityFeed();
    
    // 최근 아이디어 로드
    loadRecentIdeas();
    
    // 팀 정보는 이미 displayDefaultTeamData에서 처리됨
}

// 커뮤니티 피드 로드
async function loadCommunityFeed() {
    const feedContainer = document.getElementById('communityFeedContainer');
    if (!feedContainer) return;
    
    try {
        let feedData = [];
        
        // Supabase에서 커뮤니티 피드 로드
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            feedData = await window.SupabaseAPI.getCommunityFeed(20);
            // Supabase 데이터 형식에 맞게 변환
            feedData = feedData.map(feed => ({
                id: feed.id,
                user: {
                    name: feed.user_name || '익명',
                    avatar: feed.user_avatar || '👤'
                },
                type: feed.type,
                content: feed.content,
                timestamp: feed.timestamp,
                reactions: feed.reactions || {}
            }));
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
            feedData = window.db.getCommunityFeed();
        }
        
        let feedHtml = '';
        if (feedData.length === 0) {
            feedHtml = `
                <div class="loading-feed">
                    <i class="fas fa-info-circle"></i>
                    <p>아직 커뮤니티 피드가 없습니다. 첫 번째 피드를 작성해보세요!</p>
                </div>
            `;
        } else {
            feedData.forEach(feed => {
                const timeAgo = getTimeAgo(new Date(feed.timestamp));
                const statusBadge = getStatusBadge(feed.type);
                const reactions = Object.entries(feed.reactions || {}).map(([key, value]) => {
                    const emoji = getReactionEmoji(key);
                    return `<button class="reaction-btn" data-post="${feed.id}" data-reaction="${key}">${emoji} ${value}</button>`;
                }).join('');
                
                feedHtml += `
                    <div class="feed-item">
                        <div class="user-avatar">${feed.user.avatar}</div>
                        <div class="feed-content">
                            <div class="user-info">
                                <span class="username">${feed.user.name}</span>
                                ${statusBadge}
                            </div>
                            <p>${feed.content}</p>
                            <div class="feed-meta">
                                <span class="time">${timeAgo}</span>
                                <div class="reactions">
                                    ${reactions}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        feedContainer.innerHTML = feedHtml;
        
        // 반응 버튼에 이벤트 리스너 추가
        addReactionListeners();
        
    } catch (error) {
        console.error('커뮤니티 피드 로드 실패:', error);
        feedContainer.innerHTML = `
            <div class="loading-feed">
                <i class="fas fa-exclamation-triangle"></i>
                <p>피드를 불러올 수 없습니다.</p>
            </div>
        `;
    }
}

// 최근 아이디어 로드
async function loadRecentIdeas() {
    const ideasList = document.getElementById('recentIdeasList');
    if (!ideasList) return;
    
    try {
        let ideasData = [];
        
        // Supabase에서 최근 아이디어 로드
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            ideasData = await window.SupabaseAPI.getRecentIdeas(10);
            // Supabase 데이터 형식에 맞게 변환
            ideasData = ideasData.map(idea => ({
                id: idea.id,
                content: idea.content,
                category: idea.category,
                status: idea.status,
                submittedAt: idea.submitted_at
            }));
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
            ideasData = window.db.getRecentIdeas();
        }
        
        let ideasHtml = '';
        if (ideasData.length === 0) {
            ideasHtml = `
                <div class="loading-ideas">
                    <i class="fas fa-info-circle"></i>
                    <p>아직 제안된 아이디어가 없습니다. 첫 번째 아이디어를 제안해보세요!</p>
                </div>
            `;
        } else {
            ideasData.forEach(idea => {
                const timeAgo = getTimeAgo(new Date(idea.submittedAt));
                const statusClass = idea.status === 'implemented' ? 'implemented' : 'reviewing';
                const statusText = idea.status === 'implemented' ? '구현됨' : '검토 중';
                
                ideasHtml += `
                    <div class="idea-item">
                        <div class="idea-content">
                            <p>"${idea.content}"</p>
                            <div class="idea-meta">
                                <span class="idea-category">${idea.category || '기타'}</span>
                                <span class="idea-date">${timeAgo}</span>
                            </div>
                        </div>
                        <div class="idea-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                `;
            });
        }
        
        ideasList.innerHTML = ideasHtml;
        
    } catch (error) {
        console.error('아이디어 로드 실패:', error);
        ideasList.innerHTML = `
            <div class="loading-ideas">
                <i class="fas fa-exclamation-triangle"></i>
                <p>아이디어를 불러올 수 없습니다.</p>
            </div>
        `;
    }
}

// 유틸리티 함수들
function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
}

function getStatusBadge(type) {
    switch (type) {
        case 'achievement':
            return '<span class="achievement">🏆 목표 달성!</span>';
        case 'progress':
            return '<span class="progress">📊 진행중</span>';
        case 'new-goal':
            return '<span class="new-goal">✨ 새 목표</span>';
        default:
            return '';
    }
}

function getReactionEmoji(key) {
    const emojiMap = {
        'clap': '👏',
        'fire': '🔥',
        'muscle': '💪',
        'book': '📚',
        'cooking': '🍳',
        'thumbsUp': '👍'
    };
    return emojiMap[key] || '👍';
}

function addReactionListeners() {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.post;
            const reactionKey = this.dataset.reaction;
            
            if (window.dynamicStats && postId && reactionKey) {
                window.dynamicStats.handleFeedReaction(`post${postId}`, reactionKey);
                // 버튼 텍스트 업데이트는 dynamicStats에서 처리됨
            }
        });
    });
}

// Problem-Solution Section 초기화 함수
function initializeProblemSolutionSection() {
    // 문제 제출 통계 초기화
    updateProblemStats();
    
    // 카드 네비게이션 초기화
    let currentCardIndex = 0;
    const cards = ['planning', 'motivation', 'tracking'];
    
    // 데이터베이스에서 카드 데이터 가져오기
    let cardData = {};
    if (window.db) {
        const dbCards = window.db.getProblemSolutionCards();
        dbCards.forEach(card => {
            cardData[card.id] = card;
        });
    } else {
        // 데이터베이스가 없는 경우 기본 데이터
        console.warn('데이터베이스를 사용할 수 없습니다. 기본 카드 데이터를 사용합니다.');
        cardData = {
            planning: {
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
            }
        };
    }
    
    // 카드 업데이트 함수
    window.updateCardDisplay = function() {
        const currentCard = cards[currentCardIndex];
        const data = cardData[currentCard];
        
        // 문제 카드 업데이트
        const problemCard = document.querySelector('.problem-card');
        if (problemCard) {
            problemCard.querySelector('.card-emoji').textContent = data.problem.emoji;
            problemCard.querySelector('.card-header h4').textContent = data.problem.title;
            problemCard.querySelector('.card-content p').textContent = data.problem.description;
            problemCard.querySelector('.quote-text').textContent = data.problem.quote;
            problemCard.querySelector('.quote-author').textContent = `- ${data.problem.author}`;
        }
        
        // 해결책 카드 업데이트
        const solutionCard = document.querySelector('.solution-card');
        if (solutionCard) {
            solutionCard.querySelector('.card-emoji').textContent = data.solution.emoji;
            solutionCard.querySelector('.card-header h4').textContent = data.solution.title;
            solutionCard.querySelector('.card-content p').textContent = data.solution.description;
            
            // 기능 목록 업데이트
            const featuresContainer = solutionCard.querySelector('.solution-features');
            if (featuresContainer) {
                featuresContainer.innerHTML = data.solution.features.map(feature => `
                    <div class="feature-item">
                        <i class="${feature.icon}"></i>
                        <span>${feature.text}</span>
                    </div>
                `).join('');
            }
        }
        
        // 인디케이터 업데이트
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentCardIndex);
        });
    };
    
    // 다음 카드 함수
    window.nextCard = function() {
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        updateCardDisplay();
    };
    
    // 이전 카드 함수
    window.previousCard = function() {
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        updateCardDisplay();
    };
    
    // 초기 카드 표시
    updateCardDisplay();
}

// 피드백 시스템 초기화 (불편함 신고 시스템으로 변경)
function initializeFeedbackSystem() {
    updateProblemStats();
    updateRecentProblems();
    initializeTagButtons();
    
    // 실시간 통계 업데이트 리스너
    window.addEventListener('statsUpdated', function(event) {
        updateProblemStats();
        updateCommunityStats();
        updateInvestmentStats();
    });
}

// 태그 버튼 초기화
function initializeTagButtons() {
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 피드백 통계 업데이트
function updateFeedbackStats() {
    const ideaData = getIdeaData();
    
    document.getElementById('totalIdeas').textContent = ideaData.ideas.length;
    document.getElementById('implementedIdeas').textContent = ideaData.ideas.filter(idea => idea.status === 'implemented').length;
    document.getElementById('activeUsers').textContent = new Set(ideaData.ideas.map(idea => idea.userId || 'anonymous')).size;
}

// 최근 아이디어 업데이트
function updateRecentIdeas() {
    const ideaData = getIdeaData();
    const recentIdeas = ideaData.ideas.slice(-5).reverse(); // 최근 5개, 역순
    
    const recentIdeasList = document.getElementById('recentIdeasList');
    if (!recentIdeasList || recentIdeas.length === 0) return;
    
    const categoriesMap = {
        'goal': '목표 관리',
        'daily': '일상생활',
        'work': '업무/학습',
        'tech': '기술',
        'other': '기타'
    };
    
    recentIdeasList.innerHTML = recentIdeas.map(idea => {
        const timeAgo = getTimeAgo(new Date(idea.timestamp));
        const categoryName = categoriesMap[idea.category] || '기타';
        const statusClass = idea.status === 'implemented' ? 'implemented' : 'reviewing';
        const statusText = idea.status === 'implemented' ? '구현됨' : '검토 중';
        
        return `
            <div class="idea-item">
                <div class="idea-content">
                    <p>"${idea.text}"</p>
                    <div class="idea-meta">
                        <span class="idea-category">${categoryName}</span>
                        <span class="idea-date">${timeAgo}</span>
                    </div>
                </div>
                <div class="idea-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 시간 경과 계산
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

// 아이디어 데이터 관리
function getIdeaData() {
    try {
        const stored = localStorage.getItem('ideaData');
        return stored ? JSON.parse(stored) : { ideas: [] };
    } catch (error) {
        console.error('아이디어 데이터 로드 실패:', error);
        return { ideas: [] };
    }
}

function saveIdeaData(data) {
    try {
        localStorage.setItem('ideaData', JSON.stringify(data));
    } catch (error) {
        console.error('아이디어 데이터 저장 실패:', error);
    }
}

// 아이디어 감사 모달
function showIdeaThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>💡 감사합니다!</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="thank-you-content">
                    <div class="thank-you-icon">✨</div>
                    <h4>소중한 아이디어를 제안해주셔서 감사합니다!</h4>
                    <p>제출해주신 아이디어를 검토하여 First-Penguins의 다음 혁신에 반영하겠습니다.</p>
                    <div class="next-steps">
                        <h5>다음 단계:</h5>
                        <ul>
                            <li>💭 아이디어 검토 및 분석 (1-2주)</li>
                            <li>🔍 기술적 검토 및 개발 가능성 평가</li>
                            <li>📧 결과 및 진행 상황 안내</li>
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="closeModal()">확인</button>
                        <a href="support/contact.html" class="btn btn-outline">더 자세한 제안하기</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 아이디어 제출 함수 (간소화된 피드백 시스템)
// 불편함 신고 함수로 변경
window.submitProblem = async function() {
    const problemInput = document.getElementById('problemInput');
    const problemText = problemInput.value.trim();
    const selectedCategory = document.querySelector('.tag-btn.active')?.dataset.category || 'other';
    
    if (!problemText) {
        showNotification('불편함을 입력해주세요.', 'error');
        return;
    }
    
    if (problemText.length < 10) {
        showNotification('더 자세히 설명해주세요. (최소 10자 이상)', 'error');
        return;
    }
    
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const submittedBy = currentUser.id || currentUser.email || null;
        
        // Supabase에 문제 저장
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            const problemData = {
                content: problemText,
                category: selectedCategory,
                status: 'active',
                submittedBy: submittedBy
            };
            
            await window.SupabaseAPI.submitProblem(problemData);
            
            // 최근 아이디어에도 추가
            await window.SupabaseAPI.addRecentIdea({
                content: problemText,
                category: selectedCategory,
                status: 'reviewing',
                submittedBy: submittedBy
            });
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
            const problemData = {
                title: problemText.substring(0, 50) + (problemText.length > 50 ? '...' : ''),
                description: problemText,
                category: selectedCategory,
                userId: 1
            };
            
            window.db.submitProblem(problemData);
        }
        
        // UI 업데이트
        problemInput.value = '';
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.tag-btn[data-category="other"]')?.classList.add('active');
        
        // 통계 업데이트
        updateProblemStats();
        
        // 최근 아이디어 목록 업데이트
        loadRecentIdeas();
        
        // 성공 알림
        showNotification('💡 아이디어가 성공적으로 제출되었습니다! 검토 후 연락드리겠습니다.', 'success');
        
        // 감사 메시지 표시
        setTimeout(() => {
            showIdeaThankYouModal();
        }, 1500);
    } catch (error) {
        console.error('문제 제출 실패:', error);
        showNotification('제출 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
}

// 문제 점수 계산
function calculateProblemPoints(text, category) {
    let points = 10; // 기본 점수
    
    // 텍스트 길이에 따른 보너스
    if (text.length > 100) points += 5;
    if (text.length > 200) points += 5;
    
    // 카테고리별 보너스
    const categoryBonuses = {
        'daily': 5,
        'work': 8,
        'health': 10,
        'social': 7,
        'tech': 12,
        'other': 3
    };
    
    points += categoryBonuses[category] || 0;
    
    return points;
}

// 사용자 레벨 업데이트
function updateUserLevel(points) {
    const userData = getUserData();
    userData.totalPoints = (userData.totalPoints || 0) + points;
    userData.submissions = (userData.submissions || 0) + 1;
    
    // 레벨 계산
    const newLevel = calculateLevel(userData.totalPoints);
    const oldLevel = userData.level || '문제 발견자';
    
    userData.level = newLevel;
    saveUserData(userData);
    
    // 레벨업 체크
    if (oldLevel !== newLevel) {
        showLevelUpModal(oldLevel, newLevel);
    }
    
    updateSolverLevel();
}

// 레벨 계산
function calculateLevel(points) {
    if (points >= 500) return 'First-Penguins 파트너';
    if (points >= 300) return '혁신 기여자';
    if (points >= 150) return '불편함 전문가';
    if (points >= 50) return '문제 탐정';
    return '문제 발견자';
}

// 레벨별 보상
function getLevelRewards() {
    return {
        '문제 발견자': { next: 50, reward: '감사 인증서' },
        '문제 탐정': { next: 150, reward: 'First-Penguins 굿즈' },
        '불편함 전문가': { next: 300, reward: 'Goal-Illa 프리미엄 기능' },
        '혁신 기여자': { next: 500, reward: '개발팀과의 1:1 미팅' },
        'First-Penguins 파트너': { next: null, reward: '신제품 베타 테스터' }
    };
}

// 문제 해결사 레벨 UI 업데이트
function updateSolverLevel() {
    const userData = getUserData();
    const currentLevel = userData.level || '문제 발견자';
    const totalPoints = userData.totalPoints || 0;
    const rewards = getLevelRewards();
    
    document.getElementById('currentLevel').textContent = currentLevel;
    
    const currentReward = rewards[currentLevel];
    if (currentReward && currentReward.next) {
        const progress = (totalPoints % currentReward.next) / currentReward.next * 100;
        const remaining = currentReward.next - (totalPoints % currentReward.next);
        
        document.getElementById('levelProgress').style.width = progress + '%';
        document.getElementById('nextLevelCount').textContent = remaining;
        document.getElementById('nextReward').textContent = currentReward.reward;
    } else {
        document.getElementById('levelProgress').style.width = '100%';
        document.getElementById('nextLevelCount').textContent = '0';
        document.getElementById('nextReward').textContent = '최고 레벨 달성!';
    }
}

// 문제 해결사 통계 업데이트
function updateSolverStats() {
    const problemData = getProblemData();
    
    // 실제 데이터만 표시
    document.getElementById('submittedProblems').textContent = problemData.submitted.length;
    document.getElementById('solvedProblems').textContent = problemData.solved.length;
    
    // 활성 해결사 수 - 실제 데이터가 없으면 0
    document.getElementById('activeSolvers').textContent = '0';
    
    // 이번 달 챔피언 - 실제 데이터가 없으면 표시 안함
    document.getElementById('monthlyChampion').textContent = '-';
}

// 리더보드 로드
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // 실제 데이터가 없으므로 빈 상태 표시
    leaderboardList.innerHTML = `
        <div class="empty-leaderboard">
            <i class="fas fa-trophy"></i>
            <p>아직 랭킹 데이터가 없습니다.</p>
            <small>문제를 제출하고 첫 번째 해결사가 되어보세요!</small>
        </div>
    `;
}

// 카테고리 버튼 초기화
function initializeCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 문제 제출 성공 알림
function showProblemSubmissionSuccess(points) {
    const userData = getUserData();
    const currentLevel = userData.level || '문제 발견자';
    
    showNotification(`🎉 문제가 성공적으로 발견되었습니다! +${points}점 획득!`, 'success');
    
    // 배지 시스템 연동
    if (window.InnovationSystem) {
        // 첫 번째 문제 발견 시 배지 수여
        if (userData.totalPoints === points) {
            window.InnovationSystem.awardBadge('problem-detective');
        }
        
        // 10개 이상 문제 발견 시 전문가 배지
        const problemData = getProblemData();
        if (problemData.submitted.length >= 10) {
            window.InnovationSystem.awardBadge('problem-expert');
        }
        
        // 500점 이상 시 파트너 배지
        if (userData.totalPoints >= 500) {
            window.InnovationSystem.awardBadge('first-penguin-partner');
        }
    }
    
    // 레벨업 체크
    setTimeout(() => {
        if (userData.level !== currentLevel) {
            showNotification(`🏆 레벨업! ${userData.level}이 되었습니다!`, 'success');
        }
    }, 2000);
}

// 레벨업 모달
function showLevelUpModal(oldLevel, newLevel) {
    const modal = document.createElement('div');
    modal.className = 'level-up-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="level-up-animation">
                <i class="fas fa-trophy"></i>
                <h2>🎉 레벨업!</h2>
                <p>${oldLevel} → ${newLevel}</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">확인</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

// 사용자 데이터 관리
function getUserData() {
    try {
        const userData = localStorage.getItem('solverUserData');
        return userData ? JSON.parse(userData) : { level: '문제 발견자', totalPoints: 0, submissions: 0 };
    } catch (error) {
        return { level: '문제 발견자', totalPoints: 0, submissions: 0 };
    }
}

function saveUserData(userData) {
    try {
        localStorage.setItem('solverUserData', JSON.stringify(userData));
    } catch (error) {
        console.error('사용자 데이터 저장 실패:', error);
    }
}

// 감사 모달 표시
function showThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🙏 감사합니다!</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="thank-you-content">
                    <div class="thank-you-icon">💡</div>
                    <h4>소중한 피드백을 주셔서 감사합니다!</h4>
                    <p>제출해주신 불편함을 검토하여 First-Penguins의 다음 혁신 아이디어로 활용하겠습니다.</p>
                    <div class="next-steps">
                        <h5>다음 단계:</h5>
                        <ul>
                            <li>📋 제출된 불편함 검토 및 분석</li>
                            <li>🔍 해결 방안 연구 및 개발</li>
                            <li>📧 진행 상황 이메일로 안내</li>
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="closeModal()">확인</button>
                        <a href="support/contact.html" class="btn btn-outline">문의하기</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 문제 통계 업데이트 (Goal-Illa 데이터베이스 연동)
async function updateProblemStats() {
    try {
        // Goal-Illa 데이터베이스에서 실제 데이터 가져오기
        const response = await fetch(`${window.CONFIG.api.baseUrl}/api/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const goals = Array.isArray(data) ? data : (data.items || []);
            
            // Goal-Illa 사용자 수 (목표를 설정한 사용자 수)
            const uniqueUsers = new Set(goals.map(goal => goal.user_id)).size;
            
            // 완료된 목표 수 (해결된 문제)
            const completedGoals = goals.filter(goal => 
                goal.quantity >= goal.total_quantity || goal.status === 'completed'
            ).length;
            
            // 제출된 아이디어 수 (총 목표 수)
            const submittedProblemsElement = document.getElementById('submittedProblems');
            if (submittedProblemsElement) {
                submittedProblemsElement.textContent = goals.length;
            }
            
            // 해결된 문제 수
            const solvedProblemsElement = document.getElementById('solvedProblems');
            if (solvedProblemsElement) {
                solvedProblemsElement.textContent = completedGoals;
            }
            
            // About 섹션 통계도 업데이트
            updateAboutStats(goals.length, completedGoals, uniqueUsers);
            
        } else {
            // API 호출 실패 시 로컬 데이터 사용
            const problemData = getProblemData();
            const submittedCount = problemData.submitted.length;
            const solvedCount = problemData.solved.length;
            
            const submittedProblemsElement = document.getElementById('submittedProblems');
            if (submittedProblemsElement) {
                submittedProblemsElement.textContent = submittedCount;
            }
            
            const solvedProblemsElement = document.getElementById('solvedProblems');
            if (solvedProblemsElement) {
                solvedProblemsElement.textContent = solvedCount;
            }
        }
    } catch (error) {
        console.error('Goal-Illa 데이터베이스 연동 실패:', error);
        // 오류 시 로컬 데이터 사용
        const problemData = getProblemData();
        const submittedCount = problemData.submitted.length;
        const solvedCount = problemData.solved.length;
        
        const submittedProblemsElement = document.getElementById('submittedProblems');
        if (submittedProblemsElement) {
            submittedProblemsElement.textContent = submittedCount;
        }
        
        const solvedProblemsElement = document.getElementById('solvedProblems');
        if (solvedProblemsElement) {
            solvedProblemsElement.textContent = solvedCount;
        }
    }
}

// About 섹션 통계 업데이트 (실제 만족도 조사 기반)
async function updateAboutStats(totalGoals, completedGoals, uniqueUsers) {
    // 발견된 불편함 (총 목표 수)
    const discoveredProblemsElement = document.querySelector('.about-stats .stat-number[data-target="0"]');
    if (discoveredProblemsElement) {
        discoveredProblemsElement.textContent = totalGoals;
        discoveredProblemsElement.setAttribute('data-target', totalGoals);
    }
    
    // 해결된 문제 (완료된 목표 수)
    const solvedProblemsElement = document.querySelector('.about-stats .stat-item:nth-child(2) .stat-number');
    if (solvedProblemsElement) {
        solvedProblemsElement.textContent = completedGoals;
        solvedProblemsElement.setAttribute('data-target', completedGoals);
    }
    
    // 사용자 만족도 (실제 만족도 조사 데이터 기반)
    await updateUserSatisfaction();
}

// 실제 사용자 만족도 조사 데이터 업데이트
async function updateUserSatisfaction() {
    try {
        // 만족도 조사 데이터를 데이터베이스에서 가져오기
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.satisfaction}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const satisfactionData = await response.json();
            
            // 만족도 점수 계산 (1-5점 척도)
            const averageSatisfaction = satisfactionData.averageRating || 0;
            const satisfactionPercentage = Math.round((averageSatisfaction / 5) * 100);
            
            const satisfactionElement = document.querySelector('.about-stats .stat-item:nth-child(3) .stat-number');
            if (satisfactionElement) {
                satisfactionElement.textContent = satisfactionPercentage;
                satisfactionElement.setAttribute('data-target', satisfactionPercentage);
            }
        } else {
            // API 호출 실패 시 기본값 표시
            const satisfactionElement = document.querySelector('.about-stats .stat-item:nth-child(3) .stat-number');
            if (satisfactionElement) {
                satisfactionElement.textContent = '0';
                satisfactionElement.setAttribute('data-target', 0);
            }
        }
    } catch (error) {
        console.error('사용자 만족도 조사 데이터 로드 실패:', error);
        // 오류 시 기본값 표시
        const satisfactionElement = document.querySelector('.about-stats .stat-item:nth-child(3) .stat-number');
        if (satisfactionElement) {
            satisfactionElement.textContent = '0';
            satisfactionElement.setAttribute('data-target', 0);
        }
    }
}

// 문제 데이터 가져오기
function getProblemData() {
    const defaultData = {
        submitted: [],
        solved: [] // 실제로는 아직 해결된 문제가 없음
    };
    
    try {
        const stored = localStorage.getItem('problemData');
        return stored ? JSON.parse(stored) : defaultData;
    } catch (error) {
        console.error('문제 데이터 로드 실패:', error);
        return defaultData;
    }
}

// 문제 데이터 저장
function saveProblemData(data) {
    try {
        localStorage.setItem('problemData', JSON.stringify(data));
    } catch (error) {
        console.error('문제 데이터 저장 실패:', error);
    }
}

// 모든 데이터베이스 연동 초기화
async function initializeAllDatabaseConnections() {
    try {
        // 모든 데이터를 병렬로 로드
        await Promise.all([
            loadTeamData(),
            loadBlogData(),
            loadAnnouncementsData(),
            loadFAQData(),
        ]);
        
        console.log('✅ 모든 데이터베이스 연동 완료');
    } catch (error) {
        console.error('❌ 데이터베이스 연동 실패:', error);
    }
}

// 팀 데이터 로드
async function loadTeamData() {
    try {
        // Supabase에서 팀 데이터 로드
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            const teamData = await window.SupabaseAPI.getTeam();
            // Supabase 데이터 형식에 맞게 변환
            const formattedData = teamData.map(member => ({
                id: member.id,
                name: member.name,
                role: member.role,
                description: member.description,
                skills: member.skills || [],
                email: member.email,
                linkedin: member.linkedin,
                github: member.github,
                avatar: member.avatar,
                joinDate: member.join_date,
                featured: member.featured
            }));
            displayTeamData(formattedData);
            return;
        }
        
        // 레거시: 로컬 스토리지 사용
        if (window.db) {
            const teamData = window.db.getTeam();
            displayTeamData(teamData);
            return;
        }
        
        // 레거시: API 호출
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.team}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const teamData = await response.json();
            displayTeamData(teamData);
        } else {
            displayDefaultTeamData();
        }
    } catch (error) {
        console.error('팀 데이터 로드 실패:', error);
        displayDefaultTeamData();
    }
}

// 팀 데이터 표시
function displayTeamData(teamData) {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    
    let teamHtml = '';
    teamData.forEach((member, index) => {
        const isFeatured = index === 0; // 첫 번째 멤버를 featured로 설정
        teamHtml += `
            <div class="team-member ${isFeatured ? 'featured' : ''}">
                <div class="member-photo">
                    <div class="photo-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="member-overlay">
                        <div class="social-links">
                            ${member.linkedin ? `<a href="${member.linkedin}" class="social-link"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${member.github ? `<a href="${member.github}" class="social-link"><i class="fab fa-github"></i></a>` : ''}
                            ${member.email ? `<a href="mailto:${member.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <p class="member-description">${member.description}</p>
                    <div class="member-skills">
                        ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    teamGrid.innerHTML = teamHtml;
}

// 기본 팀 데이터 표시 (Supabase 실패 시)
function displayDefaultTeamData() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    
    // 레거시: 로컬 스토리지에서 팀 정보 가져오기
    if (window.db) {
        const teamData = window.db.getTeam();
        displayTeamData(teamData);
    } else {
        // 데이터베이스가 없는 경우 로딩 표시
        teamGrid.innerHTML = `
            <div class="loading-teams">
                <i class="fas fa-exclamation-triangle"></i>
                <p>팀 정보를 불러올 수 없습니다.</p>
            </div>
        `;
    }
}

// 블로그 데이터 로드 (Supabase 기반)
async function loadBlogData() {
    try {
        // Supabase에서 블로그 데이터 로드
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            const blogData = await window.SupabaseAPI.getBlogPosts({ limit: 6 });
            // Supabase 데이터 형식에 맞게 변환
            const formattedData = blogData.map(post => ({
                id: post.id,
                title: post.title,
                summary: post.summary,
                content: post.content,
                author: post.author,
                publishedAt: post.published_at,
                category: post.category,
                tags: post.tags || [],
                readTime: post.read_time,
                featured: post.featured
            }));
            displayBlogData(formattedData);
            return;
        }
        
        // 레거시: 로컬 스토리지 사용
        if (window.db && window.db.data.blogPosts) {
            const blogData = window.db.data.blogPosts;
            displayBlogData(blogData);
            return;
        }
        
        // 레거시: API 호출
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.blog}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const blogData = await response.json();
            displayBlogData(blogData);
        } else {
            displayDefaultBlogData();
        }
    } catch (error) {
        console.error('블로그 데이터 로드 실패:', error);
        displayDefaultBlogData();
    }
}

// 블로그 데이터 표시
function displayBlogData(blogData) {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    let blogHtml = '';
    blogData.forEach((post, index) => {
        const isFeatured = index === 0; // 첫 번째 포스트를 featured로 설정
        blogHtml += `
            <div class="blog-card ${isFeatured ? 'featured' : ''}">
                <div class="blog-image">
                    <div class="blog-placeholder">
                        <i class="${post.icon || 'fas fa-newspaper'}"></i>
                    </div>
                    ${isFeatured ? '<div class="blog-badge">Featured</div>' : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-category">${post.category}</span>
                        <span class="blog-date">${post.date}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-footer">
                        <div class="blog-author">
                            <i class="fas fa-user"></i>
                            <span>${post.author}</span>
                        </div>
                        <a href="${post.url || '#'}" class="read-more">자세히 보기 <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    });
    
    blogGrid.innerHTML = blogHtml;
}

// 기본 블로그 데이터 표시 (API 실패 시)
function displayDefaultBlogData() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    const defaultBlog = [
        {
            title: 'Goal-Illa 개발 시작',
            category: '기술',
            date: new Date().toLocaleDateString('ko-KR'),
            excerpt: 'Goal-Illa 앱 개발을 시작했습니다. 계획 세우기의 어려움을 해결하는 혁신적인 솔루션을 만들어가겠습니다.',
            author: '개발팀',
            icon: 'fas fa-rocket'
        }
    ];
    
    displayBlogData(defaultBlog);
}

// 공지사항 데이터 로드
async function loadAnnouncementsData() {
    try {
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.announcements}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const announcementsData = await response.json();
            // 공지사항 데이터를 localStorage에 저장하여 다른 페이지에서 사용
            localStorage.setItem('announcementsData', JSON.stringify(announcementsData));
        }
    } catch (error) {
        console.error('공지사항 데이터 로드 실패:', error);
    }
}

// FAQ 데이터 로드
async function loadFAQData() {
    try {
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.faqs}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const faqData = await response.json();
            // FAQ 데이터를 localStorage에 저장하여 다른 페이지에서 사용
            localStorage.setItem('faqData', JSON.stringify(faqData));
        }
    } catch (error) {
        console.error('FAQ 데이터 로드 실패:', error);
    }
}


// 문의 폼 데이터 저장
async function saveInquiryData(inquiryData) {
    try {
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.inquiries}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(inquiryData)
        });
        
        if (response.ok) {
            console.log('문의 데이터 저장 성공');
            return true;
        } else {
            console.error('문의 데이터 저장 실패');
            return false;
        }
    } catch (error) {
        console.error('문의 데이터 저장 오류:', error);
        return false;
    }
}

// 뉴스레터 구독 데이터 저장
async function saveNewsletterData(email) {
    try {
        const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.newsletter}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ email: email })
        });
        
        if (response.ok) {
            console.log('뉴스레터 구독 데이터 저장 성공');
            return true;
        } else {
            console.error('뉴스레터 구독 데이터 저장 실패');
            return false;
        }
    } catch (error) {
        console.error('뉴스레터 구독 데이터 저장 오류:', error);
        return false;
    }
}

// 브라우저 알림 권한 요청
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('알림 권한이 허용되었습니다.');
                showWelcomeNotification();
            }
        });
    }
}

// 환영 알림 표시
function showWelcomeNotification() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('🐧 First-Penguins에 오신 것을 환영합니다!', {
            body: '목표 달성을 위한 여정을 시작해보세요!',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐧</text></svg>',
            tag: 'welcome'
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }
}

// 실시간 업데이트 체크
function startRealTimeUpdates() {
    // 5분마다 업데이트 체크
    setInterval(() => {
        checkForUpdates();
    }, 5 * 60 * 1000);
}

// 업데이트 체크 함수
function checkForUpdates() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    // 실제로는 API에서 최신 데이터를 가져와서 비교
    // 여기서는 예시로 간단한 알림만 표시
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const now = new Date().getTime();
    
    if (!lastCheck || (now - parseInt(lastCheck)) > 10 * 60 * 1000) { // 10분마다
        localStorage.setItem('lastUpdateCheck', now.toString());
        
        // 목표 달성 알림 (예시)
        if (Math.random() > 0.8) { // 20% 확률로 알림
            showGoalNotification();
        }
    }
}

// 목표 달성 알림
function showGoalNotification() {
    if (Notification.permission === 'granted') {
        const notifications = [
            '🎯 새로운 목표를 설정해보세요!',
            '📈 오늘의 목표 달성률을 확인해보세요!',
            '🏆 목표 달성을 위한 동기부여가 필요하신가요?',
            '📊 이번 주 통계를 확인해보세요!'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        
        const notification = new Notification('Goal-Illa 알림', {
            body: randomNotification,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
            tag: 'goal-reminder'
        });
        
        notification.onclick = function() {
            window.focus();
            // 대시보드로 이동
            if (window.location.pathname.includes('dashboard')) {
                window.location.reload();
            } else {
                window.location.href = 'dashboard/goal-illa.html';
            }
            notification.close();
        };
    }
}

// 로그인 상태 관리 함수들
function checkAuthStatus() {
    updateAuthNavigation();
    updateMainPageAuthButtons();
}

function updateMainPageAuthButtons() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        // 메인 페이지의 "지금 시작하기" 버튼을 "대시보드"로 변경
        const startButton = document.querySelector('.btn-primary');
        if (startButton && startButton.textContent.includes('지금 시작하기')) {
            startButton.innerHTML = '<i class="fas fa-tachometer-alt"></i> 대시보드';
            startButton.href = 'dashboard/goal-illa.html';
        }
        
        // 메인 페이지의 "로그인" 버튼을 "프로필"로 변경
        const loginButton = document.querySelector('.btn-secondary');
        if (loginButton && loginButton.textContent.includes('로그인')) {
            loginButton.innerHTML = `<i class="fas fa-user"></i> ${user.name}님`;
            loginButton.href = '#';
            loginButton.onclick = showUserMenu;
        }
        
        // Goal-Illa 대시보드 링크 표시
        const goalIllaDashboardLink = document.getElementById('goalIllaDashboardLink');
        if (goalIllaDashboardLink) {
            goalIllaDashboardLink.style.display = 'inline-block';
        }
    } else {
        // 로그인하지 않은 상태로 복원
        const startButton = document.querySelector('.btn-primary');
        if (startButton) {
            startButton.innerHTML = '<i class="fas fa-user-plus"></i> 지금 시작하기';
            startButton.href = 'auth/register.html';
            startButton.onclick = null;
        }
        
        const loginButton = document.querySelector('.btn-secondary');
        if (loginButton) {
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
            loginButton.href = 'auth/login.html';
            loginButton.onclick = null;
        }
        
        const goalIllaDashboardLink = document.getElementById('goalIllaDashboardLink');
        if (goalIllaDashboardLink) {
            goalIllaDashboardLink.style.display = 'none';
        }
        
        // 사용자 메뉴 제거
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.remove();
        }
    }
}

function updateAuthNavigation() {
    const currentUser = localStorage.getItem('currentUser');
    const authLink = document.getElementById('authLink');
    const authNavItem = document.getElementById('authNavItem');
    const adminNavItem = document.getElementById('adminNavItem');
    const searchNavItem = document.getElementById('searchNavItem');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        authLink.textContent = `${user.name}님`;
        authLink.href = '#';
        authLink.onclick = showUserMenu;
        
        // 관리자 권한 확인
        if (user.role === 'admin' && adminNavItem) {
            adminNavItem.style.display = 'block';
        } else if (adminNavItem) {
            adminNavItem.style.display = 'none';
        }
        
        // 검색 기능 표시
        if (searchNavItem) {
            searchNavItem.style.display = 'block';
        }
        
        // 사용자 메뉴 추가
        if (!document.getElementById('userMenu')) {
            createUserMenu();
        }
        
        // 앱 대시보드 링크 추가
        updateUserMenuAppLinks();
    } else {
        authLink.textContent = '로그인';
        authLink.href = 'auth/login.html';
        authLink.onclick = null;
        
        // 관리자 링크 숨기기
        if (adminNavItem) {
            adminNavItem.style.display = 'none';
        }
        
        // 검색 기능 숨기기
        if (searchNavItem) {
            searchNavItem.style.display = 'none';
        }
        
        // 사용자 메뉴 제거
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.remove();
        }
        
        // 앱 대시보드 링크 숨기기
        if (typeof updateAppDashboardLinks === 'function') {
            updateAppDashboardLinks();
        }
    }
}

function createUserMenu() {
    const userMenu = document.createElement('div');
    userMenu.id = 'userMenu';
    userMenu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        padding: 10px 0;
        min-width: 200px;
        display: none;
        z-index: 1000;
    `;
    
    userMenu.innerHTML = `
        <a href="#" class="user-menu-item" onclick="showProfile()">
            <i class="fas fa-user"></i> 프로필
        </a>
        <a href="#" class="user-menu-item" onclick="showSettings()">
            <i class="fas fa-cog"></i> 설정
        </a>
        <div id="appDashboardLinks" class="app-dashboard-links">
            <!-- 앱 대시보드 링크들이 여기에 동적으로 추가됩니다 -->
        </div>
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">
        <a href="#" class="user-menu-item" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> 로그아웃
        </a>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .user-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            color: #2c3e50;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        .user-menu-item:hover {
            background-color: #f8f9fa;
        }
        .user-menu-item i {
            width: 16px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
    
    const authNavItem = document.getElementById('authNavItem');
    authNavItem.style.position = 'relative';
    authNavItem.appendChild(userMenu);
}

function showUserMenu(e) {
    e.preventDefault();
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    }
}

function showProfile() {
    window.location.href = 'auth/profile.html';
    document.getElementById('userMenu').style.display = 'none';
}

function showSettings() {
    alert('설정 페이지는 준비 중입니다.');
    document.getElementById('userMenu').style.display = 'none';
}

function logout() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        // 모든 인증 관련 데이터 제거
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        checkAuthStatus(); // 메인 페이지 버튼들도 업데이트
        showNotification('로그아웃되었습니다.', 'success');
        
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
            window.location.href = 'auth/login.html';
        }, 1000);
    }
    document.getElementById('userMenu').style.display = 'none';
}

// 사용자 메뉴 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('userMenu');
    const authNavItem = document.getElementById('authNavItem');
    
    if (userMenu && authNavItem && !authNavItem.contains(e.target)) {
        userMenu.style.display = 'none';
    }
});

// 다크 모드 토글 기능
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // 초기 테마 설정
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // 부드러운 전환 효과
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// 실시간 통계 카운터 애니메이션
function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target], .proof-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2초
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // 소수점 처리
        if (target % 1 !== 0) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// 파티클 배경 효과
function createParticleBackground() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 랜덤 크기 (2-6px)
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 랜덤 위치
        particle.style.left = Math.random() * 100 + '%';
        
        // 랜덤 애니메이션 지속시간 (10-30초)
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    // 파티클 생성 간격 (1-3초)
    function spawnParticle() {
        createParticle();
        setTimeout(spawnParticle, Math.random() * 2000 + 1000);
    }
    
    spawnParticle();
}

// 타이핑 애니메이션
function initializeTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('typing-animation');
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                element.classList.remove('typing-animation');
            }
        };
        
        // 요소가 화면에 보일 때 시작
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    typingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        typingObserver.observe(element);
    });
}

// 스크롤 진행률 표시
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2980b9);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 마우스 커서 효과
function initializeMouseEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(52, 152, 219, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // 호버 효과
    const hoverElements = document.querySelectorAll('a, button, .app-card, .support-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(52, 152, 219, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(52, 152, 219, 0.5)';
        });
    });
}

// 사용자 메뉴에 앱 대시보드 링크 추가
function updateUserMenuAppLinks() {
    const appDashboardLinks = document.getElementById('appDashboardLinks');
    if (!appDashboardLinks) return;
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        appDashboardLinks.innerHTML = '';
        return;
    }
    
    const user = JSON.parse(currentUser);
    let linksHtml = '';
    
    // 앱 관리 시스템이 있으면 사용
    if (typeof getUserAccessibleApps === 'function') {
        const accessibleApps = getUserAccessibleApps(user);
        accessibleApps.forEach(app => {
            if (app.status === 'active' && app.hasWebDashboard) {
                linksHtml += `
                    <a href="${app.dashboardUrl}" class="user-menu-item app-dashboard-item">
                        <i class="fas fa-tachometer-alt"></i> ${app.name} 대시보드
                    </a>
                `;
            }
        });
    } else {
        // 기존 방식 (Goal-Illa만)
        linksHtml = `
            <a href="dashboard/goal-illa.html" class="user-menu-item app-dashboard-item">
                <i class="fas fa-tachometer-alt"></i> Goal-Illa 대시보드
            </a>
        `;
    }
    
    appDashboardLinks.innerHTML = linksHtml;
}

// 전역 검색 기능
function performGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showNotification('검색어를 입력해주세요.', 'info');
        return;
    }
    
    // 검색 결과 모달 표시
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>🔍 "${searchTerm}" 검색 결과</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="search-results" id="searchResults">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>검색 중...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 통합 검색 수행
    performIntegratedSearch(searchTerm);
}

// 통합 검색 함수 (목표, 페이지, 앱 등 모든 콘텐츠 검색)
async function performIntegratedSearch(searchTerm) {
    const searchResults = {
        goals: [],
        pages: [],
        apps: [],
        announcements: []
    };
    
    try {
        // 1. Goal-Illa 목표 검색 (로그인한 사용자만)
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const response = await fetch(`${window.CONFIG.api.baseUrl}/api/items`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const goals = Array.isArray(data) ? data : (data.items || []);
                    
                    searchResults.goals = goals.filter(goal => {
                        const title = goal.title || goal.name || '';
                        const category = goal.category_name || goal.category || '';
                        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               category.toLowerCase().includes(searchTerm.toLowerCase());
                    });
                }
            } catch (error) {
                console.log('Goal-Illa 검색 실패:', error);
            }
        }
        
        // 2. 웹사이트 페이지 검색
        searchResults.pages = searchWebsitePages(searchTerm);
        
        // 3. 앱 검색
        searchResults.apps = searchApps(searchTerm);
        
        // 4. 공지사항 검색
        searchResults.announcements = searchAnnouncements(searchTerm);
        
        // 결과 표시
        displayIntegratedSearchResults(searchResults, searchTerm);
        
    } catch (error) {
        console.error('검색 오류:', error);
        displayIntegratedSearchResults({}, searchTerm, '검색 중 오류가 발생했습니다.');
    }
}

// 웹사이트 페이지 검색
function searchWebsitePages(searchTerm) {
    const pages = [
        { title: 'First-Penguins 홈', url: 'index.html', description: '새로운 영역을 개척하는 혁신 기업' },
        { title: 'Goal-Illa 앱', url: 'apps/goal-illa.html', description: '목표 설정과 달성을 도와주는 혁신적인 앱' },
        { title: 'Goal-Illa 대시보드', url: 'dashboard/goal-illa.html', description: '목표 관리 대시보드' },
        { title: '문의하기', url: 'support/contact.html', description: 'First-Penguins에 문의하기' },
        { title: 'FAQ', url: 'support/faq.html', description: '자주 묻는 질문' },
        { title: '공지사항', url: 'support/announcements.html', description: '최신 소식과 업데이트' },
        { title: '개인정보처리방침', url: 'support/privacy-policy.html', description: '개인정보 보호 정책' },
        { title: '이용약관', url: 'support/terms-of-service.html', description: '서비스 이용 약관' }
    ];
    
    return pages.filter(page => 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// 앱 검색
function searchApps(searchTerm) {
    const apps = [
        { name: 'Goal-Illa', description: '목표 설정과 달성을 도와주는 혁신적인 앱', status: 'active' },
        { name: 'TaskMaster', description: '업무 관리와 협업을 위한 통합 플랫폼', status: 'coming-soon' },
        { name: 'HealthTracker', description: '건강 관리와 운동 추적을 위한 앱', status: 'coming-soon' }
    ];
    
    return apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// 공지사항 검색
function searchAnnouncements(searchTerm) {
    const announcements = [
        { title: 'Goal-Illa 모바일 앱 정식 출시 안내', date: '2024.01.15', category: 'important' },
        { title: 'Goal-Illa 웹 대시보드 기능 개선', date: '2024.01.10', category: 'update' },
        { title: 'First-Penguins 웹사이트 리뉴얼 완료', date: '2024.01.01', category: 'new' },
        { title: '2024년 First-Penguins 로드맵 공개', date: '2023.12.25', category: 'update' }
    ];
    
    return announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// 통합 검색 결과 표시
function displayIntegratedSearchResults(searchResults, searchTerm, errorMessage = null) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (errorMessage) {
        resultsContainer.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${errorMessage}</p>
            </div>
        `;
        return;
    }
    
    const totalResults = searchResults.goals.length + searchResults.pages.length + 
                        searchResults.apps.length + searchResults.announcements.length;
    
    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>"${searchTerm}"에 대한 검색 결과가 없습니다.</h4>
                <p>다른 검색어를 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    let resultsHtml = `
        <div class="search-summary">
            <p><strong>${totalResults}</strong>개의 결과를 찾았습니다.</p>
        </div>
        <div class="search-sections">
    `;
    
    // 목표 검색 결과
    if (searchResults.goals.length > 0) {
        resultsHtml += `
            <div class="search-section">
                <h4><i class="fas fa-bullseye"></i> 목표 (${searchResults.goals.length})</h4>
                <div class="search-items">
        `;
        
        searchResults.goals.forEach(goal => {
            const title = goal.title || goal.name || '목표';
            const category = goal.category_name || goal.category || '기본';
            const targetAmount = goal.total_quantity || goal.target_amount || 100;
            const currentAmount = goal.quantity || goal.current_amount || 0;
            const progressPercent = targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;
            
            resultsHtml += `
                <div class="search-item goal-item">
                    <div class="item-icon">🎯</div>
                    <div class="item-content">
                        <h5>${title}</h5>
                        <p>${category} • ${currentAmount}/${targetAmount} ${goal.unit || ''}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                    <div class="item-action">
                        <a href="dashboard/goal-illa.html" class="btn btn-small btn-primary">보기</a>
                    </div>
                </div>
            `;
        });
        
        resultsHtml += '</div></div>';
    }
    
    // 페이지 검색 결과
    if (searchResults.pages.length > 0) {
        resultsHtml += `
            <div class="search-section">
                <h4><i class="fas fa-file-alt"></i> 페이지 (${searchResults.pages.length})</h4>
                <div class="search-items">
        `;
        
        searchResults.pages.forEach(page => {
            resultsHtml += `
                <div class="search-item page-item">
                    <div class="item-icon">📄</div>
                    <div class="item-content">
                        <h5>${page.title}</h5>
                        <p>${page.description}</p>
                    </div>
                    <div class="item-action">
                        <a href="${page.url}" class="btn btn-small btn-primary">이동</a>
                    </div>
                </div>
            `;
        });
        
        resultsHtml += '</div></div>';
    }
    
    // 앱 검색 결과
    if (searchResults.apps.length > 0) {
        resultsHtml += `
            <div class="search-section">
                <h4><i class="fas fa-mobile-alt"></i> 앱 (${searchResults.apps.length})</h4>
                <div class="search-items">
        `;
        
        searchResults.apps.forEach(app => {
            const statusBadge = app.status === 'active' ? 
                '<span class="status-badge active">사용 가능</span>' : 
                '<span class="status-badge coming-soon">준비 중</span>';
            
            resultsHtml += `
                <div class="search-item app-item">
                    <div class="item-icon">${app.name === 'Goal-Illa' ? '🎯' : '📱'}</div>
                    <div class="item-content">
                        <h5>${app.name} ${statusBadge}</h5>
                        <p>${app.description}</p>
                    </div>
                    <div class="item-action">
                        ${app.status === 'active' ? 
                            `<a href="apps/goal-illa.html" class="btn btn-small btn-primary">보기</a>` :
                            `<span class="btn btn-small btn-disabled">준비 중</span>`
                        }
                    </div>
                </div>
            `;
        });
        
        resultsHtml += '</div></div>';
    }
    
    // 공지사항 검색 결과
    if (searchResults.announcements.length > 0) {
        resultsHtml += `
            <div class="search-section">
                <h4><i class="fas fa-bullhorn"></i> 공지사항 (${searchResults.announcements.length})</h4>
                <div class="search-items">
        `;
        
        searchResults.announcements.forEach(announcement => {
            const categoryIcon = {
                'important': '🔴',
                'update': '🟢',
                'new': '🔵'
            }[announcement.category] || '📢';
            
            resultsHtml += `
                <div class="search-item announcement-item">
                    <div class="item-icon">${categoryIcon}</div>
                    <div class="item-content">
                        <h5>${announcement.title}</h5>
                        <p>${announcement.date}</p>
                    </div>
                    <div class="item-action">
                        <a href="support/announcements.html" class="btn btn-small btn-primary">보기</a>
                    </div>
                </div>
            `;
        });
        
        resultsHtml += '</div></div>';
    }
    
    resultsHtml += '</div>';
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .search-sections {
            max-height: 500px;
            overflow-y: auto;
        }
        .search-section {
            margin-bottom: 2rem;
        }
        .search-section h4 {
            color: #2c3e50;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e9ecef;
        }
        .search-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .search-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
        }
        .search-item:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        .item-icon {
            font-size: 1.5rem;
            width: 40px;
            text-align: center;
        }
        .item-content {
            flex: 1;
        }
        .item-content h5 {
            margin: 0 0 0.25rem 0;
            color: #2c3e50;
        }
        .item-content p {
            margin: 0;
            color: #6c757d;
            font-size: 0.9rem;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            transition: width 0.3s ease;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }
        .status-badge.active {
            background: #27ae60;
            color: white;
        }
        .status-badge.coming-soon {
            background: #f39c12;
            color: white;
        }
        .btn-disabled {
            background: #6c757d;
            color: white;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    resultsContainer.innerHTML = resultsHtml;
}

// 모달 닫기 함수 (전역)
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// 앱 대시보드 링크 관리 (기존 방식)
function updateAppDashboardLinks() {
    const currentUser = localStorage.getItem('currentUser');
    const goalIllaDashboardLink = document.getElementById('goalIllaDashboardLink');
    
    if (currentUser && goalIllaDashboardLink) {
        goalIllaDashboardLink.style.display = 'inline-block';
    } else if (goalIllaDashboardLink) {
        goalIllaDashboardLink.style.display = 'none';
    }
}

// PWA Service Worker 등록
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // 업데이트 확인
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // 새 버전 사용 가능 알림
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// 업데이트 알림 표시
function showUpdateNotification() {
    if (confirm('새로운 버전이 사용 가능합니다. 지금 업데이트하시겠습니까?')) {
        window.location.reload();
    }
}

// PWA 설치 프롬프트
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 설치 버튼 표시
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.innerHTML = '📱 앱으로 설치하기';
    installButton.className = 'install-button';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('PWA 설치됨');
                }
                deferredPrompt = null;
                installButton.remove();
            });
        }
    });
    
    document.body.appendChild(installButton);
}

// 뉴스레터 구독 기능 초기화
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value.trim();
        const agree = document.getElementById('newsletterAgree').checked;
        
        if (!email) {
            showNotification('이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        if (!agree) {
            showNotification('개인정보처리방침에 동의해주세요.', 'error');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // 중복 구독 확인
        const existingSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (existingSubscribers.includes(email)) {
            showNotification('이미 구독된 이메일 주소입니다.', 'info');
            return;
        }
        
        // 구독 처리
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 구독 중...';
        submitBtn.disabled = true;
        
        try {
            // Supabase에 뉴스레터 구독 저장
            if (window.CompanyWebsiteAPI && window.CONFIG?.supabase?.enabled !== false) {
                await window.CompanyWebsiteAPI.subscribeNewsletter(email);
                showNotification('뉴스레터 구독이 완료되었습니다! 🎉', 'success');
                
                // 통계 새로고침
                if (window.dynamicStats) {
                    window.dynamicStats.refreshStats();
                }
            } else if (window.db) {
                // 레거시: 로컬 스토리지 사용
                const result = window.db.addNewsletterSubscriber(email);
                
                if (result && result.email === email) {
                    showNotification('뉴스레터 구독이 완료되었습니다! 🎉', 'success');
                    
                    // 통계 새로고침
                    if (window.dynamicStats) {
                        window.dynamicStats.refreshStats();
                    }
                } else {
                    throw new Error('구독 처리에 실패했습니다.');
                }
            } else {
                // 레거시: API 호출
                const saved = await saveNewsletterData(email);
                
                if (saved) {
                    showNotification('뉴스레터 구독이 완료되었습니다! 🎉', 'success');
                } else {
                    // 로컬에만 저장
                    existingSubscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(existingSubscribers));
                    showNotification('뉴스레터 구독이 완료되었습니다! 🎉 (로컬 저장)', 'success');
                }
            }
            
            // 구독 통계 업데이트
            updateNewsletterStats();
            
            // 폼 초기화
            newsletterForm.reset();
            
            // 환영 이메일 시뮬레이션
            setTimeout(() => {
                showWelcomeEmailNotification(email);
            }, 2000);
            
        } catch (error) {
            showNotification('구독 처리 중 오류가 발생했습니다.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // 구독 통계 초기화
    updateNewsletterStats();
}

// 뉴스레터 구독 통계 업데이트 (Supabase 연동)
async function updateNewsletterStats() {
    try {
        let subscriberCount = 0;
        let satisfactionPercentage = 0;
        
        // Supabase에서 뉴스레터 통계 조회
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false && window.supabase) {
            const { data: subscribers, error } = await window.supabase
                .from('newsletter_subscribers')
                .select('*')
                .is('unsubscribed_at', null);
            
            if (!error && subscribers) {
                subscriberCount = subscribers.length;
                
                // 만족도 계산
                const satisfiedSubscribers = subscribers.filter(s => s.satisfied === true).length;
                const totalResponses = subscribers.filter(s => s.satisfied !== undefined).length;
                if (totalResponses > 0) {
                    satisfactionPercentage = Math.round((satisfiedSubscribers / totalResponses) * 100);
                }
            }
        } else {
            // 레거시: API 호출
            const response = await fetch(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.newsletterStats}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (response.ok) {
                const statsData = await response.json();
                subscriberCount = statsData.subscriberCount || 0;
                
                if (statsData.satisfactionSurvey && statsData.satisfactionSurvey.averageRating) {
                    satisfactionPercentage = Math.round((statsData.satisfactionSurvey.averageRating / 5) * 100);
                }
            } else {
                // API 호출 실패 시 로컬 데이터만 사용
                const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                subscriberCount = subscribers.length;
            }
        }
        
        // 구독자 수 업데이트
        const subscriberStat = document.querySelector('.newsletter-stats .stat-number[data-target="0"]');
        if (subscriberStat) {
            subscriberStat.textContent = subscriberCount;
            subscriberStat.setAttribute('data-target', subscriberCount);
        }
        
        // 만족도 업데이트
        const satisfactionStat = document.querySelector('.newsletter-stats .stat-item:nth-child(2) .stat-number');
        if (satisfactionStat) {
            if (satisfactionPercentage > 0) {
                satisfactionStat.textContent = satisfactionPercentage;
                satisfactionStat.setAttribute('data-target', satisfactionPercentage);
            } else {
                // 조사 데이터가 없는 경우
                satisfactionStat.textContent = '조사 중';
                satisfactionStat.setAttribute('data-target', 0);
            }
        }
    } catch (error) {
        console.error('뉴스레터 통계 업데이트 실패:', error);
        // 오류 시 로컬 데이터만 사용
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        const subscriberCount = subscribers.length;
        
        const subscriberStat = document.querySelector('.newsletter-stats .stat-number[data-target="0"]');
        if (subscriberStat) {
            subscriberStat.textContent = subscriberCount;
        }
        
        const satisfactionStat = document.querySelector('.newsletter-stats .stat-item:nth-child(2) .stat-number');
        if (satisfactionStat) {
            satisfactionStat.textContent = subscriberCount > 0 ? '측정 중' : '0';
        }
    }
}

// 환영 이메일 알림
function showWelcomeEmailNotification(email) {
    if (Notification.permission === 'granted') {
        const notification = new Notification('📧 First-Penguins 뉴스레터 환영!', {
            body: `${email}로 환영 이메일을 발송했습니다.`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐧</text></svg>',
            tag: 'newsletter-welcome'
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }
    
    // 웹 알림도 표시
    showNotification('환영 이메일이 발송되었습니다! 📧', 'success');
}

// ===== 실제 데이터베이스 기반 새로운 함수들 =====

// 실제 데이터베이스 기반 통계 업데이트 함수들
async function updateProblemStats() {
    try {
        let problems = [];
        let stats = { totalProblems: 0, solvedProblems: 0 };
        
        // Supabase에서 문제 데이터 조회
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            const result = await window.SupabaseAPI.getProblems();
            problems = result.problems || [];
            stats.totalProblems = problems.length;
            stats.solvedProblems = problems.filter(p => p.status === 'solved').length;
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
            stats = window.db.getStats();
            problems = window.db.getProblems();
        }
        
        // 통계 업데이트
        updateCounterDisplay('totalProblems', stats.totalProblems);
        updateCounterDisplay('solvedProblems', stats.solvedProblems);
        
        const solutionRate = stats.totalProblems > 0 ? Math.round((stats.solvedProblems / stats.totalProblems) * 100) : 0;
        updateCounterDisplay('solutionRate', solutionRate);
    } catch (error) {
        console.error('문제 통계 업데이트 실패:', error);
    }
}

async function updateCommunityStats() {
    try {
        let stats = { communityGoals: 0, totalUsers: 0 };
        
        // Supabase에서 통계 데이터 조회
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
            // 커뮤니티 피드와 아이디어 수 조회
            const feedData = await window.SupabaseAPI.getCommunityFeed(100);
            const ideasData = await window.SupabaseAPI.getRecentIdeas(100);
            
            stats.communityGoals = feedData.length;
            stats.totalUsers = new Set(feedData.map(f => f.user_id).filter(Boolean)).size;
            
            // 커뮤니티 통계 업데이트
            updateCounterDisplay('totalIdeas', ideasData.length);
            updateCounterDisplay('implementedIdeas', ideasData.filter(i => i.status === 'implemented').length);
            updateCounterDisplay('activeUsers', stats.totalUsers);
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
            stats = window.db.getStats();
            
            // 커뮤니티 통계 업데이트
            updateCounterDisplay('totalIdeas', stats.communityGoals);
            updateCounterDisplay('implementedIdeas', Math.floor(stats.communityGoals * 0.15));
            updateCounterDisplay('activeUsers', stats.totalUsers);
        }
        
        // 피드 통계 업데이트
        document.querySelectorAll('[data-target]').forEach(element => {
            const target = element.dataset.target;
            if (stats[target]) {
                updateCounterDisplay(element.id, stats[target]);
            }
        });
    } catch (error) {
        console.error('커뮤니티 통계 업데이트 실패:', error);
    }
}

async function updateInvestmentStats() {
    try {
        // 투자/협업 통계는 현재 Supabase에 테이블이 없으므로 레거시 사용
        if (window.db) {
            const collaborations = window.db.getCollaborations();
            updateCounterDisplay('activeCollabs', collaborations.length);
            updateCounterDisplay('successRate', 85); // 임시 성공률
        }
    } catch (error) {
        console.error('투자 통계 업데이트 실패:', error);
    }
}

function updateCounterDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value.toLocaleString();
    }
}

// 투자 & 협업 모달 함수들
window.openInvestmentModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content investment-modal">
            <div class="modal-header">
                <h3>💼 투자 관심 등록</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitInvestmentInterest(event)">
                    <div class="form-group">
                        <label>회사명 *</label>
                        <input type="text" name="company" required>
                    </div>
                    <div class="form-group">
                        <label>투자 규모 *</label>
                        <select name="amount" required>
                            <option value="">선택해주세요</option>
                            <option value="50000000">5천만원 이하</option>
                            <option value="100000000">1억원</option>
                            <option value="500000000">5억원</option>
                            <option value="1000000000">10억원 이상</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>투자 단계 *</label>
                        <select name="stage" required>
                            <option value="">선택해주세요</option>
                            <option value="seed">시드</option>
                            <option value="series-a">시리즈 A</option>
                            <option value="series-b">시리즈 B</option>
                            <option value="growth">성장 투자</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="email" name="contact" placeholder="이메일 주소" required>
                    </div>
                    <div class="form-group">
                        <label>메시지</label>
                        <textarea name="message" rows="3" placeholder="추가 메시지가 있다면 입력해주세요"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">투자 관심 등록</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.openCollaborationModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content collaboration-modal">
            <div class="modal-header">
                <h3>🤝 협업 제안하기</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitCollaboration(event)">
                    <div class="form-group">
                        <label>이름/회사명 *</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>전문 분야 *</label>
                        <select name="expertise" required>
                            <option value="">선택해주세요</option>
                            <option value="development">개발</option>
                            <option value="design">디자인</option>
                            <option value="marketing">마케팅</option>
                            <option value="business">비즈니스</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>관심 있는 문제 영역</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="areas" value="productivity"> 생산성</label>
                            <label><input type="checkbox" name="areas" value="communication"> 소통</label>
                            <label><input type="checkbox" name="areas" value="lifestyle"> 라이프스타일</label>
                            <label><input type="checkbox" name="areas" value="education"> 교육</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="email" name="contact" placeholder="이메일 주소" required>
                    </div>
                    <div class="form-group">
                        <label>협업 제안서</label>
                        <textarea name="proposal" rows="4" placeholder="어떤 방식으로 협업하고 싶은지 설명해주세요"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-secondary">협업 제안하기</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.openPartnershipModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content partnership-modal">
            <div class="modal-header">
                <h3>🏢 파트너십 문의</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitPartnership(event)">
                    <div class="form-group">
                        <label>회사명 *</label>
                        <input type="text" name="company" required>
                    </div>
                    <div class="form-group">
                        <label>회사 규모 *</label>
                        <select name="size" required>
                            <option value="">선택해주세요</option>
                            <option value="startup">스타트업 (1-50명)</option>
                            <option value="medium">중견기업 (51-300명)</option>
                            <option value="large">대기업 (300명+)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>파트너십 유형 *</label>
                        <select name="type" required>
                            <option value="">선택해주세요</option>
                            <option value="technology">기술 파트너십</option>
                            <option value="business">사업 파트너십</option>
                            <option value="strategic">전략적 제휴</option>
                            <option value="distribution">유통 파트너십</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>담당자 연락처 *</label>
                        <input type="email" name="contact" placeholder="이메일 주소" required>
                    </div>
                    <div class="form-group">
                        <label>파트너십 제안서</label>
                        <textarea name="proposal" rows="4" placeholder="어떤 파트너십을 원하시는지 자세히 설명해주세요"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-outline">파트너십 문의하기</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// 폼 제출 함수들
window.submitInvestmentInterest = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // 투자 관심 등록은 현재 Supabase에 테이블이 없으므로 레거시 사용
        if (window.db) {
            const investment = window.db.addInvestmentInterest(data);
        }
        
        event.target.closest('.modal-overlay').remove();
        showNotification('투자 관심이 성공적으로 등록되었습니다! 빠른 시일 내에 연락드리겠습니다.', 'success');
    } catch (error) {
        console.error('투자 관심 등록 실패:', error);
        showNotification('등록 중 오류가 발생했습니다.', 'error');
    }
};

window.submitCollaboration = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // 체크박스 배열 처리
        const areas = formData.getAll('areas');
        data.areas = areas;
        
        // 협업 제안은 현재 Supabase에 테이블이 없으므로 레거시 사용
        if (window.db) {
            const collaboration = window.db.proposeCollaboration(data);
        }
        
        event.target.closest('.modal-overlay').remove();
        showNotification('협업 제안이 성공적으로 접수되었습니다! 검토 후 연락드리겠습니다.', 'success');
    } catch (error) {
        console.error('협업 제안 실패:', error);
        showNotification('제안 중 오류가 발생했습니다.', 'error');
    }
};

window.submitPartnership = function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // 파트너십 데이터를 협업으로 저장 (임시)
    const partnership = window.db.proposeCollaboration({
        ...data,
        type: 'partnership'
    });
    
    event.target.closest('.modal-overlay').remove();
    showNotification('파트너십 문의가 성공적으로 접수되었습니다! 담당자가 연락드리겠습니다.', 'success');
};

// 뉴스레터 구독자 목록 조회 (관리자용)
function getNewsletterSubscribers() {
    return JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
}

// 뉴스레터 구독 해지
function unsubscribeNewsletter(email) {
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    const updatedSubscribers = subscribers.filter(sub => sub !== email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(updatedSubscribers));
    updateNewsletterStats();
    showNotification('뉴스레터 구독이 해지되었습니다.', 'info');
}










// 기술 데모 보기
function showTechDemo() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>🤖 AI 기술 데모</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="tech-demo-content">
                <div class="demo-section">
                    <h4>🎯 AI 목표 추천 시스템</h4>
                    <p>사용자의 행동 패턴과 선호도를 분석하여 개인화된 목표를 추천합니다.</p>
                    <div class="demo-features">
                        <div class="feature-item">
                            <i class="fas fa-brain"></i>
                            <span>머신러닝 기반 분석</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-user-cog"></i>
                            <span>개인화 추천</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-chart-line"></i>
                            <span>성과 예측</span>
                        </div>
                    </div>
                </div>
                
                <div class="demo-section">
                    <h4>📊 실시간 데이터 분석</h4>
                    <p>사용자 행동 데이터를 실시간으로 분석하여 최적의 경험을 제공합니다.</p>
                    <div class="demo-stats">
                        <div class="stat-item">
                            <span class="stat-number">95%</span>
                            <span class="stat-label">정확도</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">0.3초</span>
                            <span class="stat-label">응답시간</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">10만+</span>
                            <span class="stat-label">분석 데이터</span>
                        </div>
                    </div>
                </div>
                
                <div class="demo-section">
                    <h4>🔮 미래 기술 로드맵</h4>
                    <div class="roadmap">
                        <div class="roadmap-item completed">
                            <div class="roadmap-icon">✅</div>
                            <div class="roadmap-content">
                                <h5>기본 AI 추천</h5>
                                <p>사용자 행동 기반 목표 추천</p>
                            </div>
                        </div>
                        <div class="roadmap-item current">
                            <div class="roadmap-icon">🚧</div>
                            <div class="roadmap-content">
                                <h5>고급 개인화</h5>
                                <p>심층 학습 기반 맞춤형 서비스</p>
                            </div>
                        </div>
                        <div class="roadmap-item future">
                            <div class="roadmap-icon">🔮</div>
                            <div class="roadmap-content">
                                <h5>예측 분석</h5>
                                <p>미래 성과 예측 및 최적화</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 사회적 임팩트 보기
function showSocialImpact() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>🌍 사회적 임팩트</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="impact-content">
                <div class="impact-intro">
                    <p>First-Penguins는 기술을 통해 사회적 가치를 창출하고 교육 격차 해소에 기여하고 있습니다.</p>
                </div>
                
                <div class="impact-stats">
                    <div class="impact-stat">
                        <div class="stat-icon">📚</div>
                        <div class="stat-number">5,000+</div>
                        <div class="stat-label">무료 교육 콘텐츠 제공</div>
                    </div>
                    <div class="impact-stat">
                        <div class="stat-icon">👥</div>
                        <div class="stat-number">2,500+</div>
                        <div class="stat-label">교육 혜택 수혜자</div>
                    </div>
                    <div class="impact-stat">
                        <div class="stat-icon">🏫</div>
                        <div class="stat-number">15</div>
                        <div class="stat-label">협력 교육기관</div>
                    </div>
                    <div class="impact-stat">
                        <div class="stat-icon">📈</div>
                        <div class="stat-number">85%</div>
                        <div class="stat-label">목표 달성률 향상</div>
                    </div>
                </div>
                
                <div class="impact-programs">
                    <h4>🎯 주요 프로그램</h4>
                    <div class="program-grid">
                        <div class="program-card">
                            <div class="program-icon">🎓</div>
                            <h5>청소년 교육 지원</h5>
                            <p>취약계층 청소년을 위한 무료 목표 설정 및 학습 관리 프로그램</p>
                        </div>
                        <div class="program-card">
                            <div class="program-icon">👨‍🏫</div>
                            <h5>교사 역량 강화</h5>
                            <p>교육자들을 위한 Goal-Illa 활용 교육 및 워크숍 제공</p>
                        </div>
                        <div class="program-card">
                            <div class="program-icon">🌐</div>
                            <h5>디지털 포용</h5>
                            <p>디지털 소외계층을 위한 접근성 향상 및 사용법 교육</p>
                        </div>
                        <div class="program-card">
                            <div class="program-icon">🤝</div>
                            <h5>사회적 기업 협력</h5>
                            <p>다른 사회적 기업과의 협력을 통한 시너지 창출</p>
                        </div>
                    </div>
                </div>
                
                <div class="impact-testimonials">
                    <h4>💬 참여자 후기</h4>
                    <div class="testimonial">
                        <p>"Goal-Illa 덕분에 아이가 스스로 목표를 세우고 달성하는 모습을 볼 수 있어요. 정말 감사합니다."</p>
                        <div class="testimonial-author">- 김○○ 학부모</div>
                    </div>
                    <div class="testimonial">
                        <p>"무료로 제공되는 교육 콘텐츠가 정말 도움이 됩니다. 더 많은 학생들이 혜택을 받았으면 좋겠어요."</p>
                        <div class="testimonial-author">- 이○○ 교사</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 파트너십 보기
function showPartnerships() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>🤝 파트너십</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="partnerships-content">
                <div class="partnerships-intro">
                    <p>First-Penguins는 다양한 기관과의 협력을 통해 Goal-Illa 생태계를 확장하고 있습니다.</p>
                </div>
                
                <div class="partnerships-categories">
                    <div class="partnership-category">
                        <h4>🏫 교육기관 파트너</h4>
                        <div class="partner-list">
                            <div class="partner-item">
                                <div class="partner-logo">🎓</div>
                                <div class="partner-info">
                                    <h5>서울대학교 교육연구소</h5>
                                    <p>교육 기술 연구 및 개발 협력</p>
                                </div>
                            </div>
                            <div class="partner-item">
                                <div class="partner-logo">📚</div>
                                <div class="partner-info">
                                    <h5>한국교육개발원</h5>
                                    <p>교육 콘텐츠 개발 및 검증</p>
                                </div>
                            </div>
                            <div class="partner-item">
                                <div class="partner-logo">🏛️</div>
                                <div class="partner-info">
                                    <h5>서울시교육청</h5>
                                    <p>청소년 목표 설정 프로그램 운영</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="partnership-category">
                        <h4>🏢 기업 파트너</h4>
                        <div class="partner-list">
                            <div class="partner-item">
                                <div class="partner-logo">💼</div>
                                <div class="partner-info">
                                    <h5>삼성전자</h5>
                                    <p>기술 협력 및 플랫폼 통합</p>
                                </div>
                            </div>
                            <div class="partner-item">
                                <div class="partner-logo">☁️</div>
                                <div class="partner-info">
                                    <h5>네이버 클라우드</h5>
                                    <p>클라우드 인프라 및 AI 서비스</p>
                                </div>
                            </div>
                            <div class="partner-item">
                                <div class="partner-logo">📱</div>
                                <div class="partner-info">
                                    <h5>카카오</h5>
                                    <p>소셜 로그인 및 공유 기능</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="partnership-category">
                        <h4>🌍 사회적 기업 파트너</h4>
                        <div class="partner-list">
                            <div class="partner-item">
                                <div class="partner-logo">❤️</div>
                                <div class="partner-info">
                                    <h5>사회적기업협의회</h5>
                                    <p>사회적 가치 창출 협력</p>
                                </div>
                            </div>
                            <div class="partner-item">
                                <div class="partner-logo">🌱</div>
                                <div class="partner-info">
                                    <h5>지속가능발전협의회</h5>
                                    <p>지속가능한 발전 목표 달성</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="partnership-benefits">
                    <h4>🎁 파트너십 혜택</h4>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <i class="fas fa-handshake"></i>
                            <h5>상호 협력</h5>
                            <p>양방향 지식 공유 및 기술 교류</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-users"></i>
                            <h5>사용자 확장</h5>
                            <p>파트너 기관을 통한 사용자 기반 확대</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-chart-line"></i>
                            <h5>성장 가속화</h5>
                            <p>협력을 통한 빠른 성장과 혁신</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-globe"></i>
                            <h5>사회적 임팩트</h5>
                            <p>더 넓은 사회적 가치 창출</p>
                        </div>
                    </div>
                </div>
                
                <div class="partnership-cta">
                    <h4>🤝 파트너십 문의</h4>
                    <p>First-Penguins와 함께 성장하고 싶으신가요? 다양한 협력 방안을 제안해드립니다.</p>
                    <div class="cta-buttons">
                        <a href="support/contact.html" class="btn btn-primary">파트너십 문의하기</a>
                        <a href="careers.html" class="btn btn-outline">채용 정보 보기</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

