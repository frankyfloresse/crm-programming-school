import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { name } = createGroupDto;

    // Check if group with this name already exists
    const existingGroup = await this.groupRepository.findOne({
      where: { name },
    });
    if (existingGroup) {
      throw new ConflictException('Group with this name already exists');
    }

    const group = this.groupRepository.create({ name });
    return this.groupRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: ['orders'],
      order: { createdAt: 'DESC' },
    });
  }
}