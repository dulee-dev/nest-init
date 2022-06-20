import { Injectable } from '@nestjs/common';
import { CreateUserssDto } from './dto/create-userss.dto';
import { UpdateUserssDto } from './dto/update-userss.dto';

@Injectable()
export class UserssService {
  create(createUserssDto: CreateUserssDto) {
    return 'This action adds a new userss';
  }

  findAll() {
    return `This action returns all userss`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userss`;
  }

  update(id: number, updateUserssDto: UpdateUserssDto) {
    return `This action updates a #${id} userss`;
  }

  remove(id: number) {
    return `This action removes a #${id} userss`;
  }
}
