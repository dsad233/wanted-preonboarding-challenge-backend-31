import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Index('INDEX_BRAND_NAME', ['name'])
@Index('INDEX_BRAND_SLUG', ['slug'], { unique: true })
@Entity({
  name: 'brands',
})
export class Brand {
  @PrimaryGeneratedColumn('uuid', { comment: '브랜드 ID' })
  id: string;

  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '브랜드명',
  })
  name: string;

  @Column('varchar', {
    name: 'slug',
    length: 100,
    nullable: false,
    unique: true,
    comment: 'URL 슬러그',
  })
  slug: string;

  @Column('text', { name: 'description', nullable: true, comment: '브랜드명' })
  description: string;

  @Column('varchar', {
    name: 'logo_url',
    length: 255,
    nullable: true,
    comment: '로고 이미지 URL',
  })
  logoUrl: string;

  @Column('varchar', {
    name: 'website',
    length: 255,
    nullable: true,
    comment: '웹사이트 URL',
  })
  website: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
