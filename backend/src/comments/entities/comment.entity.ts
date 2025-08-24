import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('comments')
export class Comment {
  @ApiProperty({ description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Comment message' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'User who created the comment', type: () => User })
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: 'Related order', type: () => Order })
  @ManyToOne(() => Order, (order) => order.comments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'Order ID' })
  @Column({ name: 'order_id' })
  orderId: number;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}