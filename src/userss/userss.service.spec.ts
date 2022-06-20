import { Test, TestingModule } from '@nestjs/testing';
import { UserssService } from './userss.service';

describe('UserssService', () => {
  let service: UserssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserssService],
    }).compile();

    service = module.get<UserssService>(UserssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
