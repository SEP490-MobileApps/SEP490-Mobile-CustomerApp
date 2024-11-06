// models/ServicePackage.ts
export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  imageUrl: any; // Nếu bạn đang sử dụng require cho ảnh, hãy dùng kiểu 'any' cho imageUrl
  description: string; // Thêm thuộc tính mô tả
  policy: string; // Thêm thuộc tính chính sách
  servicesList: string; // Thêm thuộc tính danh sách dịch vụ
  purchaseTime: string;
}
