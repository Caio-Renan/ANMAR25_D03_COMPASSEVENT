import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsValidUuid } from 'src/common/decorators';
import { Status } from 'src/common/enums/status.enum';
export class QuerySubscriptionsDto {
  @ApiPropertyOptional({ example: 'uuid-user-id', type: String })
  @IsOptional()
  @IsValidUuid()
  userId?: string;

  @ApiPropertyOptional({ example: 'uuid-event-id', type: String })
  @IsOptional()
  @IsValidUuid()
  eventId?: string;

  @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: 10, description: 'Number of items to return', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: '{"id":"lastEvaluatedKeyHere"}',
    description: 'Pagination token',
    type: String,
  })
  @IsOptional()
  lastEvaluatedKey?: Record<string, unknown>;
}
