export type DBResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};