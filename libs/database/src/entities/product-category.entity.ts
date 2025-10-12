import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';

@Index('INDEX_PRODUCT_CATEGORY_PRODUCTID', ['productId'])
@Index('INDEX_PRODUCT_CATEGORY_CATEGORYID', ['categoryId'])
@Index('INDEX_PRODUCT_CATEGORY_ISPRIMARY', ['isPrimary'])
@Entity({
  name: 'product_categories',
})
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid', { comment: '매핑 ID' })
  id: string;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('uuid', {
    name: 'category_id',
    nullable: false,
    comment: '카테고리 ID (FK)',
  })
  categoryId: string;

  @Column('boolean', {
    name: 'is_primary',
    default: false,
    comment: '주요 카테고리 여부',
  })
  isPrimary: boolean;

  @ManyToOne(() => Product, (product) => product.productCategories, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;
}
