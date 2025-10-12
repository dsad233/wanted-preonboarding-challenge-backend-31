import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductTag } from './product-tag.entity';

@Index('INDEX_TAG_NAME', ['name'])
@Index('INDEX_TAG_SLUG', ['slug'], { unique: true })
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
    comment: 'URL 슬러그',
  })
  slug: string;

  @OneToMany(() => ProductTag, (productTag) => productTag.tag, {
    onDelete: 'CASCADE',
  })
  productTags: ProductTag[];
}
