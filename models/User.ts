// models/User.ts
export interface User {
  accountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: string;
}
