import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { v4 as uuidv4 } from 'uuid';
import { IsNull } from 'typeorm';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  async validateNestingDepth(parentId: string | null): Promise<void> {
    if (!parentId) return; // Root goal is always allowed

    const parentGoal = await this.goalRepository.findOne({
      where: { id: parentId },
      relations: ['parent'], // make sure relation is set in entity
    });

    if (!parentGoal) {
      throw new BadRequestException('Parent goal not found');
    }

    if (parentGoal.parent && parentGoal.parent.parentId) {
      // This would make nesting level 3 (sub-sub-child), which is not allowed
      throw new BadRequestException(
        'Nesting depth exceeds 2 levels (root > child > sub-child)',
      );
    }
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { ownerId: userId, parentId: IsNull() },
      relations: ['children', 'children.children'], // load children recursively
      order: { order: 'ASC' },
    });
  }

  async addGoal(userId: string, dto: CreateGoalDto): Promise<Goal> {
    await this.validateNestingDepth(dto.parentId ?? null);
    const goal = this.goalRepository.create({
      ...dto,
      ownerId: userId,
      publicId: dto.isPublic ? uuidv4() : undefined,
    });

    return this.goalRepository.save(goal);
  }

  async updateGoal(
    userId: string,
    goalId: string,
    dto: UpdateGoalDto,
  ): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id: goalId } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this goal',
      );
    }

    if (dto.parentId !== undefined && dto.parentId !== goal.parentId) {
      await this.validateNestingDepth(dto.parentId ?? null);
    }

    if (dto.isPublic && !goal.publicId) {
      goal.publicId = uuidv4();
    }
    if (!dto.isPublic && goal.publicId) {
      // remove publicId if not public anymore
      goal.publicId = null;
    }

    const updated = this.goalRepository.merge(goal, dto);
    return this.goalRepository.save(updated);
  }

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    const goal = await this.goalRepository.findOne({ where: { id: goalId } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this goal',
      );
    }

    // check if the goal has children
    const children = await this.goalRepository.find({
      where: { parentId: goalId },
    });
    if (children.length > 0) {
      throw new BadRequestException(
        'Cannot delete a goal with children. Please delete the children first.',
      );
    }

    await this.goalRepository.remove(goal);
  }

  // get only top-level public goals
  async getAllPublicGoals(): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { isPublic: true, parentId: IsNull() },
      order: { createdAt: 'ASC' }, // order by creation date
    });
  }

  async getPublicGoalByPublicId(publicId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { publicId, isPublic: true },
      relations: ['children', 'children.children'], // load children recursively
      order: { createdAt: 'ASC' }, // order by creation date
    });
    if (!goal) {
      throw new NotFoundException('Goal with public id is not found');
    }
    return goal;
  }
}
