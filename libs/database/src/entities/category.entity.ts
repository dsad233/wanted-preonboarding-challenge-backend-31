import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid', { comment: '카테고리 ID' })
  id: string;

  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '카테고리명',
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

  @Column('text', { name: 'description', nullable: true, comment: '설명' })
  description: string;

  @Column('uuid', {
    name: 'parent_id',
    nullable: true,
    comment: '상위 카테고리 ID',
  })
  parentId: string;

  @Column('int', {
    name: 'level',
    width: 1,
    default: 1,
    comment: '카테고리 레벨 (1: 대분류, 2: 중분류, 3: 소분류)',
  })
  level: number;

  @Column('varchar', {
    name: 'image_url',
    length: 255,
    nullable: true,
    comment: '카테고리 이미지',
  })
  imageUrl: string;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @ManyToOne(() => Category, (category) => category.childCategories, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parentCategory: Category;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category,
    {
      onDelete: 'CASCADE',
    },
  )
  productCategories: ProductCategory[];
}
