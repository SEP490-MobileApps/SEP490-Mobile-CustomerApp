import { Feedback } from './Feedback';
export interface RepairRequest {
  requestId: string;
  leaderId: string;
  customerId: string;
  contractId?: string;
  roomId: string;
  start: string;
  end?: string;
  customerProblem: string;
  conclusion?: string;
  status: number;
  categoryRequest: number;
  purchaseTime?: string;
  totalPrice?: number;
  fileUrl: string;
  orderCode?: number;
  isOnlinePayment: boolean;
  feedback?: Feedback[];
}
