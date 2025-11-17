import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
  Paginate,
  PaginateQuery,
  Paginated,
  PaginatedSwaggerDocs,
} from 'nestjs-paginate';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination and filtering' })
  @PaginatedSwaggerDocs(Order, OrdersService.PaginationConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return this.ordersService.findAll(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export orders to Excel' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Excel file exported successfully',
  })
  async exportOrders(
    @Paginate() query: PaginateQuery,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const buffer = await this.ordersService.exportToExcel(query);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    res.setHeader('Content-Length', buffer.length.toString());
    res.send(buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: Order,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateData);
  }
}