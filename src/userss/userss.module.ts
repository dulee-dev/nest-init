import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserssService } from './userss.service';
import { UserssController } from './userss.controller';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [UserssController],
  providers: [UserssService],
})
export class UserssModule {}
