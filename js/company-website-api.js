// Company Website API 연동 JavaScript
// Goal-Illa 백엔드 API와 통합된 Company Website 기능들

class CompanyWebsiteAPI {
    constructor() {
        this.baseUrl = window.CONFIG.api.baseUrl;
        this.endpoints = window.CONFIG.api.endpoints;
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
            console.error('API 요청 오류:', error);
            throw error;
        }
    }

    // 문의하기
    async submitInquiry(inquiryData) {
        return await this.makeRequest(this.endpoints.inquiries, {
            method: 'POST',
            body: JSON.stringify(inquiryData)
        });
    }

    // 문의 목록 조회 (관리자용)
    async getInquiries(options = {}) {
        const params = new URLSearchParams(options);
        const endpoint = `${this.endpoints.inquiries}${params.toString() ? '?' + params.toString() : ''}`;
        return await this.makeRequest(endpoint);
    }

    // 문의 상세 조회
    async getInquiry(id) {
        return await this.makeRequest(`${this.endpoints.inquiries}/${id}`);
    }

    // 문의 상태 업데이트
    async updateInquiryStatus(id, status) {
        return await this.makeRequest(`${this.endpoints.inquiries}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // 불편함 제출 목록 조회 (관리자용)
    async getProblems() {
        return await this.makeRequest('/api/website/problems');
    }

    // 불편함 제출 상태 업데이트
    async updateProblemStatus(id, status) {
        return await this.makeRequest(`/api/website/problems/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // 공지사항 목록 조회
    async getAnnouncements(options = {}) {
        const params = new URLSearchParams(options);
        const endpoint = `${this.endpoints.announcements}${params.toString() ? '?' + params.toString() : ''}`;
        return await this.makeRequest(endpoint);
    }

    // 공지사항 상세 조회
    async getAnnouncement(id) {
        return await this.makeRequest(`${this.endpoints.announcements}/${id}`);
    }

    // FAQ 목록 조회
    async getFAQs(category = null) {
        const params = category ? `?category=${category}` : '';
        return await this.makeRequest(`${this.endpoints.faqs}${params}`);
    }

    // 뉴스레터 구독
    async subscribeNewsletter(email, name, subscriptionType = 'general') {
        return await this.makeRequest(`${this.endpoints.newsletter}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({ email, name, subscriptionType })
        });
    }

    // 뉴스레터 구독 해제
    async unsubscribeNewsletter(email) {
        return await this.makeRequest(`${this.endpoints.newsletter}/unsubscribe`, {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // 방문 통계 기록
    async recordVisit(pageData) {
        return await this.makeRequest(this.endpoints.visits, {
            method: 'POST',
            body: JSON.stringify(pageData)
        });
    }

    // 서비스 목록 조회
    async getServices() {
        return await this.makeRequest(this.endpoints.services);
    }

    // 사용자 서비스 권한 조회
    async getUserServices() {
        return await this.makeRequest(this.endpoints.userServices);
    }

    // Goal-Illa 목표 데이터 조회 (기존 API 활용)
    async getGoals() {
        return await this.makeRequest(this.endpoints.items);
    }

    // Goal-Illa 로그인 (기존 API 활용)
    async login(email, password) {
        return await this.makeRequest(this.endpoints.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    // Goal-Illa 회원가입 (기존 API 활용)
    async register(userData) {
        return await this.makeRequest(this.endpoints.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
}

// 전역 인스턴스 생성
window.CompanyWebsiteAPI = new CompanyWebsiteAPI();

// 페이지 로드 시 방문 통계 기록
document.addEventListener('DOMContentLoaded', function() {
    // 방문 통계 기록
    const pageData = {
        pageUrl: window.location.href,
        pageTitle: document.title,
        sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        visitDuration: 0
    };

    // 세션 ID 생성 및 저장
    if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', pageData.sessionId);
    }

    // 방문 통계 기록 (비동기)
    window.CompanyWebsiteAPI.recordVisit(pageData).catch(error => {
        console.log('방문 통계 기록 실패:', error);
    });

    // 페이지 이탈 시 방문 시간 기록
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const visitDuration = Math.floor((Date.now() - startTime) / 1000);
        pageData.visitDuration = visitDuration;
        
        // navigator.sendBeacon을 사용하여 페이지 이탈 시에도 데이터 전송
        if (navigator.sendBeacon) {
            const data = JSON.stringify(pageData);
            navigator.sendBeacon(`${window.CONFIG.api.baseUrl}${window.CONFIG.api.endpoints.visits}`, data);
        }
    });
});

// 세션 ID 생성 함수
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 문의하기 폼 처리
function handleInquirySubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const inquiryData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        inquiryType: formData.get('inquiryType') || 'general'
    };

    // 문의 제출
    window.CompanyWebsiteAPI.submitInquiry(inquiryData)
        .then(response => {
            alert('문의가 성공적으로 접수되었습니다!');
            event.target.reset();
        })
        .catch(error => {
            alert('문의 접수 중 오류가 발생했습니다: ' + error.message);
        });
}

// 뉴스레터 구독 처리
function handleNewsletterSubscribe(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const name = formData.get('name');

    window.CompanyWebsiteAPI.subscribeNewsletter(email, name)
        .then(response => {
            alert('뉴스레터 구독이 완료되었습니다!');
            event.target.reset();
        })
        .catch(error => {
            alert('구독 중 오류가 발생했습니다: ' + error.message);
        });
}

// 공지사항 동적 로드
async function loadAnnouncements() {
    try {
        const response = await window.CompanyWebsiteAPI.getAnnouncements({ limit: 5 });
        const announcements = response.announcements;
        
        const container = document.getElementById('announcements-container');
        if (container && announcements.length > 0) {
            container.innerHTML = announcements.map(announcement => `
                <div class="announcement-item">
                    <h4>${announcement.title}</h4>
                    <p>${announcement.summary || announcement.content.substring(0, 100)}...</p>
                    <small>${new Date(announcement.published_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.log('공지사항 로드 실패:', error);
    }
}

// FAQ 동적 로드
async function loadFAQs() {
    try {
        const response = await window.CompanyWebsiteAPI.getFAQs();
        const faqs = response.faqs;
        
        const container = document.getElementById('faqs-container');
        if (container && faqs.length > 0) {
            container.innerHTML = faqs.map(faq => `
                <div class="faq-item">
                    <h4>${faq.question}</h4>
                    <p>${faq.answer}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.log('FAQ 로드 실패:', error);
    }
}

// 페이지 로드 시 동적 콘텐츠 로드
document.addEventListener('DOMContentLoaded', function() {
    // 공지사항 로드
    if (document.getElementById('announcements-container')) {
        loadAnnouncements();
    }
    
    // FAQ 로드
    if (document.getElementById('faqs-container')) {
        loadFAQs();
    }
    
    // 문의하기 폼 이벤트 리스너
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    
    // 뉴스레터 구독 폼 이벤트 리스너
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscribe);
    }
});

