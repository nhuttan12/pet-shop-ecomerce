import { AutoMap } from '@automapper/classes';
import { User } from '@user/entites/users.entity';
import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from 'typeorm';

@Entity('user_details')
export class UserDetail {
  @PrimaryColumn()
  @AutoMap()
  id: number; // Khóa chính, cũng là khóa ngoại tham chiếu đến User

  @OneToOne(() => User, (user: User) => user.userDetail)
  @JoinColumn({ name: 'id' })
  @AutoMap(() => User)
  user: User;

  @Column({ length: 10, unique: true, nullable: true })
  @AutoMap()
  phone?: string;

  @Column({ length: 255, nullable: true })
  @AutoMap()
  adress?: string;
}
