// Analytics 및 모니터링 초기화
// Google Analytics, Sentry, Vercel Analytics 통합

(function() {
    'use strict';
    
    const CONFIG = window.CONFIG || {};
    
    // Google Analytics 초기화
    function initGoogleAnalytics() {
        if (!CONFIG.external?.googleAnalytics?.enabled) {
            console.log('📊 Google Analytics가 비활성화되어 있습니다.');
            return;
        }
        
        const measurementId = CONFIG.external.googleAnalytics.measurementId;
        if (!measurementId || measurementId === 'GA_MEASUREMENT_ID') {
            console.warn('⚠️ Google Analytics Measurement ID가 설정되지 않았습니다.');
            return;
        }
        
        // GA4 스크립트 로드
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script1);
        
        // GA4 초기화 스크립트
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', measurementId, {
            'page_path': window.location.pathname,
            'send_page_view': true
        });
        
        window.gtag = gtag;
        console.log('✅ Google Analytics 초기화 완료:', measurementId);
    }
    
    // Sentry 에러 로깅 초기화
    function initSentry() {
        if (!CONFIG.external?.sentry?.enabled) {
            console.log('🔍 Sentry가 비활성화되어 있습니다.');
            return;
        }
        
        const dsn = CONFIG.external.sentry.dsn;
        if (!dsn || dsn === 'SENTRY_DSN') {
            console.warn('⚠️ Sentry DSN이 설정되지 않았습니다.');
            return;
        }
        
        // Sentry 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://browser.sentry-cdn.com/7.91.0/bundle.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            if (window.Sentry) {
                window.Sentry.init({
                    dsn: dsn,
                    environment: CONFIG.isDevelopment ? 'development' : 'production',
                    tracesSampleRate: CONFIG.isDevelopment ? 1.0 : 0.1,
                    beforeSend(event, hint) {
                        // 개발 환경에서는 콘솔에 출력
                        if (CONFIG.isDevelopment) {
                            console.error('Sentry Event:', event);
                        }
                        return event;
                    }
                });
                console.log('✅ Sentry 초기화 완료');
            }
        };
        document.head.appendChild(script);
    }
    
    // Vercel Analytics 초기화
    function initVercelAnalytics() {
        if (!CONFIG.external?.vercelAnalytics?.enabled) {
            console.log('📈 Vercel Analytics가 비활성화되어 있습니다.');
            return;
        }
        
        // Vercel Analytics 스크립트 로드
        const script = document.createElement('script');
        script.defer = true;
        script.src = '/_vercel/insights/script.js';
        script.onload = function() {
            console.log('✅ Vercel Analytics 초기화 완료');
        };
        script.onerror = function() {
            console.warn('⚠️ Vercel Analytics 스크립트를 로드할 수 없습니다. (로컬 환경일 수 있습니다)');
        };
        document.head.appendChild(script);
    }
    
    // 페이지뷰 추적 (Google Analytics)
    function trackPageView() {
        if (window.gtag && CONFIG.external?.googleAnalytics?.enabled) {
            window.gtag('config', CONFIG.external.googleAnalytics.measurementId, {
                'page_path': window.location.pathname + window.location.search,
                'page_title': document.title
            });
        }
    }
    
    // 이벤트 추적 헬퍼 함수
    window.trackEvent = function(category, action, label, value) {
        // Google Analytics 이벤트
        if (window.gtag && CONFIG.external?.googleAnalytics?.enabled) {
            window.gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
        
        // Sentry 이벤트 (중요한 이벤트만)
        if (window.Sentry && CONFIG.external?.sentry?.enabled && category === 'error') {
            window.Sentry.captureMessage(`${category}: ${action}`, {
                level: 'info',
                tags: { category, action, label }
            });
        }
    };
    
    // 초기화 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initGoogleAnalytics();
            initSentry();
            initVercelAnalytics();
        });
    } else {
        initGoogleAnalytics();
        initSentry();
        initVercelAnalytics();
    }
    
    // 페이지 전환 시 페이지뷰 추적
    if ('history' in window) {
        let lastUrl = window.location.href;
        new MutationObserver(() => {
            const url = window.location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                trackPageView();
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    // 초기 페이지뷰 추적
    trackPageView();
})();

