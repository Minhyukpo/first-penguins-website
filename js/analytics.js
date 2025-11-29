// Analytics 및 모니터링 초기화
// Google Analytics, Google AdSense, Sentry, Vercel Analytics 통합

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
    
    // Google AdSense 초기화
    function initGoogleAdSense() {
        if (!CONFIG.external?.googleAdSense?.enabled) {
            console.log('💰 Google AdSense가 비활성화되어 있습니다.');
            return;
        }
        
        const publisherId = CONFIG.external.googleAdSense.publisherId;
        if (!publisherId || publisherId === 'ca-pub-XXXXXXXXXX') {
            console.warn('⚠️ Google AdSense Publisher ID가 설정되지 않았습니다.');
            return;
        }
        
        // AdSense 스크립트 로드
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            console.log('✅ Google AdSense 초기화 완료:', publisherId);
        };
        script.onerror = function() {
            console.warn('⚠️ Google AdSense 스크립트를 로드할 수 없습니다.');
        };
        document.head.appendChild(script);
    }
    
    // AdSense 광고 단위 생성 헬퍼 함수
    window.createAdSenseUnit = function(adSlotId, adFormat, adStyle) {
        if (!CONFIG.external?.googleAdSense?.enabled) {
            console.warn('⚠️ Google AdSense가 활성화되지 않았습니다.');
            return null;
        }
        
        const publisherId = CONFIG.external.googleAdSense.publisherId;
        if (!publisherId || publisherId === 'ca-pub-XXXXXXXXXX') {
            console.warn('⚠️ Google AdSense Publisher ID가 설정되지 않았습니다.');
            return null;
        }
        
        // 광고 컨테이너 생성
        const adContainer = document.createElement('ins');
        adContainer.className = 'adsbygoogle';
        adContainer.style.display = 'block';
        
        // 광고 스타일 설정
        if (adStyle) {
            Object.assign(adContainer.style, adStyle);
        }
        
        // 광고 속성 설정
        adContainer.setAttribute('data-ad-client', publisherId);
        adContainer.setAttribute('data-ad-slot', adSlotId);
        
        if (adFormat) {
            adContainer.setAttribute('data-ad-format', adFormat);
        }
        
        // 광고 초기화
        if (window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense 광고 초기화 오류:', e);
            }
        }
        
        return adContainer;
    };
    
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
    
    // 쿠키 동의 확인 후 서비스 초기화
    function initServicesWithConsent() {
        // 쿠키 동의 상태 확인
        const consent = window.getCookieConsent ? window.getCookieConsent() : null;
        
        // 동의가 없거나 Analytics/AdSense가 비활성화된 경우 초기화하지 않음
        if (consent) {
            if (consent.analytics) {
                initGoogleAnalytics();
            }
            if (consent.marketing) {
                initGoogleAdSense();
            }
        } else {
            // 동의 대기 중 - 쿠키 동의 이벤트 리스너 등록
            window.addEventListener('cookieConsentUpdated', function(e) {
                const consent = e.detail;
                if (consent.analytics) {
                    initGoogleAnalytics();
                }
                if (consent.marketing) {
                    initGoogleAdSense();
                }
            });
        }
        
        // Sentry와 Vercel Analytics는 항상 초기화 (필수)
        initSentry();
        initVercelAnalytics();
    }
    
    // 초기화 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServicesWithConsent);
    } else {
        initServicesWithConsent();
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

