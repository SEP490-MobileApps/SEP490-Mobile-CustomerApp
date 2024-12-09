export interface OrderDetail {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  purchaseTime: string;
  status: boolean;
  fileUrl: string;
  orderCode: number;
  customer: any;
  orderDetails: OrderDetail[];
}

