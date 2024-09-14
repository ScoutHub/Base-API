export class Token {
  token: string;
  email: string;
  userId: string;

  constructor(token: string, email: string, userId: string) {
    this.token = token;
    this.email = email;
    this.userId = userId;
  }
}
