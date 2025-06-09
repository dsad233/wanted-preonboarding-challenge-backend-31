import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOption } from './product-option.entity';

@Index('INDEX_PRODUCT_IMAGE_PRODUCTID', ['productId'])
@Index('INDEX_PRODUCT_IMAGE_ISPRIMARY', ['isPrimary'])
@Index('INDEX_PRODUCT_IMAGE_OPTIONID', ['optionId'])
@Index('INDEX_PRODUCT_IMAGE_ORDER', ['displayOrder'])
@Entity({
  name: 'product_images',
})
export class ProductImage {
  @PrimaryGeneratedColumn('uuid', { comment: '옵션 ID' })
  id: string;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('varchar', {
    name: 'url',
    length: 255,
    nullable: false,
    comment: '이미지 URL',
  })
  url: string;

  @Column('varchar', {
    name: 'alt_text',
    length: 255,
    nullable: true,
    comment: '대체 텍스트',
  })
  altText: string;

  @Column('boolean', {
    name: 'is_primary',
    default: false,
    comment: '대표 이미지 여부',
  })
  isPrimary: boolean;

  @Column('uuid', {
    name: 'option_id',
    nullable: true,
    comment: '연관된 옵션 ID (FK, nullable)',
  })
  optionId: string;

  @Column('int', { name: 'display_order', default: 0, comment: '표시 순서' })
  displayOrder: number;

  @ManyToOne(() => Product, (product) => product.productImages, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(
    () => ProductOption,
    (productOption) => productOption.productImages,
    {
      createForeignKeyConstraints: false,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'option_id', referencedColumnName: 'id' })
  productOption: ProductOption;
}
