import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Brand } from './brand.entity';
import { Seller } from './seller.entity';
import { ProductDetail } from './product-detail.entity';
import { ProductPrice } from './product-price.entity';
import { ProductCategory } from './product-category.entity';
import { ProductOptionGroup } from './product-option-group.entity';
import { ProductImage } from './product-image.entity';
import { ProductTag } from './product-tag.entity';
import { Review } from './review.entity';

@Entity({
  name: 'products',
})
export class Product extends BaseEntity {
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '수정일',
  })
  updatedAt: Date;

  @Column('varchar', {
    name: 'name',
    length: 255,
    nullable: false,
    comment: '상품명',
  })
  name: string;

  @Column('varchar', {
    name: 'slug',
    length: 255,
    nullable: false,
    unique: true,
    comment: 'URL 슬러그 (SEO 최적화용)',
  })
  slug: string;

  @Column('varchar', {
    name: 'short_description',
    length: 500,
    nullable: true,
    comment: '짧은 설명',
  })
  shortDescription: string;

  @Column('text', {
    name: 'full_description',
    nullable: true,
    comment: '전체 설명 (HTML 허용)',
  })
  fullDescription: string;

  @Column('uuid', {
    name: 'seller_id',
    nullable: false,
    comment: '판매자 ID (FK)',
  })
  sellerId: string;

  @Column('uuid', {
    name: 'brand_id',
    nullable: false,
    comment: '브랜드 ID (FK)',
  })
  brandId: string;

  @Column('varchar', {
    name: 'status',
    length: 20,
    nullable: false,
    comment: '상태 (판매중, 품절, 삭제됨 등)',
  })
  status: string;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
  brand: Brand;

  @ManyToOne(() => Seller, (seller) => seller.products, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'id' })
  seller: Seller;

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.product, {
    onDelete: 'CASCADE',
  })
  productDetails: ProductDetail[];

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product, {
    onDelete: 'CASCADE',
  })
  productPrices: ProductPrice[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    {
      onDelete: 'CASCADE',
    },
  )
  productCategories: ProductCategory[];

  @OneToMany(
    () => ProductOptionGroup,
    (productOptionGroup) => productOptionGroup.product,
    {
      onDelete: 'CASCADE',
    },
  )
  productOptionGroups: ProductOptionGroup[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    onDelete: 'CASCADE',
  })
  productImages: ProductImage[];

  @OneToMany(() => ProductTag, (productTag) => productTag.product, {
    onDelete: 'CASCADE',
  })
  productTags: ProductTag[];

  @OneToMany(() => Review, (review) => review.product, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];
}
