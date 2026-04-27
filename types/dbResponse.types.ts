export type DBResponse<T = any, M = null> = {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: M | null;
};