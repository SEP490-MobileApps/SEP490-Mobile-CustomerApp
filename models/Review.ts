import { ImageSourcePropType } from 'react-native';

export interface Review {
  id: string;
  userName: string;
  avatarUrl: ImageSourcePropType; // Định kiểu cho ảnh
  rating: number;
  comment: string;
}
