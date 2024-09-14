import { Injectable } from '@nestjs/common';
import { Auth } from './auth.interface';
import { User } from 'src/users/user.model';
import { UserService } from '../users/user.service';
import { LoginState } from '../enums/login-state.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../interfaces/token.interface';
import { RegisterState } from '../enums/register-state.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(auth: Auth): Promise<Token | LoginState> {
    const user: User = await this.userService.findOneByEmail(auth.email);
    if (user) {
      const isMatch = await bcrypt.compare(auth.password, user.password);
      if (!isMatch) return LoginState.WrongMatch;

      return await this.generateToken(user);
    }
    return LoginState.NotFound;
  }

  async register(user: User): Promise<Token | RegisterState> {
    const registerState: User | RegisterState =
      await this.userService.new(user);
    if (registerState instanceof User) {
      return await this.generateToken(registerState);
    }
    return registerState;
  }

  private async generateToken(user: User): Promise<Token> {
    const payload = { userId: user.id, email: user.email };
    const access_token: string = await this.jwtService.signAsync(payload);
    return new Token(access_token, user.email, user.id);
  }
}
