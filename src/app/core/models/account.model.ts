export class AccountDetailsObject {
  constructor(
    public id: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public email: string = ''
  ) {}
}

export class CreateAccountRequestObject {
  constructor(
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public password: string = ''
  ) {}
}
