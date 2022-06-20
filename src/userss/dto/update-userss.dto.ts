import { PartialType } from '@nestjs/mapped-types';
import { CreateUserssDto } from './create-userss.dto';

export class UpdateUserssDto extends PartialType(CreateUserssDto) {}
