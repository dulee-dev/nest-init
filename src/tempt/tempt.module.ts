import { Module } from '@nestjs/common';
import { TemptService } from './tempt.service';
import { TemptController } from './tempt.controller';

@Module({
  controllers: [TemptController],
  providers: [TemptService]
})
export class TemptModule {}
