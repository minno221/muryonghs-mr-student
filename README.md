# muryonghs-mr-student

프로토타입: 학교 양심우산 예약 시스템 + 랜딩 템플릿

- 관리자 코드(프로토타입): 3587 (초기값, 운영시 변경 권장)
- eventActive 기본값: false (행사 미실시 -> 관리자만 접근 가능)
- hold 시간: 5분
- 학생은 선점 후 직접 취소 가능
- 반납은 관리자만 가능
- inspection 모드: 관리자만 설정/해제 가능; 설정 시 해당 우산의 CONFIRMED 예약은 자동으로 반납 처리

로컬 실행 방법

1. 레포 클론

```bash
git clone https://github.com/minno221/muryonghs-mr-student.git
cd muryonghs-mr-student
```

2. 의존성 설치

```bash
npm install
```

3. 환경변수 복사

```bash
cp .env.example .env
```

4. Prisma 생성 & 시드

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. 개발 서버

```bash
npm run dev
```

관리자 사용

- 관리자용 API 호출 시 HTTP 헤더 `x-admin-code: 3587` 를 사용하거나, /admin/ui 에서 인증번호로 로그인하세요.

배포

- Vercel에 연결해 배포할 수 있습니다. 운영 시 ADMIN_CODE와 DATABASE_URL을 안전하게 환경변수로 설정하세요.
