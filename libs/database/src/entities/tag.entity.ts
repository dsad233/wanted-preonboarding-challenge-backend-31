import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductTag } from './product-tag.entity';

@Entity({
  name: 'tags',
})
export class Tag {
  @PrimaryGeneratedColumn('uuid', { comment: '태그 ID' })
  id: string;

  @Column('varchar', {
    name: 'name',
    length: 100,
    nullable: false,
    comment: '태그명',
  })
  name: string;

  @Column('varchar', {
    name: 'slug',
    length: 100,
    nullable: false,
    unique: true,
    comment: '태그명',
  })
  slug: string;

  @OneToMany(() => ProductTag, (productTag) => productTag.tag, {
    onDelete: 'CASCADE',
  })
  productTags: ProductTag[];
}
