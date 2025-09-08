// First-Penguins 웹 전용 백엔드 프로덕션 설정
export const productionConfig = {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'firstpenguins-web-secret-key-2024',
  
  // CORS 설정
  ALLOWED_ORIGINS: [
    'https://firstpenguins.com',
    'https://www.firstpenguins.com',
    'https://firstpenguins.netlify.app',
    'https://firstpenguins.vercel.app'
  ],
  
  // 개발자 계정 정보
  DEV_ACCOUNT: {
    ID: 'goalilla',
    EMAIL: 'goalilla@firstpenguins.com',
    PASSWORD: 'goalilla23'
  },
  
  // 로그 설정
  LOG_LEVEL: 'info'
};
