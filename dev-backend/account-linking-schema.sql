-- First-Penguins와 Goal-Illa 계정 연동을 위한 데이터베이스 스키마
-- 나중에 통합할 때 사용할 SQL 스크립트

-- 계정 연동 테이블
CREATE TABLE account_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstpenguins_user_id VARCHAR(50) NOT NULL,
    goalilla_user_id VARCHAR(50) NOT NULL,
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_firstpenguins (firstpenguins_user_id),
    UNIQUE KEY unique_goalilla (goalilla_user_id)
);

-- First-Penguins 사용자 테이블 (웹 전용)
CREATE TABLE firstpenguins_users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    birth_date DATE,
    age INT,
    guardian_agreement TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Goal-Illa 사용자 테이블 (앱 전용)
CREATE TABLE goalilla_users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    birth_date DATE,
    age INT,
    guardian_agreement TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 계정 연동 API를 위한 뷰
CREATE VIEW linked_accounts AS
SELECT 
    al.id as link_id,
    al.linked_at,
    al.is_active,
    fp.id as firstpenguins_id,
    fp.email as firstpenguins_email,
    fp.name as firstpenguins_name,
    gi.id as goalilla_id,
    gi.email as goalilla_email,
    gi.name as goalilla_name
FROM account_links al
JOIN firstpenguins_users fp ON al.firstpenguins_user_id = fp.id
JOIN goalilla_users gi ON al.goalilla_user_id = gi.id
WHERE al.is_active = TRUE;
