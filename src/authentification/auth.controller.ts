import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth.interface';
import { User } from 'src/users/user.model';
import { Response } from 'express';
import { LoginState } from '../enums/login-state.enum';
import { Token } from '../interfaces/token.interface';
import { RegisterState } from 'src/enums/register-state.enum';

@Controller('/auth')
export class AuthController {
  private statusToReturn: number;

  constructor(private authService: AuthService) {}

  @Post('/login')
  @Header('Content-Type', 'application/json')
  async login(
    @Body() auth: Auth,
    @Res() response: Response,
  ): Promise<Response> {
    const loginState: Token | LoginState = await this.authService.login(auth);
    this.statusToReturn = 200;
    if (!(loginState instanceof Token)) this.statusToReturn = 404;
    return response.status(this.statusToReturn).send({
      response: loginState,
      status: this.statusToReturn,
    });
  }

  @Post('/register')
  @Header('Content-Type', 'application/json')
  async register(
    @Body() user: User,
    @Res() response: Response,
  ): Promise<Response> {
    const registerState: Token | RegisterState =
      await this.authService.register(user);
    this.statusToReturn = 201;
    if (!(registerState instanceof Token)) this.statusToReturn = 409;
    return response.status(this.statusToReturn).send({
      response: registerState,
      status: this.statusToReturn,
    });
  }
}
