export interface User {
  accountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: string;
  password?: string;
  apartmentAvatarUrl: string;
  apartmentName: string;
  apartmentAddress: string;
  areaId: string;
}
