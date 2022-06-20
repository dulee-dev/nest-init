import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemptService } from './tempt.service';
import { CreateTemptDto } from './dto/create-tempt.dto';
import { UpdateTemptDto } from './dto/update-tempt.dto';

@Controller('tempt')
export class TemptController {
  constructor(private readonly temptService: TemptService) {}

  @Post()
  create(@Body() createTemptDto: CreateTemptDto) {
    return this.temptService.create(createTemptDto);
  }

  @Get()
  findAll() {
    return this.temptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemptDto: UpdateTemptDto) {
    return this.temptService.update(+id, updateTemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temptService.remove(+id);
  }
}
