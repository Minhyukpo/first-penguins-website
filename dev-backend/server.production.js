// First-Penguins 웹 전용 백엔드 - 프로덕션 서버
// 실제 데이터베이스 없이 메모리에서 동작하는 웹 전용 서버

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { productionConfig } from './production.config.js';

const app = express();
const PORT = productionConfig.PORT;

// 프로덕션용 메모리 데이터베이스
const users = new Map();
const items = new Map();
const categories = new Map();
const events = new Map();
const distributions = new Map();

// 미들웨어
app.use(cors({
  origin: productionConfig.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));
app.use(express.json());

// 정적 파일 서빙 (웹사이트 파일들)
app.use(express.static('../'));

// 프로덕션용 초기 데이터 생성
function initializeProductionData() {
  // Goal-Illa 개발자 계정 생성
  const goalillaDevUser = {
    id: productionConfig.DEV_ACCOUNT.ID,
    email: productionConfig.DEV_ACCOUNT.EMAIL,
    password: bcrypt.hashSync(productionConfig.DEV_ACCOUNT.PASSWORD, 10),
    email_verified: true,
    birth_date: '1990-01-01',
    age: 25,
    guardian_agreement: null,
    profileImageUrl: '/uploads/goalilla.jpg'
  };
  users.set(productionConfig.DEV_ACCOUNT.ID, goalillaDevUser);

  // 개발자용 카테고리 생성
  const devCategory = {
    id: 'dev-category-1',
    name: '개발자 목표',
    color: '#4CAF50',
    userId: productionConfig.DEV_ACCOUNT.ID
  };
  categories.set('dev-category-1', devCategory);

  // 개발자용 목표 데이터 생성
  const devGoals = [
    {
      id: 'dev-goal-1',
      item_name: '웹사이트 완성',
      target_amount: 100,
      current_amount: 75,
      category_id: 'dev-category-1',
      userId: productionConfig.DEV_ACCOUNT.ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dev-goal-2',
      item_name: '앱 출시 준비',
      target_amount: 50,
      current_amount: 30,
      category_id: 'dev-category-1',
      userId: productionConfig.DEV_ACCOUNT.ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dev-goal-3',
      item_name: '사용자 피드백 수집',
      target_amount: 200,
      current_amount: 45,
      category_id: 'dev-category-1',
      userId: productionConfig.DEV_ACCOUNT.ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  devGoals.forEach(goal => {
    items.set(goal.id, goal);
  });

  console.log('✅ 프로덕션용 초기 데이터가 생성되었습니다.');
  console.log('👨‍💻 개발자 계정:', productionConfig.DEV_ACCOUNT.ID);
  console.log('🔑 비밀번호:', productionConfig.DEV_ACCOUNT.PASSWORD);
  console.log('📧 이메일:', productionConfig.DEV_ACCOUNT.EMAIL);
}

// 로그인 API
app.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '아이디와 비밀번호를 입력해주세요.' 
      });
    }

    const user = users.get(id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '아이디 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: '아이디 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      }, 
      productionConfig.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 회원가입 API
app.post('/register', async (req, res) => {
  try {
    const { id, email, password, name, birthDate, age, guardianAgree } = req.body;

    if (!id || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '필수 정보를 모두 입력해주세요.' 
      });
    }

    if (users.has(id)) {
      return res.status(409).json({ 
        success: false, 
        message: '이미 존재하는 아이디입니다.' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id,
      email,
      password: hashedPassword,
      name: name || '',
      birth_date: birthDate || '1990-01-01',
      age: age || 25,
      guardian_agreement: guardianAgree || null,
      email_verified: false,
      profileImageUrl: '/uploads/default-avatar.jpg',
      created_at: new Date().toISOString()
    };

    users.set(id, newUser);

    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      }, 
      productionConfig.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        profileImageUrl: newUser.profileImageUrl
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 사용자 목표 조회 API
app.get('/api/items', (req, res) => {
  try {
    const { userId } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '인증 토큰이 필요합니다.' 
      });
    }

    try {
      jwt.verify(token, productionConfig.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: '사용자 ID가 필요합니다.' 
      });
    }

    const userItems = Array.from(items.values())
      .filter(item => item.userId === userId)
      .map(item => ({
        id: item.id,
        item_name: item.item_name,
        target_amount: item.target_amount,
        current_amount: item.current_amount,
        category_id: item.category_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

    res.json({
      success: true,
      data: userItems
    });
  } catch (error) {
    console.error('목표 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
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
        message: '아이디를 입력해주세요.' 
      });
    }

    const exists = users.has(id);
    res.json({
      success: true,
      available: !exists,
      message: exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
    });
  } catch (error) {
    console.error('아이디 체크 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 서버 상태 확인 API
app.get('/dev/status', (req, res) => {
  res.json({
    success: true,
    message: 'First-Penguins 웹 전용 백엔드가 정상 동작 중입니다.',
    environment: productionConfig.NODE_ENV,
    port: PORT,
    users: users.size,
    items: items.size,
    categories: categories.size
  });
});

// 서버 시작
app.listen(PORT, () => {
  initializeProductionData();
  console.log('🚀 First-Penguins 웹 전용 백엔드가 포트', PORT, '에서 실행 중입니다.');
  console.log('🌐 프로덕션 환경에서 동작 중');
  console.log('📊 Goal-Illa와 연동 가능한 웹 전용 백엔드');
  console.log('📋 사용 가능한 API:');
  console.log('   POST /login - 로그인');
  console.log('   POST /register - 회원가입');
  console.log('   GET /api/items?userId=xxx - 사용자 목표 조회');
  console.log('   GET /check-id?id=xxx - 아이디 중복 체크');
  console.log('   GET /dev/status - 서버 상태 확인');
});
