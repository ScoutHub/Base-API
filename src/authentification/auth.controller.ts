import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth.interface';
import { User } from 'src/users/user.model';
import { Response } from 'express';
import { LoginState } from '../enums/login.enum';
import { UserInfo } from '../users/user-info.interface';

@Controller('/auth')
export class AuthController {
  private responseMessage: any;
  private statusToReturn: number;

  constructor(private authService: AuthService) {}

  @Post('/login')
  @Header('Content-Type', 'application/json')
  async login(
    @Body() auth: Auth,
    @Res() response: Response,
  ): Promise<Response> {
    const loggedIn: UserInfo | LoginState = await this.authService.login(auth);
    this.statusToReturn = 200;
    if (loggedIn instanceof UserInfo) {
      this.responseMessage = loggedIn;
    } else if (loggedIn == LoginState.NotFound) {
      this.statusToReturn = 404;
      this.responseMessage = LoginState.NotFound;
    } else {
      this.responseMessage = LoginState.WrongMatch;
    }
    return response.status(this.statusToReturn).send({
      response: this.responseMessage,
      status: this.statusToReturn,
    });
  }

  @Post('/register')
  @Header('Content-Type', 'application/json')
  async register(
    @Body() user: User,
    @Res() response: Response,
  ): Promise<Response> {
    const createdUser: User | string = await this.authService.register(user);
    this.statusToReturn = 201;
    if (!(createdUser instanceof User)) this.statusToReturn = 409;
    return response.status(this.statusToReturn).send({
      response: createdUser,
      status: this.statusToReturn,
    });
  }
}
