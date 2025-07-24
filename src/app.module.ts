import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminUserEntity } from './adminUser/adminUser.entity';
import { ArticleEntity } from './articles/article.entity';
import { PageViewEntity } from './views/pageViews.entity';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify .env file
      load: [
        () => {
          console.log('Loaded .env:', {
            // SMTP_HOST: process.env.SMTP_HOST,
            // SMTP_PORT: process.env.SMTP_PORT,
            // SMTP_USERNAME: process.env.SMTP_USERNAME,
            // SMTP_FROM: process.env.SMTP_FROM,
          });
          return {};
        },
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'W!lson2003',
      database: 'lens_api',
      entities: [AdminUserEntity, ArticleEntity, PageViewEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AdminUserEntity, ArticleEntity, PageViewEntity]),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const mailConfig = {
          transport: {
            host:
              configService.get<string>('SMTP_HOST') || 'smtp.mailersend.net', // Fallback
            port: configService.get<number>('SMTP_PORT') || 587,
            secure: false,
            auth: {
              user: configService.get<string>('SMTP_USERNAME'),
              pass: configService.get<string>('SMTP_PASSWORD'),
            },
          },
          defaults: {
            from: configService.get<string>('SMTP_FROM'),
          },
          template: {
            dir: join(process.cwd(), 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: false },
          },
        };
        // console.log('MailerModule config:', {
        //   host: mailConfig.transport.host,
        //   port: mailConfig.transport.port,
        //   user: mailConfig.transport.auth.user,
        //   from: mailConfig.defaults.from,
        // });
        if (
          !mailConfig.transport.host ||
          !mailConfig.transport.auth.user ||
          !mailConfig.transport.auth.pass
        ) {
          throw new Error('Missing SMTP configuration. Check .env file.');
        }
        return mailConfig;
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}