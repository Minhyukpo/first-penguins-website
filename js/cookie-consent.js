// 쿠키 및 개인정보 동의 관리 시스템
// GDPR 및 한국 개인정보보호법 준수

(function() {
    'use strict';
    
    const CONSENT_STORAGE_KEY = 'cookie_consent';
    const CONSENT_VERSION = '1.0';
    
    // 동의 상태 확인
    function getConsentStatus() {
        try {
            const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (!stored) return null;
            
            const consent = JSON.parse(stored);
            // 버전이 다르면 다시 동의 요청
            if (consent.version !== CONSENT_VERSION) return null;
            
            return consent;
        } catch (e) {
            console.error('쿠키 동의 상태 확인 오류:', e);
            return null;
        }
    }
    
    // 동의 상태 저장
    function saveConsentStatus(consent) {
        try {
            const consentData = {
                version: CONSENT_VERSION,
                timestamp: new Date().toISOString(),
                ...consent
            };
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
        } catch (e) {
            console.error('쿠키 동의 상태 저장 오류:', e);
        }
    }
    
    // 쿠키 동의 배너 생성
    function createConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>🍪 쿠키 및 개인정보 처리 동의</h3>
                    <p>First-Penguins는 더 나은 서비스 제공을 위해 쿠키를 사용합니다. 
                    <a href="support/privacy-policy.html" target="_blank">개인정보처리방침</a>을 확인하시고, 
                    쿠키 사용에 동의해주세요.</p>
                    <div class="cookie-consent-options">
                        <label class="cookie-option">
                            <input type="checkbox" id="consent-necessary" checked disabled>
                            <span>필수 쿠키</span>
                            <small>사이트 기능에 필수적입니다</small>
                        </label>
                        <label class="cookie-option">
                            <input type="checkbox" id="consent-analytics">
                            <span>분석 쿠키</span>
                            <small>Google Analytics를 통한 방문자 분석</small>
                        </label>
                        <label class="cookie-option">
                            <input type="checkbox" id="consent-marketing">
                            <span>마케팅 쿠키</span>
                            <small>Google AdSense를 통한 맞춤형 광고</small>
                        </label>
                    </div>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="consent-accept-all" class="btn-consent btn-accept-all">
                        모두 동의
                    </button>
                    <button id="consent-accept-selected" class="btn-consent btn-accept-selected">
                        선택 동의
                    </button>
                    <button id="consent-reject" class="btn-consent btn-reject">
                        필수만 허용
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // 이벤트 리스너 추가
        setupConsentListeners(banner);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }
    
    // 동의 버튼 이벤트 설정
    function setupConsentListeners(banner) {
        // 모두 동의
        document.getElementById('consent-accept-all').addEventListener('click', function() {
            const consent = {
                necessary: true,
                analytics: true,
                marketing: true
            };
            saveConsentStatus(consent);
            hideBanner(banner);
            initializeServices(consent);
        });
        
        // 선택 동의
        document.getElementById('consent-accept-selected').addEventListener('click', function() {
            const consent = {
                necessary: true,
                analytics: document.getElementById('consent-analytics').checked,
                marketing: document.getElementById('consent-marketing').checked
            };
            saveConsentStatus(consent);
            hideBanner(banner);
            initializeServices(consent);
        });
        
        // 필수만 허용
        document.getElementById('consent-reject').addEventListener('click', function() {
            const consent = {
                necessary: true,
                analytics: false,
                marketing: false
            };
            saveConsentStatus(consent);
            hideBanner(banner);
            initializeServices(consent);
        });
        
        // 설정 변경 버튼 (배너 숨김 후 다시 표시)
        const settingsBtn = document.getElementById('cookie-consent-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                showBanner();
            });
        }
    }
    
    // 배너 숨기기
    function hideBanner(banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    }
    
    // 배너 표시
    function showBanner() {
        const existingBanner = document.getElementById('cookie-consent-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        createConsentBanner();
    }
    
    // 서비스 초기화 (동의에 따라)
    function initializeServices(consent) {
        // Analytics 초기화
        if (consent.analytics && window.CONFIG?.external?.googleAnalytics?.enabled) {
            // analytics.js에서 이미 초기화되지만, 동의 후에만 활성화되도록 확인
            console.log('✅ 분석 쿠키 동의됨 - Analytics 활성화');
        }
        
        // AdSense 초기화
        if (consent.marketing && window.CONFIG?.external?.googleAdSense?.enabled) {
            console.log('✅ 마케팅 쿠키 동의됨 - AdSense 활성화');
        }
        
        // 동의 상태를 전역으로 저장
        window.cookieConsent = consent;
        
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
    }
    
    // 동의 상태에 따라 서비스 제어
    function controlServices() {
        const consent = getConsentStatus();
        if (!consent) return;
        
        // Analytics 제어
        if (!consent.analytics && window.gtag) {
            // Analytics 비활성화
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        // AdSense 제어
        if (!consent.marketing) {
            // AdSense 광고 숨기기
            const ads = document.querySelectorAll('.adsbygoogle');
            ads.forEach(ad => {
                ad.style.display = 'none';
            });
        }
    }
    
    // 초기화
    function init() {
        const consent = getConsentStatus();
        
        if (!consent) {
            // 동의하지 않은 경우 배너 표시
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createConsentBanner);
            } else {
                createConsentBanner();
            }
        } else {
            // 이미 동의한 경우 서비스 초기화
            initializeServices(consent);
            controlServices();
        }
    }
    
    // 전역 함수로 노출
    window.showCookieConsent = showBanner;
    window.getCookieConsent = getConsentStatus;
    window.updateCookieConsent = function(newConsent) {
        saveConsentStatus(newConsent);
        initializeServices(newConsent);
        controlServices();
    };
    
    // 초기화 실행
    init();
})();

