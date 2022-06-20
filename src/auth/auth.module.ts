import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { secret } from '../secret/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret,
      // 토큰 만료 시간 30일
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
