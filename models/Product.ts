// models/Product.ts
export interface Product {
  productId: string;
  name: string;
  description: string;
  imageUrl: string;
  inOfStock: number;
  warantyMonths: number;
  status: boolean;
  priceByDate: number;
}
