// models/Order.ts
export interface Order {
  id: number;
  productCount: number;
  purchaseTime: string;
  price: string;
  imageUrl?: string;
}
