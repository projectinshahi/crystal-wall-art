export type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
  status: string;

  role: {
    id: string;
    name: string;
  };

  profile: {
    fullName: string | null;
    avatarUrl: string | null;
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