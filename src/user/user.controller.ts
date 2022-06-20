import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthGuard } from '../middleware/auth';
import { ModifyUserDto } from './dto/modify-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseJson, RetMsg } from 'src/types/shared';
import { Token, TokenData } from 'src/libs/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id/dup')
  async idDupChck(@Query('userId') userId): Promise<ResponseJson> {
    return new ResponseJson({
      isDupId: await this.userService.idDupChck(userId),
    });
  }

  @Get('nick-name/dup')
  async nickNameDupChck(
    @Query('userNickName') userNickName,
  ): Promise<ResponseJson> {
    return new ResponseJson({
      isDupNickName: await this.userService.nickNameDupChck(userNickName),
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async chckUserToken(@Token() user): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );

    const { userIdx, userId } = user;

    const { userNickName, isNaverLinked } = await this.userService.getUserInfo(
      userIdx,
    );

    return new ResponseJson({
      userId,
      userNickName,
      isNaverLinked,
    });
  }

  @Post()
  async addUser(@Body() createUserDto: CreateUserDto): Promise<ResponseJson> {
    await this.userService.addUser(createUserDto);

    return new ResponseJson();
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(@Token() user: TokenData, @Body() updateUserDto) {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    const updateUser = await this.userService.updateUser(user, updateUserDto);
    return new ResponseJson();
  }

  @Put()
  @UseGuards(AuthGuard)
  async modifyUser(
    @Token() user,
    @Body() modifyUserDto: ModifyUserDto,
  ): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );

    await this.userService.modifyUser(user.userIdx, modifyUserDto.userNickName);

    return new ResponseJson();
  }

  @Post('sign-in')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<ResponseJson> {
    try {
      return new ResponseJson({
        accessToken: await this.userService.signIn(signInUserDto),
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        Logger.error(e);
        throw new HttpException(
          RetMsg.UNKNOWN_ERR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('find/pw')
  async findPw(@Body('userId') userId): Promise<ResponseJson> {
    await this.userService.findPw(userId);
    return new ResponseJson();
  }

  @Patch('pw')
  @UseGuards(AuthGuard)
  async modifyPw(
    @Token() user: TokenData,
    @Body('pw') pw: string,
  ): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );

    return new ResponseJson({
      accessToken: await this.userService.modifyPw(
        user.userIdx,
        user.userId,
        pw,
      ),
    });
  }

  @Patch('naver')
  @UseGuards(AuthGuard)
  async connectNaverSignIn(
    @Token() user: TokenData,
    @Body('token') token: string,
  ): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );

    await this.userService.connectNaverSignIn(user.userIdx, token);

    return new ResponseJson();
  }

  // user
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseJson> {
    return new ResponseJson(await this.userService.update(+id, updateUserDto));
  }

  pwReset;
  @Get('pw')
  async findEmailTrue(@Query('userEmail') userEmail: string): Promise<string> {
    return await this.userService.findEmailTrue(userEmail);
  }

  @Post('pw')
  async pwCodeVali(@Body('userEmail') userEmail: string) {
    return await this.userService.pwCodeVali(userEmail);
  }

  @Get('pw/code')
  async pwCodeVerif(
    @Query('resetToken') resetToken: string,
    @Query('newCode') newCode: string,
  ) {
    return new ResponseJson(
      await this.userService.pwCodeVerif(resetToken, +newCode),
    );
  }

  @Get('find')
  async findExistEmail(@Query('userEmail') userEmail: string): Promise<number> {
    return await this.userService.findExistEmail(userEmail);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@Token() user): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    const userExist = await this.userService.findMe(user.userIdx);
    return new ResponseJson(userExist);
  }

  @Get('me/nick-dup')
  @UseGuards(AuthGuard)
  async checkMyNickDup(
    @Token() user: TokenData,
    @Query('userNickName') newUserNickName,
  ): Promise<ResponseJson> {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    return new ResponseJson({
      isDupNickName: await this.userService.checkMyNickDup(
        user.userIdx,
        newUserNickName,
      ),
    });
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  async removeMe(@Token() user: TokenData) {
    if (!user)
      throw new HttpException(
        '토큰 정보가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    return new ResponseJson(this.userService.removeMe(user.userIdx));
  }
}
