# 토스페이먼츠 설정 가이드

## 1. 가맹점 등록

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)에 접속
2. 회원가입 후 **테스트 상점** 자동 생성
3. 실제 서비스 시에는 **사업자 인증** → **심사 신청** 필요

## 2. 테스트 키 복사

**개발자센터** → **API 키** 페이지:

| 항목 | 환경변수 | 예시 |
|------|---------|------|
| 클라이언트 키 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` | `test_ck_xxx...` |
| 시크릿 키 | `TOSS_SECRET_KEY` | `test_sk_xxx...` |

> ⚠️ `test_` 접두사가 붙은 키는 테스트 환경용입니다. 운영 시 `live_` 키로 교체하세요.

### 테스트 카드 정보

| 항목 | 값 |
|------|-----|
| 카드번호 | `4330000000000002` |
| 유효기간 | 미래 아무 날짜 |
| CVC | 아무 3자리 |
| 비밀번호 | 아무 2자리 |

## 3. 웹훅 URL 설정

**개발자센터** → **웹훅** → **웹훅 엔드포인트 추가**:

```
https://your-domain.com/api/payment/webhook
```

### 수신할 이벤트

- `PAYMENT_STATUS_CHANGED` — 결제 상태 변경
- `BILLING_KEY_STATUS_CHANGED` — 빌링키 상태 변경 (구독 결제용)

### 로컬 개발 시 웹훅 테스트

로컬에서는 웹훅을 직접 수신할 수 없으므로 터널링 도구를 사용합니다:

```bash
# ngrok 사용
npx ngrok http 3000

# 출력된 URL을 웹훅 엔드포인트로 등록
# https://xxxx.ngrok-free.app/api/payment/webhook
```

## 4. 결제 플로우

```
사용자 → PaymentButton 클릭
  → 토스 결제창 팝업
  → 결제 완료 → /payment/success?paymentKey=...&orderId=...&amount=...
  → Server Action에서 토스 API로 결제 승인 (confirm)
  → DB에 결제 기록 저장
  → /payment/complete 리다이렉트
```

## 5. 구독 결제

구독 결제는 빌링키 방식을 사용합니다:

1. 사용자가 카드 등록 → 빌링키 발급
2. 매월 자동 결제 (서버에서 빌링키로 결제 요청)
3. 구독 취소 시 빌링키 삭제

자세한 구현은 `packages/payment/src/toss/billing.ts`를 참고하세요.
