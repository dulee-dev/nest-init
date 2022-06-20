import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configOptions from './app-options/config-options';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.AWS_RDS_HOST,
      port: 3306,
      username: process.env.AWS_RDS_USERNAME,
      password: process.env.AWS_RDS_SECRET,
      database: process.env.AWS_RDS_DB_NAME,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
