import { Test, TestingModule } from '@nestjs/testing';
import { UserssController } from './userss.controller';
import { UserssService } from './userss.service';

describe('UserssController', () => {
  let controller: UserssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserssController],
      providers: [UserssService],
    }).compile();

    controller = module.get<UserssController>(UserssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
