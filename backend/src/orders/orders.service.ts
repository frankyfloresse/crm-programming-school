import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  FilterOperator,
} from 'nestjs-paginate';
import * as XLSX from 'xlsx';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  static PaginationConfig: PaginateConfig<Order> = {
    maxLimit: -1,
    sortableColumns: [
      'id',
      'name',
      'surname',
      'email',
      'phone',
      'age',
      'course',
      'course_format',
      'course_type',
      'status',
      'sum',
      'alreadyPaid',
      'created_at',
      'group.name',
      'manager.firstName',
    ],
    searchableColumns: ['name', 'surname', 'email', 'phone', 'utm', 'msg'],
    filterableColumns: {
      id: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      age: true,
      course: true,
      status: true,
      course_format: true,
      course_type: true,
      sum: true,
      alreadyPaid: true,
      manager_id: true,
      groupId: true,
      created_at: true,
    },
    defaultSortBy: [['id', 'DESC']],
    relations: ['manager', 'group', 'comments'],
  };

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Order>> {
    // If filtering by 'New' status, we need to include null status values as well
    if (query.filter?.status === OrderStatus.NEW) {
      query.filter.status = [OrderStatus.NEW, '$or:$null'];
    }

    return paginate(
      query,
      this.orderRepository,
      OrdersService.PaginationConfig,
    );
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['manager', 'group', 'comments'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateData: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id);

    // If status is being set to 'New', clear the manager
    if (updateData.status === OrderStatus.NEW) {
      console.log('clear manager');
      updateData.managerId = null;
      updateData.manager = null;
    }

    Object.assign(order, updateData);

    return this.orderRepository.save(order);
  }

  async exportToExcel(query: PaginateQuery): Promise<Buffer> {
    // If filtering by 'New' status, we need to include null status values as well
    if (query.filter?.status === OrderStatus.NEW) {
      query.filter.status = [OrderStatus.NEW, '$or:$null'];
    }

    // Use the same pagination logic but with limit = -1 to get all records
    const paginatedResult = await paginate(
      { ...query, limit: -1 },
      this.orderRepository,
      OrdersService.PaginationConfig,
    );

    // Prepare data for Excel
    const excelData = paginatedResult.data.map((order) => ({
      ...order,
      manager: order.manager
        ? `${order.manager.firstName} ${order.manager.lastName}`
        : '',
      created_at: order.created_at
        ? new Date(order.created_at).toLocaleDateString()
        : '',
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set uniform column widths for all columns
    const colWidths = Array(excelData[0] ? Object.keys(excelData[0]).length : 0)
      .fill(20)
      .map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return excelBuffer as Buffer;
  }
}
