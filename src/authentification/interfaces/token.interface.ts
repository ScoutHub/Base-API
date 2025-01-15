export class Token {
  acces_token: string;
  refresh_token: string;
  username: string;
  sub: string;

  constructor(
    token: string,
    refresh_token: string,
    username: string,
    userId: string,
  ) {
    this.acces_token = token;
    this.refresh_token = refresh_token;
    this.username = username;
    this.sub = userId;
  }
}
