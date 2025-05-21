import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req, 
  ParseUUIDPipe,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import{ RequestWithUser} from '../common/interfaces/request-with-user.interface';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserGoals(@Req() req: RequestWithUser) {
      const userId = req.user['id'];
      return this.goalsService.getUserGoals(userId);
    }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addGoal(
    @Req() req: RequestWithUser,
    @Body() dto: CreateGoalDto,
  ) {
    
    const userId = req.user['id'];
    return this.goalsService.addGoal(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateGoal(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    const userId = req.user['id'];
    return this.goalsService.updateGoal(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteGoal(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = req.user['id'];
    return this.goalsService.deleteGoal(userId, id);
  }

  @Get('/public-goals')
  async getPublicGoals() {
    return this.goalsService.getAllPublicGoals();
  }

  @Get('/public-goals/:publicId')
  async getPublicGoal(@Param('publicId') publicId: string) {
    return this.goalsService.getPublicGoalByPublicId(publicId);
  }
}
