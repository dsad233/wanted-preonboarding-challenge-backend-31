import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({
  name: 'product_details',
})
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid', { name: '상세 ID' })
  id: string;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('decimal', {
    name: 'weight',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '무게',
  })
  weight: number;

  @Column('jsonb', {
    name: 'dimensions',
    nullable: true,
    comment: '크기 (JSON)',
  })
  dimensions: string[];

  @Column('text', { name: 'materials', nullable: true, comment: '소재 정보' })
  materials: string;

  @Column('varchar', {
    name: 'country_of_origin',
    length: 100,
    nullable: true,
    comment: '원산지',
  })
  countryOfOrigin: string;

  @Column('text', {
    name: 'warranty_info',
    nullable: true,
    comment: '보증 정보',
  })
  warrantyInfo: string;

  @Column('text', {
    name: 'care_instructions',
    nullable: true,
    comment: '관리 지침',
  })
  careInstructions: string;

  @Column('jsonb', {
    name: 'additional_info',
    nullable: true,
    comment: '추가 정보 (JSONB)',
  })
  additionalInfo: string[];

  @ManyToOne(() => Product, (product) => product.productDetails, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}
