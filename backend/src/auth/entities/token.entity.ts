import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity('tokens')
export class Token {
  @ApiProperty({ description: 'Token ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'JWT ID (unique identifier)' })
  @Column({ unique: true })
  jti: string;

  @Exclude()
  @Column({ type: 'text' })
  accessToken: string;

  @Exclude()
  @Column({ type: 'text' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token expiration date' })
  @Column()
  accessExpiresAt: Date;

  @ApiProperty({ description: 'Refresh token expiration date' })
  @Column()
  refreshExpiresAt: Date;

  @ApiProperty({ description: 'Whether the token is blocked/revoked' })
  @Column({ default: false })
  isBlocked: boolean;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'User who owns this token' })
  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
