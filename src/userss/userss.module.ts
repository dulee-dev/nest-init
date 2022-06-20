import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserssService } from './userss.service';
import { UserssController } from './userss.controller';
import { Userss } from './entities/userss.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Userss]), AuthModule],
  controllers: [UserssController],
  providers: [UserssService],
})
export class UserssModule {}
