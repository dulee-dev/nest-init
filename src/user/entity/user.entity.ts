import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_info' })
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  userIdx: number;

  @Column({ length: 100, unique: true })
  userId: string;

  @Column({ length: 100, nullable: true })
  userPw: string;

  @Column({ length: 15, unique: true })
  userNickName: string;

  @Column({ length: 13 })
  ph: string;

  @Column()
  addr1: string;

  @Column()
  addr2: string;

  @Column({ length: 100, nullable: true })
  userSalt: string;

  @Column({ unsigned: true })
  userPwVersion: number;

  @Column({ default: () => false })
  isNaverLinked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'bit', default: () => 0 })
  removed: number;

  @Column({ type: 'tinyint', default: () => 0 })
  authType: number;
}
