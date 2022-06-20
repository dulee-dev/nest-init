import { Injectable, Get } from '@nestjs/common';
@Injectable()
export class AppService {
  @Get()
  getHello(): string {
    console.log(process.env.JWT_SECRET);
    return 'Hello World!';
  }
}
