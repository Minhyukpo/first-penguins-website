// First-Penguins와 Goal-Illa 계정 연동 API
// 나중에 통합할 때 사용할 API 엔드포인트들

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// 계정 연동 요청 API
router.post('/link-account', async (req, res) => {
  try {
    const { firstpenguinsUserId, goalillaUserId, goalillaPassword } = req.body;
    
    // Goal-Illa 계정 비밀번호 확인
    const goalillaUser = await verifyGoalillaUser(goalillaUserId, goalillaPassword);
    if (!goalillaUser) {
      return res.status(401).json({
        success: false,
        message: 'Goal-Illa 계정 정보가 올바르지 않습니다.'
      });
    }
    
    // 계정 연동 생성
    const linkResult = await createAccountLink(firstpenguinsUserId, goalillaUserId);
    
    res.json({
      success: true,
      message: '계정이 성공적으로 연동되었습니다.',
      linkId: linkResult.id
    });
  } catch (error) {
    console.error('계정 연동 오류:', error);
    res.status(500).json({
      success: false,
      message: '계정 연동 중 오류가 발생했습니다.'
    });
  }
});

// 연동된 계정으로 Goal-Illa 로그인 API
router.post('/login-with-firstpenguins', async (req, res) => {
  try {
    const { firstpenguinsUserId, firstpenguinsPassword } = req.body;
    
    // First-Penguins 계정 확인
    const firstpenguinsUser = await verifyFirstPenguinsUser(firstpenguinsUserId, firstpenguinsPassword);
    if (!firstpenguinsUser) {
      return res.status(401).json({
        success: false,
        message: 'First-Penguins 계정 정보가 올바르지 않습니다.'
      });
    }
    
    // 연동된 Goal-Illa 계정 찾기
    const linkedAccount = await findLinkedGoalillaAccount(firstpenguinsUserId);
    if (!linkedAccount) {
      return res.status(404).json({
        success: false,
        message: '연동된 Goal-Illa 계정이 없습니다. 먼저 계정을 연동해주세요.'
      });
    }
    
    // Goal-Illa JWT 토큰 생성
    const goalillaToken = jwt.sign(
      { 
        userId: linkedAccount.goalilla_user_id,
        email: linkedAccount.goalilla_email,
        linkedFrom: 'firstpenguins'
      }, 
      process.env.GOALILLA_JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'First-Penguins 계정으로 Goal-Illa에 로그인되었습니다.',
      token: goalillaToken,
      user: {
        id: linkedAccount.goalilla_user_id,
        email: linkedAccount.goalilla_email,
        name: linkedAccount.goalilla_name,
        linkedFrom: 'firstpenguins'
      }
    });
  } catch (error) {
    console.error('연동 로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    });
  }
});

// 연동 상태 확인 API
router.get('/link-status/:firstpenguinsUserId', async (req, res) => {
  try {
    const { firstpenguinsUserId } = req.params;
    
    const linkStatus = await getAccountLinkStatus(firstpenguinsUserId);
    
    res.json({
      success: true,
      isLinked: !!linkStatus,
      linkedAccount: linkStatus ? {
        goalillaUserId: linkStatus.goalilla_user_id,
        linkedAt: linkStatus.linked_at
      } : null
    });
  } catch (error) {
    console.error('연동 상태 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '연동 상태 확인 중 오류가 발생했습니다.'
    });
  }
});

// 계정 연동 해제 API
router.delete('/unlink-account/:firstpenguinsUserId', async (req, res) => {
  try {
    const { firstpenguinsUserId } = req.params;
    
    await unlinkAccount(firstpenguinsUserId);
    
    res.json({
      success: true,
      message: '계정 연동이 해제되었습니다.'
    });
  } catch (error) {
    console.error('계정 연동 해제 오류:', error);
    res.status(500).json({
      success: false,
      message: '계정 연동 해제 중 오류가 발생했습니다.'
    });
  }
});

// 헬퍼 함수들
async function verifyGoalillaUser(userId, password) {
  // Goal-Illa 데이터베이스에서 사용자 확인
  // 실제 구현 시 Goal-Illa API 호출 또는 직접 DB 조회
  return null; // 임시
}

async function verifyFirstPenguinsUser(userId, password) {
  // First-Penguins 데이터베이스에서 사용자 확인
  return null; // 임시
}

async function createAccountLink(firstpenguinsUserId, goalillaUserId) {
  // 계정 연동 테이블에 레코드 생성
  return { id: 'link-123' }; // 임시
}

async function findLinkedGoalillaAccount(firstpenguinsUserId) {
  // 연동된 Goal-Illa 계정 찾기
  return null; // 임시
}

async function getAccountLinkStatus(firstpenguinsUserId) {
  // 연동 상태 확인
  return null; // 임시
}

async function unlinkAccount(firstpenguinsUserId) {
  // 계정 연동 해제
  return true; // 임시
}

export default router;
