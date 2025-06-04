import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import { IsGenericDate } from 'src/common/decorators';
import { Status } from 'src/common/enums/status.enum';
import { GenericString } from 'src/common/value-objects';

export class QueryEventsDto {
  @ApiPropertyOptional({ example: 'Tech Conference 2025', type: String })
  @IsOptional()
  @MaxLength(GenericString.maxLength)
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '2025-08-01T00:00:00.000Z',
    description: 'Start date filter (inclusive)',
    type: String,
  })
  @IsOptional()
  @IsGenericDate()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2025-08-31T23:59:59.999Z',
    description: 'End date filter (inclusive)',
    type: String,
  })
  @IsOptional()
  @IsGenericDate()
  dateTo?: string;

  @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: 10, description: 'Number of items to return', type: String })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'lastEvaluatedKeyHere',
    description: 'Pagination token',
    type: String,
  })
  @IsOptional()
  lastEvaluatedKey?: Record<string, unknown>;
}
