// Toss Payments API types

export interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface CancelParams {
  cancelReason: string;
  cancelAmount?: number;
}

export interface BillingKeyParams {
  customerKey: string;
  authKey: string;
}

export interface BillingPayParams {
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
}

export interface TossPayment {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  totalAmount: number;
  method: string;
  receipt: { url: string } | null;
  approvedAt: string;
  cancels?: TossCancel[];
}

export interface TossCancel {
  cancelAmount: number;
  cancelReason: string;
  canceledAt: string;
}

export interface BillingKeyResponse {
  billingKey: string;
  customerKey: string;
  cardCompany: string;
  cardNumber: string;
}

export interface TossErrorResponse {
  code: string;
  message: string;
}

export class TossPaymentError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'TossPaymentError';
  }
}
