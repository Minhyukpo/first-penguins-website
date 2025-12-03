// 데이터베이스 기반 콘텐츠 로더
// 하드코딩된 데이터를 데이터베이스에서 동적으로 로드하는 시스템

class DatabaseContentLoader {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // 데이터베이스가 준비될 때까지 대기
        const waitForDB = () => {
            if (window.db) {
                this.db = window.db;
                this.isInitialized = true;
                this.loadAllContent();
            } else {
                setTimeout(waitForDB, 100);
            }
        };
        waitForDB();
    }

    // 모든 콘텐츠 로드 (비동기)
    async loadAllContent() {
        // 병렬로 로드하여 성능 향상
        await Promise.all([
            this.loadCommunityFeed(),
            this.loadRecentIdeas(),
            this.loadTeamInfo(),
            this.loadBlogPosts()
        ]);
        
        // 동기 함수들
        this.loadAppsConfig();
        this.loadProblemSolutionCards();
    }

    // 커뮤니티 피드 로드
    async loadCommunityFeed() {
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
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
                feedData = this.db.getCommunityFeed();
            }
            
            // 피드가 비어있는 경우
            if (!feedData || feedData.length === 0) {
                feedContainer.innerHTML = `
                    <div class="empty-feed">
                        <div class="empty-icon">🌱</div>
                        <h3>아직 커뮤니티 활동이 없어요</h3>
                        <p>First-Penguins의 첫 번째 사용자가 되어 커뮤니티를 시작해보세요!</p>
                        <div class="empty-actions">
                            <a href="auth/register.html" class="btn btn-primary">
                                <i class="fas fa-user-plus"></i>
                                첫 번째 사용자 되기
                            </a>
                        </div>
                    </div>
                `;
                return;
            }
            
            let feedHtml = '';
            feedData.forEach(feed => {
                const timeAgo = this.getTimeAgo(new Date(feed.timestamp));
                const statusBadge = this.getStatusBadge(feed.type);
                const reactions = Object.entries(feed.reactions).map(([key, value]) => {
                    const emoji = this.getReactionEmoji(key);
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
            
            feedContainer.innerHTML = feedHtml;
            this.addReactionListeners();
            
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
    async loadRecentIdeas() {
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
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
                ideasData = this.db.getRecentIdeas();
            }
            
            // 아이디어가 비어있는 경우
            if (!ideasData || ideasData.length === 0) {
                ideasList.innerHTML = `
                    <div class="empty-ideas">
                        <div class="empty-icon">💡</div>
                        <h4>아직 제안된 아이디어가 없어요</h4>
                        <p>불편함을 발견하셨나요? 첫 번째 아이디어를 제안해보세요!</p>
                        <div class="empty-actions">
                            <button class="btn btn-outline" onclick="document.getElementById('problemInput').focus()">
                                <i class="fas fa-lightbulb"></i>
                                아이디어 제안하기
                            </button>
                        </div>
                    </div>
                `;
                return;
            }
            
            let ideasHtml = '';
            ideasData.forEach(idea => {
                const timeAgo = this.getTimeAgo(new Date(idea.submittedAt));
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

    // 팀 정보 로드
    async loadTeamInfo() {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;

        try {
            let teamData = [];
            
            // Supabase에서 팀 데이터 로드
            if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
                teamData = await window.SupabaseAPI.getTeam();
                // Supabase 데이터 형식에 맞게 변환
                teamData = teamData.map(member => ({
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
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
                teamData = this.db.getTeam();
            }
            
            let teamHtml = '';
            teamData.forEach((member, index) => {
                const isFeatured = member.featured || index === 0;
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
                                ${(member.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            teamGrid.innerHTML = teamHtml;
            
        } catch (error) {
            console.error('팀 정보 로드 실패:', error);
            teamGrid.innerHTML = `
                <div class="loading-teams">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>팀 정보를 불러올 수 없습니다.</p>
                </div>
            `;
        }
    }

    // 앱 설정 로드
    loadAppsConfig() {
        if (window.APPS_CONFIG && this.db) {
            const apps = this.db.getApps();
            
            // 기존 설정 초기화
            Object.keys(window.APPS_CONFIG).forEach(key => delete window.APPS_CONFIG[key]);
            
            // 새 설정 적용
            apps.forEach(app => {
                window.APPS_CONFIG[app.id] = {
                    ...app,
                    apiEndpoint: window.CONFIG ? window.CONFIG.api.baseUrl : 'https://3.38.27.53:3000'
                };
            });
            
            console.log('앱 설정이 데이터베이스에서 로드되었습니다.');
        }
    }

    // 문제-해결책 카드 로드
    loadProblemSolutionCards() {
        // 이미 main.js에서 처리되고 있음
        console.log('문제-해결책 카드는 main.js에서 처리됩니다.');
    }

    // 블로그 포스트 로드
    async loadBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        try {
            let blogPosts = [];
            
            // Supabase에서 블로그 포스트 로드
            if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
                blogPosts = await window.SupabaseAPI.getBlogPosts({ limit: 6 });
                // Supabase 데이터 형식에 맞게 변환
                blogPosts = blogPosts.map(post => ({
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
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
                blogPosts = this.db.getBlogPosts();
            }
            
            let blogHtml = '';
            blogPosts.forEach(post => {
                const publishedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                const featuredClass = post.featured ? 'featured' : '';
                
                blogHtml += `
                    <div class="blog-card ${featuredClass}">
                        <div class="blog-header">
                            <div class="blog-category">${this.getCategoryName(post.category)}</div>
                            <div class="blog-date">${publishedDate}</div>
                        </div>
                        <div class="blog-content">
                            <h3>${post.title}</h3>
                            <p>${post.summary}</p>
                            <div class="blog-meta">
                                <span class="author">by ${post.author}</span>
                                <span class="read-time">${post.readTime}분 읽기</span>
                            </div>
                            <div class="blog-tags">
                                ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="blog-actions">
                            <button class="btn btn-outline" onclick="readBlogPost(${post.id})">
                                <i class="fas fa-book-open"></i>
                                읽어보기
                            </button>
                        </div>
                    </div>
                `;
            });
            
            blogGrid.innerHTML = blogHtml;
            
        } catch (error) {
            console.error('블로그 포스트 로드 실패:', error);
            blogGrid.innerHTML = `
                <div class="loading-blogs">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>블로그 포스트를 불러올 수 없습니다.</p>
                </div>
            `;
        }
    }

    // 유틸리티 함수들
    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return '방금 전';
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
        return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }

    getStatusBadge(type) {
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

    getReactionEmoji(key) {
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

    addReactionListeners() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.target.dataset.post;
                const reactionKey = e.target.dataset.reaction;
                
                if (window.dynamicStats && postId && reactionKey) {
                    window.dynamicStats.handleFeedReaction(`post${postId}`, reactionKey);
                }
            });
        });
    }

    // 새 피드 아이템 추가
    async addFeedItem(feedData) {
        try {
            // Supabase에 피드 추가
            if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
                await window.SupabaseAPI.addCommunityFeed({
                    userId: feedData.userId || null,
                    userName: feedData.userName || '익명',
                    userAvatar: feedData.userAvatar || '👤',
                    type: feedData.type,
                    content: feedData.content,
                    reactions: feedData.reactions || {}
                });
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
            this.db.addCommunityFeedItem(feedData);
            }
            
            // 피드 새로고침
            await this.loadCommunityFeed();
        } catch (error) {
            console.error('피드 추가 실패:', error);
        }
    }

    // 새 아이디어 추가
    async addIdea(ideaData) {
        try {
            // Supabase에 아이디어 추가
            if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false) {
                await window.SupabaseAPI.addRecentIdea({
                    content: ideaData.content,
                    category: ideaData.category,
                    status: ideaData.status || 'reviewing',
                    submittedBy: ideaData.submittedBy || null
                });
            } else if (this.db) {
                // 레거시: 로컬 스토리지 사용
            this.db.addIdea(ideaData);
            }
            
            // 아이디어 목록 새로고침
            await this.loadRecentIdeas();
        } catch (error) {
            console.error('아이디어 추가 실패:', error);
        }
    }

    // 콘텐츠 새로고침
    async refresh() {
        if (this.isInitialized) {
            await this.loadAllContent();
        }
    }

    // 카테고리 이름 변환
    getCategoryName(category) {
        const categoryMap = {
            'philosophy': '기업 철학',
            'technology': '기술',
            'business': '비즈니스',
            'product': '제품',
            'culture': '기업 문화'
        };
        return categoryMap[category] || category;
    }
}

// 전역 인스턴스 생성
window.DatabaseContentLoader = DatabaseContentLoader;
window.dbContentLoader = new DatabaseContentLoader();

// 전역 함수들
window.addFeedItem = (feedData) => window.dbContentLoader.addFeedItem(feedData);
window.addIdea = (ideaData) => window.dbContentLoader.addIdea(ideaData);
window.refreshDatabaseContent = () => window.dbContentLoader.refresh();

// loadAllContent를 비동기로 업데이트
if (window.dbContentLoader) {
    const originalLoadAllContent = window.dbContentLoader.loadAllContent;
    window.dbContentLoader.loadAllContent = async function() {
        await Promise.all([
            this.loadCommunityFeed(),
            this.loadRecentIdeas(),
            this.loadTeamInfo(),
            this.loadBlogPosts()
        ]);
        this.loadAppsConfig();
        this.loadProblemSolutionCards();
    };
}

// 블로그 포스트 읽기 함수
window.readBlogPost = async (postId) => {
    try {
        let post = null;
        
        // Supabase에서 블로그 포스트 조회
        if (window.SupabaseAPI && window.CONFIG?.supabase?.enabled !== false && window.supabase) {
            const { data, error } = await window.supabase
                .from('blog_posts')
                .select('*')
                .eq('id', postId)
                .single();
            
            if (!error && data) {
                post = {
                    id: data.id,
                    title: data.title,
                    summary: data.summary,
                    content: data.content,
                    author: data.author,
                    publishedAt: data.published_at,
                    category: data.category,
                    tags: data.tags || [],
                    readTime: data.read_time,
                    featured: data.featured
                };
            }
        } else if (window.db) {
            // 레거시: 로컬 스토리지 사용
        const blogPosts = window.db.getBlogPosts();
            post = blogPosts.find(p => p.id === postId);
        }
        
        if (post) {
            // 간단한 모달로 블로그 내용 표시
            const modal = document.createElement('div');
            modal.className = 'blog-modal';
            modal.innerHTML = `
                <div class="blog-modal-content">
                    <div class="blog-modal-header">
                        <h2>${post.title}</h2>
                        <button class="close-modal" onclick="closeBlogModal()">&times;</button>
                    </div>
                    <div class="blog-modal-body">
                        <div class="blog-meta">
                            <span>작성자: ${post.author}</span>
                            <span>카테고리: ${window.dbContentLoader ? window.dbContentLoader.getCategoryName(post.category) : post.category}</span>
                            <span>읽는 시간: ${post.readTime || 5}분</span>
                        </div>
                        <div class="blog-content">
                            ${post.content}
                        </div>
                        <div class="blog-tags">
                            ${(post.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('블로그 포스트 로드 실패:', error);
        alert('블로그 포스트를 불러올 수 없습니다.');
    }
};

// 블로그 모달 닫기 함수
window.closeBlogModal = () => {
    const modal = document.querySelector('.blog-modal');
    if (modal) {
        modal.remove();
    }
};

console.log('데이터베이스 콘텐츠 로더가 초기화되었습니다.');
