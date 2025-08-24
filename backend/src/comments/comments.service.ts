import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { message, orderId } = createCommentDto;

    // Find the order
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['manager'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.manager && order.manager.id !== user.id) {
      throw new BadRequestException('You can\'t comment this order');
    }

    // Create comment
    const comment = this.commentRepository.create({
      message,
      user,
      order,
    });
    const savedComment = await this.commentRepository.save(comment);

    // Update order: assign manager and change status to "In work" (only on first comment)
    await this.orderRepository.save({
      ...order,
      manager: user,
      managerId: user.id,
      status: OrderStatus.IN_WORK,
    });

    return savedComment;
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' },
    });
  }
}