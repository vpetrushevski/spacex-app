import { AccountDetailsObject } from "./account.model";

export class LoginRequestObject {
  constructor(
    public email: string = '',
    public password: string = ''
  ) {}
}

export class LoginResponseObject {
  constructor(
    public accessToken: string = '',
    public refreshToken: string = '',
    public account: AccountDetailsObject = new AccountDetailsObject()
  ) {}
}

export class VerifyAccountRequestObject {
  constructor(
    public accountId: string = '',
    public token: string = ''
  ) {}
}

export class RefreshTokenRequestObject {
  constructor(
    public accessToken: string = '',
    public refreshToken: string = ''
  ) {}
}

export class LogoutRequestObject {
  constructor(
    public refreshToken: string = ''
  ) {}
}

export class AuthenticateErrorResponseObject {
  constructor(
    public title: string = '',
    public info: string = ''
  ) {}
}

export class ResetPasswordRequestObject {
  constructor(
    public accountId: string = '',
    public resetPasswordToken: string = '',
    public newPassword: string = ''
  ) {}
}

export class ChangePasswordRequestObject {
  constructor(
    public currentPassword: string = '',
    public newPassword: string = ''
  ) {}
}
