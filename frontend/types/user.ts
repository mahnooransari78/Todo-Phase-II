export interface UserBase {
  email: string;
  name: string;
}

export interface UserRead extends UserBase {
  id: string;
  email_verified: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  last_login?: string; // ISO date string
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  success: boolean;
  user: UserRead;
  token: string;
}

export interface UserRegisterResponse {
  success: boolean;
  user: UserRead;
  token: string;
}