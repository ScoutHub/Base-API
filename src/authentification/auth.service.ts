import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from './auth.interface';
import { User } from 'src/users/user.model';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from './interfaces/token.interface';
import { RegisterState } from './enums/register-state.enum';
import { RefreshTokenService } from './services/refresh-token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(auth: Auth): Promise<Token | string> {
    const user: User = await this.userService.findOneByUsername(auth.username);
    if (user && (await bcrypt.compare(auth.password, user.password))) {
      return await this.generateToken(user);
    }
    return 'Wrong email / password';
  }

  async register(createUserDto: CreateUserDto): Promise<Token | RegisterState> {
    const registerState: User | RegisterState =
      await this.userService.new(createUserDto);
    if (registerState instanceof User) {
      return await this.generateToken(registerState);
    }
    return registerState;
  }

  async generateNewAccessToken(token: string): Promise<Token | string> {
    const payload = await this.refreshTokenService.verifyRefreshToken(token);

    try {
      const user: User = await this.userService.findOneById(payload.sub);
      const newToken: Token = await this.generateToken(user);
      return newToken;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token', e);
    }
  }

  private async generateToken(user: User): Promise<Token> {
    const payload = { sub: user.id, username: user.username };
    const access_token: string = await this.jwtService.signAsync(payload);
    const refresh_token: string =
      await this.refreshTokenService.generateRefreshToken(payload);
    user.save();
    return new Token(access_token, refresh_token, user.username, user.id);
  }
}
