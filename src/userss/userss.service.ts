import { AuthService } from './../auth/auth.service';
import { Userss } from './entities/userss.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserssDto } from './dto/create-userss.dto';
import { UpdateUserssDto } from './dto/update-userss.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserssService {
  constructor(
    @InjectRepository(Userss)
    private readonly userssRepository: Repository<Userss>,
    private readonly authService: AuthService,
  ) {}

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
