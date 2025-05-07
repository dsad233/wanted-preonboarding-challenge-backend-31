import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity({
  name: 'sellers',
})
export class Seller extends BaseEntity {
  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '판매자명',
  })
  name: string;

  @Column('text', { name: 'description', nullable: true, comment: '설명' })
  description: string;

  @Column('varchar', {
    name: 'logo_url',
    length: 255,
    nullable: true,
    comment: '로고 이미지 URL',
  })
  logoUrl: string;

  @Column('decimal', {
    name: 'rating',
    precision: 3,
    scale: 2,
    nullable: true,
    comment: '평점',
  })
  rating: string;

  @Column('varchar', {
    name: 'contact_email',
    length: 100,
    nullable: true,
    comment: '연락처 이메일',
  })
  contactEmail: string;

  @Column('varchar', {
    name: 'contact_phone',
    length: 20,
    nullable: true,
    comment: '연락처 전화번호',
  })
  contactPhone: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
