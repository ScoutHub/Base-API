export class Token {
  acces_token: string;
  refresh_token: string;
  email: string;
  userId: string;

  constructor(
    token: string,
    refresh_token: string,
    email: string,
    userId: string,
  ) {
    this.acces_token = token;
    this.refresh_token = refresh_token;
    this.email = email;
    this.userId = userId;
  }
}
