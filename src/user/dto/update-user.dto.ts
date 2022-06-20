import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entity/user.entity';

export class UpdateUserDto extends PartialType(
    PickType(User, [ 'userPw', 'userNickName', 'ph', 'addr1', 'addr2'])
) {}