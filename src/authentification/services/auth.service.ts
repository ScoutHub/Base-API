import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { UserService } from '../../users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../interfaces/token.interface';
import { UserValidationStatus } from '../../utils/enums/user-validation-status';
import { RefreshTokenService } from './refresh-token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from '../dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<Token | string> {
    const user: User = await this.userService.findOneByUsername(
      loginDto.username,
    );
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return await this.generateToken(user);
    }
    return 'Wrong email / password';
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Token | UserValidationStatus> {
    const registerState: User | UserValidationStatus =
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
