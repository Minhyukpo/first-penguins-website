// Supabase 클라이언트 초기화
// Goal-Illa Supabase 프로젝트 연결

const SUPABASE_CONFIG = {
    url: 'https://antioquxgxxuihrlmwxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudGlvcXV4Z3h4dWlocmxtd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDI4MjksImV4cCI6MjA3NzkxODgyOX0.q9HwVuZ7-FiK-QK5kG_BvrUw6Sld_ulY3BCmU3UvuYo'
};

// Supabase 클라이언트 초기화
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase 클라이언트 초기화 완료');
} else {
    console.error('❌ Supabase 라이브러리를 로드할 수 없습니다.');
}

// 전역에서 사용할 수 있도록 설정
window.supabase = supabaseClient;

// Supabase 헬퍼 클래스
class SupabaseAPI {
    constructor() {
        this.client = supabaseClient;
    }

    // 인증된 사용자 정보 가져오기
    async getCurrentUser() {
        if (!this.client) return null;
        
        const { data: { user }, error } = await this.client.auth.getUser();
        if (error) {
            console.error('사용자 정보 가져오기 실패:', error);
            return null;
        }
        return user;
    }

    // 세션 가져오기
    async getSession() {
        if (!this.client) return null;
        
        const { data: { session }, error } = await this.client.auth.getSession();
        if (error) {
            console.error('세션 가져오기 실패:', error);
            return null;
        }
        return session;
    }

    // 이메일/비밀번호로 로그인
    async signIn(email, password) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 회원가입
    async signUp(email, password, userData = {}) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client.auth.signUp({
            email: email,
            password: password,
            options: {
                data: userData
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 로그아웃
    async signOut() {
        if (!this.client) return;

        const { error } = await this.client.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }

    // 문의하기 제출
    async submitInquiry(inquiryData) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('inquiries')
            .insert([{
                name: inquiryData.name,
                email: inquiryData.email,
                phone: inquiryData.phone || null,
                subject: inquiryData.subject || null,
                message: inquiryData.message,
                inquiry_type: inquiryData.inquiryType || 'general',
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 문의 목록 조회
    async getInquiries(options = {}) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.status) {
            query = query.eq('status', options.status);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return { inquiries: data };
    }

    // 공지사항 목록 조회
    async getAnnouncements(options = {}) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('announcements')
            .select('*')
            .order('published_at', { ascending: false });

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.featured) {
            query = query.eq('featured', true);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return { announcements: data };
    }

    // FAQ 목록 조회
    async getFAQs(category = null) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('faqs')
            .select('*')
            .order('order_index', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return { faqs: data };
    }

    // 뉴스레터 구독
    async subscribeNewsletter(email, name = null, subscriptionType = 'general') {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('newsletter_subscribers')
            .upsert([{
                email: email,
                name: name,
                subscription_type: subscriptionType,
                subscribed_at: new Date().toISOString()
            }], {
                onConflict: 'email'
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 방문 통계 기록
    async recordVisit(pageData) {
        if (!this.client) {
            console.warn('Supabase 클라이언트가 없어 방문 통계를 기록할 수 없습니다.');
            return;
        }

        try {
            const { data, error } = await this.client
                .from('visits')
                .insert([{
                    page_url: pageData.pageUrl,
                    page_title: pageData.pageTitle,
                    session_id: pageData.sessionId,
                    user_agent: pageData.userAgent,
                    referrer: pageData.referrer || null,
                    visit_duration: pageData.visitDuration || 0
                }]);

            if (error) {
                console.error('방문 통계 기록 실패:', error);
            }
        } catch (error) {
            console.error('방문 통계 기록 오류:', error);
        }
    }

    // 사용자 목표 조회 (items 테이블)
    async getItems(userId = null) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 사용자 정보 조회
    async getUser(userId) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 팀 정보 조회
    async getTeam() {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('team')
            .select('*')
            .order('featured', { ascending: false })
            .order('id', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 블로그 포스트 조회
    async getBlogPosts(options = {}) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.featured) {
            query = query.eq('featured', true);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 커뮤니티 피드 조회
    async getCommunityFeed(limit = 20) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('community_feed')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 커뮤니티 피드 추가
    async addCommunityFeed(feedData) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('community_feed')
            .insert([{
                user_id: feedData.userId || null,
                user_name: feedData.userName || '익명',
                user_avatar: feedData.userAvatar || '👤',
                type: feedData.type,
                content: feedData.content,
                reactions: feedData.reactions || {}
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 최근 아이디어 조회
    async getRecentIdeas(limit = 10) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('recent_ideas')
            .select('*')
            .order('submitted_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 최근 아이디어 추가
    async addRecentIdea(ideaData) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('recent_ideas')
            .insert([{
                content: ideaData.content,
                category: ideaData.category || null,
                status: ideaData.status || 'reviewing',
                submitted_by: ideaData.submittedBy || null
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 문제 제출 조회
    async getProblems(options = {}) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        let query = this.client
            .from('problems')
            .select('*')
            .order('created_at', { ascending: false });

        if (options.status) {
            query = query.eq('status', options.status);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return { problems: data };
    }

    // 문제 제출 추가
    async submitProblem(problemData) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('problems')
            .insert([{
                content: problemData.content,
                category: problemData.category || null,
                status: problemData.status || 'active',
                votes: 0,
                submitted_by: problemData.submittedBy || null
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // 문제 상태 업데이트
    async updateProblemStatus(id, status) {
        if (!this.client) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await this.client
            .from('problems')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

// 전역 인스턴스 생성
window.SupabaseAPI = new SupabaseAPI();

// 인증 상태 변경 감지
if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('인증 상태 변경:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
            // 로그인 성공
            localStorage.setItem('authToken', session.access_token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email,
                role: 'user'
            }));
        } else if (event === 'SIGNED_OUT') {
            // 로그아웃
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    });
}

console.log('✅ Supabase API 클래스 초기화 완료');

