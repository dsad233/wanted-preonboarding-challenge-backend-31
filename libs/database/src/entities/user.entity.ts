import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Review } from './review.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '유저 이름',
  })
  name: string;

  @Column('varchar', {
    name: 'email',
    length: 100,
    nullable: false,
    unique: true,
    comment: '유저 이메일',
  })
  email: string;

  @Column('varchar', {
    name: 'avatar_url',
    length: 255,
    nullable: true,
    comment: '유저 프로필 이미지',
  })
  avatarUrl: string;

  @OneToMany(() => Review, (review) => review.product, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];
}
