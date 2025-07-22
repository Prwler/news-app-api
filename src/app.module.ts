import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AdminUserEntity } from './adminUser/adminUser.entity';
import { ArticleEntity } from './articles/article.entity';
import { PageViewEntity } from './views/pageViews.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([ArticleEntity, AdminUserEntity, PageViewEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'W!lson2003',
      database: 'lens_api',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
