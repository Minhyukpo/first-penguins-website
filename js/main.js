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
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
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

    console.log('Goal-Illa Company website loaded successfully! 🎯');
});

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
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        authLink.textContent = `${user.name}님`;
        authLink.href = '#';
        authLink.onclick = showUserMenu;
        
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
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
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

