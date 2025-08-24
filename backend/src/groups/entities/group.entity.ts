import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';

@Entity('groups')
export class Group {
  @ApiProperty({ description: 'Group ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Group name', maxLength: 255 })
  @Column({ length: 255, unique: true })
  name: string;

  @ApiProperty({ description: 'Related orders' })
  @OneToMany(() => Order, (order) => order.group)
  orders: Order[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}