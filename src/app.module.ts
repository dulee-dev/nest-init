import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configOptions from './app-options/config-options';

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
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.google.com',
        port: 587,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.MAILER_SENDER,
          clientId: process.env.MAILER_CLIENT_ID,
          clientSecret: process.env.MAILER_CLIENT_SECRET,
          refreshToken: process.env.MAILER_REFRESH_TOKEN,
        },
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
