import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { RequestUser } from '../auth/decorators/request-user';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment for an order' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully. User assigned to order on first comment.',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Order not found' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @RequestUser() user: User,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [Comment],
  })
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }
}