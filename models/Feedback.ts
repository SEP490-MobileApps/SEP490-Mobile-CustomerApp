// models/Feedback.ts
export interface Feedback {
  feedbackId: string,
  customerName: string,
  customerEmail: string,
  avatarUrl: string,
  content: string,
  rate: number,
  status: boolean
  averageRate: number;
  count: number;
  requestId: string;
}