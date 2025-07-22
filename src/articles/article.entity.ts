import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUserEntity } from 'src/adminUser/adminUser.entity';

export enum StatusEnum {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

export enum ArticleTypeEnum {
  NEWS = 'News',
  OPINION = 'Opinion',
  FEATURE = 'Feature',
}

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  article_id: number;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

//   @Column({ type: 'enum', enum: ArticleTypeEnum, name: 'article_type' })
//   articleType: ArticleTypeEnum;

  @Column({ type: 'varchar', length: 255, name: 'thumbnail', nullable: true })
  thumbnail: string;

  @Column({ type: 'enum', enum: StatusEnum, name: 'status' })
  status: StatusEnum;

  @Column({ type: 'timestamp', name: 'publish_date', nullable: true })
  publishDate: Date;

  @Column({ type: 'int', name: 'view_count', default: 0 })
  viewCount: number;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => AdminUserEntity, (user) => user.articles)
  @JoinColumn({ name: 'author_id' })
  author: AdminUserEntity;
}
