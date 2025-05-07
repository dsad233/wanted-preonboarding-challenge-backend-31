import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Tag } from './tag.entity';

@Entity({
  name: 'product_tags',
})
export class ProductTag {
  @PrimaryGeneratedColumn('uuid', { comment: '매핑 ID' })
  id: string;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('uuid', {
    name: 'tag_id',
    nullable: false,
    comment: '태그 ID (FK)',
  })
  tagId: string;

  @ManyToOne(() => Product, (product) => product.productTags, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Tag, (tag) => tag.productTags, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'id' })
  tag: Tag;
}
