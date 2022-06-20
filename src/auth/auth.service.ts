import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 토큰 발급
  signIn(userIdx: number, userId: string, userPwVersion: number): string {
    return this.jwtService.sign({ userIdx, userId, userPwVersion });
  }
}
