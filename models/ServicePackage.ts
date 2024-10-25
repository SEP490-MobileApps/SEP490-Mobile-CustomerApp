export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  imageUrl: any; // Nếu bạn đang sử dụng require cho ảnh, hãy dùng kiểu 'any' cho imageUrl
}
