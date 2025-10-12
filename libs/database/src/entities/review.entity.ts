import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Index('INDEX_REVIEW_CREATEDAT', ['createdAt'])
@Index('INDEX_REVIEW_PRODUCTID', ['productId'])
@Index('INDEX_REVIEW_RATING', ['rating'])
@Index('INDEX_REVIEW_TITLE', ['title'])
@Entity({
  name: 'reviews',
})
export class Review extends BaseEntity {
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '수정일',
  })
  updatedAt: Date;

  @Column('uuid', {
    name: 'product_id',
    nullable: false,
    comment: '상품 ID (FK)',
  })
  productId: string;

  @Column('uuid', {
    name: 'user_id',
    nullable: true,
    comment: '사용자 ID (FK)',
  })
  userId: string;

  @Column('int', {
    name: 'rating',
    nullable: false,
    default: 1,
    comment: '평점',
  })
  rating: number;

  @Column('varchar', {
    name: 'title',
    length: 255,
    nullable: false,
    comment: '리뷰 제목',
  })
  title: string;

  @Column('text', { name: 'content', nullable: false, comment: '리뷰 내용' })
  content: string;

  @Column('boolean', {
    name: 'verified_purchase',
    default: false,
    comment: '리뷰 확인 여부',
  })
  verifiedPurchase: boolean;

  @Column('int', {
    name: 'helpful_votes',
    default: 0,
    comment: '유용한 글 투표 수',
  })
  helpfulVotes: number;

  @ManyToOne(() => Product, (product) => product.reviews, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
