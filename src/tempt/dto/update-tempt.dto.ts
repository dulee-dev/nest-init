import { PartialType } from '@nestjs/mapped-types';
import { CreateTemptDto } from './create-tempt.dto';

export class UpdateTemptDto extends PartialType(CreateTemptDto) {}
