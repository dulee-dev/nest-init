import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserssService } from './userss.service';
import { CreateUserssDto } from './dto/create-userss.dto';
import { UpdateUserssDto } from './dto/update-userss.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('userss')
export class UserssController {
  constructor(
    private readonly authService: AuthService,
    private readonly userssService: UserssService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findAll() {
    return this.userssService.findAll();
  }

  @Post()
  create(@Body() createUserssDto: CreateUserssDto) {
    return this.userssService.create(createUserssDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userssService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserssDto: UpdateUserssDto) {
    return this.userssService.update(+id, updateUserssDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userssService.remove(+id);
  }
}
