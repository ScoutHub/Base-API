import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../users/services/user.service';
import { UserModule } from '../users/user.module';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, RefreshTokenService],
})
export class AuthModule {}
