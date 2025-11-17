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

    // Update order: assign manager and change status to "In work" only if status is "New" or missing
    const updateData: Partial<Order> = {
      ...order,
      manager: user,
      managerId: user.id,
    };

    // Only set status to "In work" if current status is "New" or missing
    if (!order.status || order.status === OrderStatus.NEW) {
      updateData.status = OrderStatus.IN_WORK;
    }

    await this.orderRepository.save(updateData);

    return savedComment;
  }

  async findByOrderId(orderId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { orderId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' },
    });
  }
}