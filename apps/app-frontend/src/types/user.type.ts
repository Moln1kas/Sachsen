export default interface User {
  id: number;
  email?: string;
  username: string;
  role: string;
  isEmailVerified?: boolean;
  status: UserStatus;
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BANNED = 'BANNED'
}