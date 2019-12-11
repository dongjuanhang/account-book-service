export interface IResponse<T> {
  errorCode?: number;
  message?: string;
  success?: boolean;
  data?: T;
}
