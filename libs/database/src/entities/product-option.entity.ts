import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOptionGroup } from './product-option-group.entity';
import { ProductImage } from './product-image.entity';

@Entity({
  name: 'product_options',
})
export class ProductOption {
  @PrimaryGeneratedColumn('uuid', { comment: '옵션 ID' })
  id: string;

  @Column('uuid', {
    name: 'option_group_id',
    nullable: false,
    comment: '옵션 그룹 ID (FK)',
  })
  optionGroupId: string;

  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '옵션명 (예: "빨강", "XL")',
  })
  name: string;

  @Column('decimal', {
    name: 'additional_price',
    precision: 12,
    scale: 2,
    default: 0,
    comment: '추가 가격',
  })
  additionalPrice: string;

  @Column('varchar', {
    name: 'sku',
    length: 100,
    nullable: true,
    comment: '재고 관리 코드',
  })
  sku: string;

  @Column('int', { name: 'stock', default: 0, comment: '재고 수량' })
  stock: number;

  @Column('int', { name: 'display_order', default: 0, comment: '표시 순서' })
  displayOrder: number;

  @ManyToOne(
    () => ProductOptionGroup,
    (productOptionGroup) => productOptionGroup.productOptions,
    {
      createForeignKeyConstraints: false,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'option_group_id', referencedColumnName: 'id' })
  productOptionGroup: ProductOptionGroup;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    onDelete: 'CASCADE',
  })
  productImages: ProductImage[];
}
