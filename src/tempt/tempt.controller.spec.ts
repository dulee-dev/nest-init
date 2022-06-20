import { Test, TestingModule } from '@nestjs/testing';
import { TemptController } from './tempt.controller';
import { TemptService } from './tempt.service';

describe('TemptController', () => {
  let controller: TemptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemptController],
      providers: [TemptService],
    }).compile();

    controller = module.get<TemptController>(TemptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
