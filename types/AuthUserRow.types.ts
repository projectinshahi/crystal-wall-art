export type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  phone: string;
  role: {
    id: string;
    name: string;
  };

  profile: {
    user_name: string | null;
    avatarUrl: string | null;
    first_name: string | null;
    last_name:  string | null;
  };
};

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export type UserRole = 'admin' | 'user';