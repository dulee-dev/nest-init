import { Base } from 'src/libs/base.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'pw-codes' })
export class PwCode extends Base {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'pw_code_user_id' })
  pwCodeUserId: number;

  @Column()
  hash: string;

  @Column()
  code: number;
}
