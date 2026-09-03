export const translations = {
  en: {
    nav: {
      brand: "SEC",
      home: "Home",
      about: "About Me",
      experience: "Career Summary",
      vault: "Confidential Notes",
      contact: "Contact",
      status: "SYSTEM: ONLINE",
    },
    hero: {
      badge: "WEB & ERP DEVELOPER // PORTFOLIO",
      headline: "ERP Web & Automation Developer",
      subtitle: "Douzone ERP 10 System Development & DB Query Optimization Specialist",
      description: "Maximizing productivity through stable & scalable ERP web systems, business logic optimization, and Python-based workflow automation.",
      btnExperience: "View Experience",
      stats: [
        { label: "Core Competency 01", val: "ERP Web Dev & Maintenance", skillIdx: 0 },
        { label: "Core Competency 02", val: "Large Query Optimization", skillIdx: 1 },
        { label: "Core Competency 03", val: "Python Workflow Automation", skillIdx: 2 },
      ],
    },
    about: {
      sectionNum: "01.",
      title: "About Me",
      p1: "Based on practical experience in ERP web development, I implement complex business logic into efficient web systems while maximizing data accuracy and system stability.",
      p2: "With self-driven problem solving and unyielding resilience as my core strengths, I continuously internalize new technologies to build high-quality services.",
      competenciesTitle: "Core Competencies",
      certTitle: "Certifications / Languages",
      starLabels: {
        situation: "When & Where",
        action: "What I Did",
        result: "Result Achieved",
      },
      skills: [
        {
          title: "ERP Web Development & Maintenance",
          star: {
            situation: "Douzone Bizon & Tsys (ERP 10 & SCM module approval integration projects)",
            action: "Engineered workflow-tailored UI layouts and developed robust Java/Oracle server APIs.",
            result: "Streamlined approval workflows, enhanced operational efficiency, and achieved 99%+ system stability."
          }
        },
        {
          title: "Large-Scale Data Query Optimization",
          star: {
            situation: "Douzone Bizon SCM Dev Team (during large transaction data bottleneck issues)",
            action: "Analyzed DB query execution plans, refactored subqueries, and optimized SQL index structures.",
            result: "Significantly accelerated transaction processing speeds and eliminated database bottlenecks."
          }
        },
        {
          title: "Python & Workflow Automation",
          star: {
            situation: "Tsys Development Dept (during repetitive manual data verification tasks)",
            action: "Built automated Python data processing scripts for automatic system sync and parsing.",
            result: "Reduced manual data verification time by over 80% and achieved zero human errors."
          }
        }
      ],
      certs: [
        { name: "Engineer Information Processing (정보처리기사)" },
        { name: "SQLD (SQL Developer)" },
        { name: "TOEIC: 925" },
      ],
      secretBadge: "UNLOCKED",
      secretHint: "Enter password to decrypt verified name and school info.",
      passPlaceholder: "Enter Password",
      unlockBtn: "Unlock",
      relockBtn: "Lock Again",
      wrongPassError: "Invalid password. Decryption failed.",
      nameLabel: "Full Name",
      schoolLabel: "Education",
    },
    experience: {
      sectionNum: "02.",
      title: "Career Summary",
      roles: [
        {
          role: "ERP Web & Automation Development",
          company: "Tsys",
          period: "2024.10 — 2025.10",
          location: "Development Dept.",
          bulletPoints: [
            "Douzone ERP 10 development & maintenance.",
            "ERP & Groupware system integration.",
            "Developed business automation programs using Python.",
          ],
          tools: ["JavaScript", "Java", "Python", "Oracle"],
        },
        {
          role: "ERP Web Development",
          company: "Douzone Bizon",
          period: "2022.02 — 2024.03",
          location: "SCM Dev Team",
          bulletPoints: [
            "ERP 10 SCM module new feature development & maintenance.",
            "E-approval integration and pre/post-processing API development.",
            "Large-scale data processing & query optimization.",
          ],
          tools: ["JavaScript", "Java", "Oracle"],
        },
      ],
    },
    vault: {
      sectionNum: "VLT.",
      title: "Confidential Notes",
      unauthDesc: "Access is strictly controlled via cryptographic Passkeys.",
      registerBtn: "Register Passkey",
      loginBtn: "Sign In",
      authSuccess: "Authentication Successful. Notes Decrypted.",
      authFail: "Authentication Failed or Denied.",
      logoutBtn: "Lock Notes",
      passkeysTitle: "Registered Passkeys",
      deleteBtn: "Delete",
      deleteSuccess: "Passkey revoked.",
      usernamePlaceholder: "Enter username",
      usernameReqReg: "Username is required for registration.",
      usernameReqLog: "Username is required for login.",
      decryptedBadge: "NOTES DECRYPTED",
      regSuccess: "Registration Successful!",
      addDevice: "Add Device",
      noPasskeys: "No passkeys found.",
      currentDeviceBadge: "Active Device",
      cannotDeleteActiveKey: "Cannot delete the passkey currently in use by this session.",
      authenticating: "Authenticating...",
      registering: "Registering...",
      authCancelledOrNoKey: "Authentication failed: No matching Passkey found on this authenticator or request timed out.",
      cancelBtn: "Cancel",
    },
    contact: {
      sectionNum: "03.",
      title: "Contact",
      description: "I am actively open for web & ERP development opportunities. Feel free to contact me via email or social links.",
      emailCopied: "Email address copied to clipboard!",
      clickToCopy: "Click to copy email address",
    },
    footer: {
      status: "WEB & ERP DEVELOPER PORTFOLIO // REACT + TAILWIND",
      rights: "All Rights Reserved.",
    },
  },
  ko: {
    nav: {
      brand: "SEC",
      home: "홈",
      about: "자기소개",
      experience: "경력 요약",
      vault: "기밀 노트",
      contact: "연락처",
      status: "시스템: 정상 작동 중",
    },
    hero: {
      badge: "웹 & ERP 개발자 // 포트폴리오",
      headline: "ERP 웹 & 자동화 개발자",
      subtitle: "더존 ERP 10 시스템 개발 & DB 쿼리 최적화 전문가",
      description: "안정적이고 확장성 있는 ERP 웹 시스템 구축, 비즈니스 로직 최적화, 파이썬 기반 업무 자동화를 통해 생산성을 극대화합니다.",
      btnExperience: "경력 사항 보기",
      stats: [
        { label: "핵심 역량 01", val: "ERP 웹 개발 및 유지보수", skillIdx: 0 },
        { label: "핵심 역량 02", val: "대용량 쿼리 속도 개선", skillIdx: 1 },
        { label: "핵심 역량 03", val: "Python 업무 자동화", skillIdx: 2 },
      ],
    },
    about: {
      sectionNum: "01.",
      title: "자기소개",
      p1: "ERP 웹 개발 분야의 실무 경험을 바탕으로, 복잡한 비즈니스 로직을 효율적인 웹 시스템으로 구현하고 데이터의 정확성과 시스템 안정성을 극대화합니다.",
      p2: "스스로 문제를 해결하는 자기주도성과 포기하지 않는 회복탄력성을 주력으로 삼아, 지속적인 기술 내재화를 통해 완성도 높은 서비스를 개발합니다.",
      competenciesTitle: "핵심 역량",
      certTitle: "자격증 / 어학",
      starLabels: {
        situation: "언제·어디서 있었는가",
        action: "내가 실제로 무엇을 했는가",
        result: "어떤 결과가 생겼는가",
      },
      skills: [
        {
          title: "ERP 웹 개발 및 유지보수",
          star: {
            situation: "더존비즈온 & 티시스 근무 당시 ERP 10 SCM 모듈 및 전자결재 연동 신규 구축 과제 수행 시",
            action: "비즈니스 업무 프로세스 흐름에 맞춘 반응형 UI 화면 구성 및 Java/Oracle 기반 서버 API 개발 및 연동 수행",
            result: "복잡한 결재 프로세스 간소화로 운영 효율성 증대 및 데이터 처리 정확도/시스템 안정성 99% 이상 확보"
          }
        },
        {
          title: "대용량 데이터 쿼리 속도 개선",
          star: {
            situation: "더존비즈온 SCM 개발팀에서 복잡한 대용량 트랜잭션 데이터 처리 지연 및 병목 현상 발생 시",
            action: "연동 쿼리 실행계획 분석, 불필요한 서브쿼리 제거, 인덱스 재구성 및 SQL 구조 리팩토링 진행",
            result: "대용량 트랜잭션 조회 및 처리 속도 대폭 개선, 데이터베이스 병목 현상 해소 및 시스템 응답 속도 향상"
          }
        },
        {
          title: "Python & 업무 자동화",
          star: {
            situation: "티시스 개발부서 근무 시 반복적인 수작업 데이터 수집 및 비교 검증 업무 수행 시",
            action: "Python 기반 셀레니움/데이터 처리 자동화 스크립트 구축 및 시스템 데이터 자동 연동 개발",
            result: "수작업 데이터 검증 시간 80% 이상 단축 및 휴먼 에러 발생률 0건 달성으로 업무 생산성 극대화"
          }
        }
      ],
      certs: [
        { name: "정보처리기사"},
        { name: "SQLD" },
        { name: "TOEIC: 925" },
      ],
      secretBadge: "보안 해제 완료",
      secretHint: "비밀번호를 입력하면 암호화된 성명과 출신 학교가 복호화되어 표시됩니다.",
      passPlaceholder: "비밀번호 입력",
      unlockBtn: "잠금 해제",
      relockBtn: "다시 잠금",
      wrongPassError: "비밀번호가 올바르지 않습니다.",
      nameLabel: "성명",
      schoolLabel: "출신 학교 / 전공",
    },
    experience: {
      sectionNum: "02.",
      title: "경력 요약",
      roles: [
        {
          role: "ERP 웹, 자동화 프로그램 개발",
          company: "티시스",
          period: "2024.10 — 2025.10",
          location: "개발부서",
          bulletPoints: [
            "더존 ERP 10 개발 및 유지보수.",
            "ERP, 그룹웨어 연동.",
            "파이썬 활용한 업무 자동화 프로그램 개발.",
          ],
          tools: ["JavaScript", "Java", "Python", "Oracle"],
        },
        {
          role: "ERP 웹 개발",
          company: "더존비즈온",
          period: "2022.02 — 2024.03",
          location: "SCM 개발팀",
          bulletPoints: [
            "ERP 10 SCM 모듈 신규 개발 및 유지보수.",
            "전자결재 연동 및 전후 처리 API 개발.",
            "대용량 데이터 처리 및 쿼리 개선.",
          ],
          tools: ["JavaScript", "Java", "Oracle"],
        },
      ],
    },
    vault: {
      sectionNum: "VLT.",
      title: "기밀 노트",
      unauthDesc: "암호화된 Passkey를 통해서만 접근이 가능합니다.",
      registerBtn: "Passkey 등록",
      loginBtn: "로그인",
      authSuccess: "인증 성공. 기밀 노트 복호화 완료.",
      authFail: "인증 실패 또는 거부됨.",
      logoutBtn: "노트 잠금",
      passkeysTitle: "등록된 Passkeys",
      deleteBtn: "삭제",
      deleteSuccess: "Passkey가 폐기되었습니다.",
      usernamePlaceholder: "사용자 이름 입력",
      usernameReqReg: "등록을 위해 사용자 이름을 입력해주세요.",
      usernameReqLog: "로그인을 위해 사용자 이름을 입력해주세요.",
      decryptedBadge: "기밀 노트 복호화 완료",
      regSuccess: "Passkey 등록이 완료되었습니다.",
      addDevice: "기기 추가",
      noPasskeys: "등록된 Passkey가 없습니다.",
      currentDeviceBadge: "현재 기기",
      cannotDeleteActiveKey: "현재 로그인에 사용 중인 기기는 삭제할 수 없습니다.",
      authenticating: "인증 대기 중...",
      registering: "등록 대기 중...",
      authCancelledOrNoKey: "인증 실패: 선택된 인증기에 일치하는 Passkey가 없거나 시간 초과되었습니다.",
      cancelBtn: "취소",
    },
    contact: {
      sectionNum: "03.",
      title: "연락처",
      emailCopied: "이메일 주소가 클립보드에 복사되었습니다!",
      clickToCopy: "이메일 주소 복사하기",
    },
    footer: {
      status: "네트워크 보안 포트폴리오 // REACT + TAILWIND",
      rights: "All Rights Reserved.",
    },
  },
};
