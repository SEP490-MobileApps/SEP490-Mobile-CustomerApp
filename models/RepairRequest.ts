// models/RepairRequest.ts
export type RequestStatus = 'requested' | 'processing' | 'done' | 'canceled';
export type RequestCategory = 'pay' | 'free';

export interface RepairRequest {
  requestId: string;
  leaderId: string;
  customerId: string;
  contractId?: string; // Có thể null
  roomId: string;
  start: string; // ISO format datetime string
  end?: string; // Có thể null
  customerProblem: string;
  conclusion?: string; // Có thể null
  status: RequestStatus;
  categoryRequest: RequestCategory;
  purchaseTime?: string; // Có thể null
  totalPrice?: number; // Có thể null
  fileUrl?: string; // Có thể null
  orderCode?: number; // Có thể null
  isOnlinePayment: boolean;
}
