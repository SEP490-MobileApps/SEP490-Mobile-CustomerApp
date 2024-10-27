// models/Product.ts

export interface Product {
  ProductId: string;
  Name: string;
  Description: string;
  ImageUrl: string;
  In_Of_Stock: number;
  WarrantyMonths: number;
  Status: boolean;
  Price: number; // Thêm thuộc tính price để gộp thông tin từ ProductPrices
}
