import { User } from '@user';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('user_details')
export class UserDetail {
  @PrimaryColumn()
  id: number; // Khóa chính, cũng là khóa ngoại tham chiếu đến User

  @OneToOne(() => User, (user) => user.userDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ length: 10, unique: true, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  adresss?: string; // Lưu ý: bạn viết sai chính tả 'adresss', nên sửa lại thành 'address' nếu được
}
