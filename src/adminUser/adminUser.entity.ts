import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ArticleEntity } from 'src/articles/article.entity';

@Entity('admin_users')
export class AdminUserEntity {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 255, name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password' }) // Store hashed password
  password: string;

  @Column({ type: 'varchar', length: 255, name: 'verification_code', nullable: true })
  verificationCode: string;

  @Column({ type: 'boolean', name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]; // Relationship to articles
}