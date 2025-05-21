import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsISO8601,
  IsInt,
  Min,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsISO8601() // ISO 8601 date format: YYYY-MM-DD
  deadline: string;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsInt()
  @Min(0)
  order: number;
}
