import { IsNotEmpty, IsString, Length } from 'class-validator'

export class ModifyUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 15)
    userNickName: string
}
