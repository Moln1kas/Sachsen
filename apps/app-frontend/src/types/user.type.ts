export default interface User {
  id: number;
  email?: string;
  username: string;
  role: string;
  isEmailVerified?: boolean;
  status: UserStatus;
  isOnline: boolean;
}

export interface Users {
  total: number,
  page: number,
  limit: number,
  users: User[],
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BANNED = 'BANNED'
}