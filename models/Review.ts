import { ImageSourcePropType } from 'react-native';

export interface Review {
  id: string;
  userName: string;
  avatarUrl: ImageSourcePropType;
  rating: number;
  comment: string;
}
