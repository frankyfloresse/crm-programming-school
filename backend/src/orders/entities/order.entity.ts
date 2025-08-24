import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../groups/entities/group.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../auth/entities/user.entity';

export enum OrderStatus {
  IN_WORK = 'In work',
  NEW = 'New',
  AGREE = 'Aggre',
  DISAGREE = 'Disaggre',
  DUBBING = 'Dubbing',
}

export enum Course {
  FS = 'FS',
  QACX = 'QACX',
  JCX = 'JCX',
  JSCX = 'JSCX',
  FE = 'FE',
  PCX = 'PCX',
}

export enum CourseType {
  PRO = 'pro',
  MINIMAL = 'minimal',
  PREMIUM = 'premium',
  INCUBATOR = 'incubator',
  VIP = 'vip',
}

export enum CourseFormat {
  STATIC = 'static',
  ONLINE = 'online',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Order ID' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Student first name', maxLength: 25 })
  @Column({ length: 25, nullable: true })
  name?: string;

  @ApiProperty({ description: 'Student surname', maxLength: 25 })
  @Column({ length: 25, nullable: true })
  surname?: string;

  @ApiProperty({ description: 'Student email', maxLength: 100 })
  @Column({ length: 100, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Student phone', maxLength: 12 })
  @Column({ length: 12, nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Student age' })
  @Column({ type: 'int', nullable: true })
  age?: number;

  @ApiProperty({ description: 'Course', enum: Course })
  @Column({
    type: 'enum',
    enum: Course,
    nullable: true,
  })
  course?: Course;

  @ApiProperty({ description: 'Course format', enum: CourseFormat })
  @Column({
    type: 'enum',
    enum: CourseFormat,
    nullable: true,
  })
  course_format?: CourseFormat;

  @ApiProperty({ description: 'Course type', enum: CourseType })
  @Column({
    type: 'enum',
    enum: CourseType,
    nullable: true,
  })
  course_type?: CourseType;

  @ApiProperty({ description: 'Total sum' })
  @Column({ type: 'int', nullable: true })
  sum?: number;

  @ApiProperty({ description: 'Already paid amount' })
  @Column({ type: 'int', nullable: true })
  alreadyPaid?: number;

  @ApiProperty({ description: 'UTM parameters', maxLength: 100 })
  @Column({ length: 100, nullable: true })
  utm?: string;

  @ApiProperty({ description: 'Message', maxLength: 100 })
  @Column({ length: 100, nullable: true })
  msg?: string;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: true,
  })
  status?: OrderStatus;

  @ApiProperty({ description: 'Related group' })
  @ManyToOne(() => Group, (group) => group.orders, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: Group;

  @ApiProperty({ description: 'Group ID' })
  @Column({ name: 'group_id', nullable: true })
  groupId?: number;

  @ApiProperty({ description: 'Order comments' })
  @OneToMany(() => Comment, (comment) => comment.order)
  comments: Comment[];

  @ApiProperty({ description: 'Assigned manager' })
  @ManyToOne(() => User, (user) => user.managedOrders, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager?: User;

  @ApiProperty({ description: 'Manager ID' })
  @Column({ name: 'manager_id', nullable: true })
  managerId?: number;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ type: 'datetime', precision: 6, nullable: true })
  updated_at: Date;
}