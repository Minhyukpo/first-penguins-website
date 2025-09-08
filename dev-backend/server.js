// First-Penguins 개발용 백엔드 서버
// 실제 데이터베이스 없이 메모리에서 동작하는 개발용 서버

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001; // Goal-Illa와 다른 포트 사용

// 개발용 메모리 데이터베이스
const users = new Map();
const items = new Map();
const categories = new Map();
const events = new Map();
const distributions = new Map();

// JWT 시크릿
const JWT_SECRET = 'dev-secret-key';

// 미들웨어
app.use(cors({
  origin: ['*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));
app.use(express.json());

// 정적 파일 서빙 (웹사이트 파일들)
app.use(express.static('../'));

// 개발용 초기 데이터 생성
function initializeDevData() {
  // Goal-Illa 개발자 계정 생성
  const goalillaDevUser = {
    id: 'goalilla',
    email: 'goalillaoffice@gmail.com',
    password: bcrypt.hashSync('goalilla23', 10),
    email_verified: true,
    birth_date: '1990-01-01',
    age: 25,
    guardian_agreement: null,
    profileImageUrl: 'http://localhost:3001/uploads/goalilla.jpg'
  };
  users.set('goalilla', goalillaDevUser);

  // 개발자용 카테고리 생성
  const devCategory = {
    id: '0',
    user_id: 'goalilla',
    name: 'be-illa'
  };
  categories.set('0', devCategory);

  // 개발자용 목표 데이터 생성
  const devItems = [
    {
      id: '1',
      user_id: 'goalilla',
      category_id: '0',
      name: '📚 공부하기',
      target_amount: 100,
      current_amount: 75,
      unit: '시간',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'goalilla',
      category_id: '0',
      name: '🏃‍♂️ 운동하기',
      target_amount: 100,
      current_amount: 60,
      unit: '분',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      user_id: 'goalilla',
      category_id: '0',
      name: '📖 독서하기',
      target_amount: 100,
      current_amount: 90,
      unit: '페이지',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      user_id: 'goalilla',
      category_id: '0',
      name: '💻 코딩하기',
      target_amount: 200,
      current_amount: 150,
      unit: '시간',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      user_id: 'goalilla',
      category_id: '0',
      name: '🎯 목표 달성',
      target_amount: 50,
      current_amount: 35,
      unit: '개',
      created_at: new Date().toISOString()
    }
  ];

  devItems.forEach(item => {
    items.set(item.id, item);
  });

  console.log('✅ 개발용 초기 데이터가 생성되었습니다.');
  console.log('👨‍💻 개발자 계정: goalilla');
  console.log('🔑 비밀번호: goalilla23');
  console.log('📧 이메일: goalillaoffice@gmail.com');
}

// 로그인 API
app.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    
    const user = users.get(id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'ID not found' 
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          email_verified: user.email_verified,
          profileImageUrl: user.profileImageUrl
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Wrong password' 
      });
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// 회원가입 API
app.post('/register', async (req, res) => {
  try {
    const { id, email, password, birthDate, age, guardianAgree } = req.body;
    
    // 이메일 도메인 검증
    const allowedDomains = [
      'naver.com', 'gmail.com', 'google.com', 'daum.net', 'hanmail.net',
      'kakao.com', 'sk.com', 'kt.com', 'lg.com', 'outlook.com',
      'hotmail.com', 'live.com', 'yahoo.com', 'yahoo.co.kr',
      'icloud.com', 'me.com', 'protonmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({ 
        success: false, 
        message: '지원하지 않는 이메일 서비스입니다.' 
      });
    }

    // 중복 확인
    if (users.has(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID already exists or email already registered' 
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    
    const newUser = {
      id,
      email,
      password: hashed,
      email_verified: true,
      birth_date: birthDate,
      age,
      guardian_agreement: age < 14 ? guardianAgree : null,
      profileImageUrl: null
    };
    
    users.set(id, newUser);
    
    // BE-ILLA 카테고리 자동 생성
    const beIllaCategory = {
      id: '0',
      user_id: id,
      name: 'be-illa'
    };
    categories.set('0', beIllaCategory);
    
    res.json({ success: true });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(400).json({ 
      success: false, 
      message: 'ID already exists or email already registered' 
    });
  }
});

// 사용자 목표 조회 API
app.get('/api/items', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId is required' 
      });
    }

    const userItems = Array.from(items.values()).filter(item => item.user_id === userId);
    
    res.json(userItems);
  } catch (error) {
    console.error('목표 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// 사용자 목표 생성 API
app.post('/api/items', (req, res) => {
  try {
    const { user_id, category_id, name, target_amount, unit } = req.body;
    
    const newItem = {
      id: Date.now().toString(),
      user_id,
      category_id,
      name,
      target_amount: target_amount || 100,
      current_amount: 0,
      unit: unit || '개',
      created_at: new Date().toISOString()
    };
    
    items.set(newItem.id, newItem);
    
    res.json({
      success: true,
      item: newItem
    });
  } catch (error) {
    console.error('목표 생성 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// 사용자 목표 업데이트 API
app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const item = items.get(id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    
    const updatedItem = { ...item, ...updates };
    items.set(id, updatedItem);
    
    res.json({
      success: true,
      item: updatedItem
    });
  } catch (error) {
    console.error('목표 업데이트 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// 아이디 중복 체크 API
app.get('/check-id', (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID를 제공해주세요.' 
      });
    }
    
    if (users.has(id)) {
      return res.json({ 
        success: false, 
        available: false, 
        message: 'ID already exists' 
      });
    } else {
      return res.json({ 
        success: true, 
        available: true 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// 개발용 데이터 초기화 API
app.post('/dev/reset', (req, res) => {
  users.clear();
  items.clear();
  categories.clear();
  events.clear();
  distributions.clear();
  
  initializeDevData();
  
  res.json({ 
    success: true, 
    message: '개발용 데이터가 초기화되었습니다.' 
  });
});

// 개발용 데이터 상태 확인 API
app.get('/dev/status', (req, res) => {
  res.json({
    success: true,
    data: {
      users: users.size,
      items: items.size,
      categories: categories.size,
      events: events.size,
      distributions: distributions.size
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 First-Penguins 개발용 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  console.log(`📊 Goal-Illa와 연동 가능한 개발용 백엔드`);
  
  // 초기 데이터 생성
  initializeDevData();
  
  console.log(`\n📋 사용 가능한 API:`);
  console.log(`   POST /login - 로그인`);
  console.log(`   POST /register - 회원가입`);
  console.log(`   GET /api/items?userId=xxx - 사용자 목표 조회`);
  console.log(`   POST /api/items - 목표 생성`);
  console.log(`   PUT /api/items/:id - 목표 업데이트`);
  console.log(`   GET /check-id?id=xxx - 아이디 중복 체크`);
  console.log(`   POST /dev/reset - 데이터 초기화`);
  console.log(`   GET /dev/status - 서버 상태 확인`);
});
