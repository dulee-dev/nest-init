import { jwtConstant } from './../secret/jwt';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstant.secret,
      // 토큰 만료 시간 30일
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
