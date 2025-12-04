export interface User {
  id: number | string;
  email?: string;
  username?: string;
  name?: string;
  [key: string]: any;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}
