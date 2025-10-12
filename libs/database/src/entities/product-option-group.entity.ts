import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOption } from './product-option.entity';

@Index('INDEX_PRODUCT_OPTION_GROUP_PRODUCTID', ['productId'])
@Index('INDEX_PRODUCT_OPTION_GROUP_NAME', ['name'])
@Index('INDEX_PRODUCT_OPTION_GROUP_ORDER', ['displayOrder'])
@Entity({
  name: 'product_option_groups',
})
export class ProductOptionGroup {
  @PrimaryGeneratedColumn('uuid', { comment: '옵션 그룹 ID' })
  id: string;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '옵션 그룹명 (예: "색상", "사이즈")',
  })
  name: string;

  @Column('int', { name: 'display_order', default: 0, comment: '표시 순서' })
  displayOrder: number;

  @ManyToOne(() => Product, (product) => product.productOptionGroups, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @OneToMany(
    () => ProductOption,
    (productOption) => productOption.productOptionGroup,
    {
      onDelete: 'CASCADE',
    },
  )
  productOptions: ProductOption[];
}
