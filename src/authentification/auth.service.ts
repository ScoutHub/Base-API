import { Injectable } from '@nestjs/common';
import { Auth } from './auth.interface';
import { User } from 'src/users/user.model';
import { UserService } from '../users/user.service';
import { LoginState } from '../enums/login.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from '../users/user-info.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(auth: Auth): Promise<UserInfo | LoginState> {
    const user: User = await this.userService.findOneByEmail(auth.email);
    if (user) {
      const isMatch = await bcrypt.compare(auth.password, user.password);
      if (!isMatch) return LoginState.WrongMatch;

      const payload = { userId: user.id, email: user.email };
      const access_token: string = await this.jwtService.signAsync(payload);

      return new UserInfo(access_token, user.email, user.id);
    }
    return LoginState.NotFound;
  }

  async register(user: User): Promise<User | string> {
    return await this.userService.new(user);
  }
}
