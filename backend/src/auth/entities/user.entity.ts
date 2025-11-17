import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Token } from './token.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'User first name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MANAGER,
  })
  role: UserRole;

  @Exclude()
  @ApiProperty({ description: 'Password recovery token' })
  @Column({ nullable: true })
  recoveryPasswordToken?: string;

  @Exclude()
  @ApiProperty({ description: 'Password recovery token expiry' })
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value: Date) => value ? value.getTime() : null,
      from: (value: number | string) => value ? new Date(typeof value === 'string' ? parseInt(value) : value) : null
    }
  })
  recoveryPasswordExpires?: Date;

  
  @ApiProperty({ description: 'Account activation status' })
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty({ description: 'Account ban status' })
  @Column({ default: false })
  is_banned: boolean;

  @ApiProperty({ description: 'User tokens' })
  @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens: Token[];

  @ApiProperty({ description: 'Managed orders' })
  @OneToMany('Order', 'manager')
  managedOrders: any[];

  @ApiProperty({ description: 'User comments' })
  @OneToMany('Comment', 'user')
  comments: any[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
