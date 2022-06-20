import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { IsNull } from 'typeorm'

export class CreateUserDto {
    @IsEmail()
    userId: string

    userPw?: string

    @IsString()
    @Length(2, 15)
    userNickName: string

    @IsString()
    ph: string

    @IsString()
    addr1: string

    @IsString()
    addr2: string

    naverToken?: string
    
    authType?: number
}
