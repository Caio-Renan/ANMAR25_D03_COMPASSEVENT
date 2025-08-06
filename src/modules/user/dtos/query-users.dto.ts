import { Roles } from '@enums/roles.enum';
import { Status } from '@enums/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenericString } from '@vo/index';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
export class QueryUsersDto {
  @ApiPropertyOptional({ example: 'James Michael', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(GenericString.maxLength)
  name?: string;

  @ApiPropertyOptional({ example: 'test@example.com', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(GenericString.maxLength)
  email?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ enum: [Roles.ORGANIZER, Roles.PARTICIPANT], example: Roles.PARTICIPANT })
  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;

  @ApiPropertyOptional({ example: 10, description: 'Number of items to return', type: Number })
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
  @IsString()
  lastEvaluatedKey?: Record<string, unknown>;
}
