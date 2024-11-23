// models/User.ts
export interface User {
  accountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: string;
  apartmentAvatarUrl?: string;
  apartmentName: string;
  apartmentAddress: string;
  roomId: string;
  cmT_CCCD: string;
  areaId: string;
  password?: string;
}
