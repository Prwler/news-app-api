import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUserEntity } from 'src/adminUser/adminUser.entity';
import { ArticleEntity } from 'src/articles/article.entity';

export enum DeviceTypeEnum {
  MOBILE = 'Mobile',
  DESKTOP = 'Desktop',
  TABLET = 'Tablet',
}

@Entity('page_views')
export class PageViewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DeviceTypeEnum, name: 'device_type' })
  deviceType: DeviceTypeEnum;

  @Column({
    type: 'timestamp',
    name: 'viewed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  viewedAt: Date;

  @ManyToOne(() => ArticleEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;

  @ManyToOne(() => AdminUserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: AdminUserEntity;
}
