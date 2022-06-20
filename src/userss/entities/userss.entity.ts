import { Length } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Userss {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(4, 20)
  @Column('text')
  name: string;

  @Length(4, 20)
  @Column('text')
  password: string;
}
