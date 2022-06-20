import { Injectable } from '@nestjs/common';
import { CreateTemptDto } from './dto/create-tempt.dto';
import { UpdateTemptDto } from './dto/update-tempt.dto';

@Injectable()
export class TemptService {
  create(createTemptDto: CreateTemptDto) {
    return 'This action adds a new tempt';
  }

  findAll() {
    return `This action returns all tempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tempt`;
  }

  update(id: number, updateTemptDto: UpdateTemptDto) {
    return `This action updates a #${id} tempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} tempt`;
  }
}
