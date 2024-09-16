import { AuthError } from 'next-auth';

export class CustomAuthError extends AuthError  {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidEmailPasswordError extends AuthError {
    static type = "Email/Passwprd không hợp lệ." 
  }

  export class InActiveAccount extends AuthError {
    static type = "Tài khoản chưa được kích hoạt."
  }