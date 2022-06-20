import { Test, TestingModule } from '@nestjs/testing';
import { TemptService } from './tempt.service';

describe('TemptService', () => {
  let service: TemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemptService],
    }).compile();

    service = module.get<TemptService>(TemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
