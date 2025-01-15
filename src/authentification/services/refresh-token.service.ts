import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
  private readonly refreshTokenOption: object = {
    secret: process.env.JWT_REFRESH_TOKEN,
    expiresIn: '30d',
  };
  constructor(private readonly jwtService: JwtService) {}

  async generateRefreshToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, this.refreshTokenOption);
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, this.refreshTokenOption);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token', e);
    }
  }
}
