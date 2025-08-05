import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '@decorators/current-user.decorator';
import { RolesDecorator } from '@decorators/roles.decorator';
import { Roles } from '@enums/roles.enum';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationTokenPipe } from '@pipes/pagination-token.pipe';
import { ParseUuidToValueObjectPipe } from '@pipes/parse-uuid-to-vo.pipe';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { QueryUsersDto } from '@user/dtos/query-users.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import { UserResponseDto } from '@user/dtos/user-response.dto';
import { UserService } from '@user/services/user.service';
import { Uuid } from '@vo/index';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User UUID', type: String })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserResponseDto> {
    if (currentUser.role !== Roles.ADMIN && currentUser.sub !== id.value) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return new UserResponseDto(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User UUID', type: String })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserResponseDto> {
    if (currentUser.role !== Roles.ADMIN && currentUser.sub !== id.value) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT)
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiParam({ name: 'id', description: 'User UUID', type: String })
  @ApiResponse({ status: 204, description: 'User soft deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<void> {
    if (currentUser.role !== Roles.ADMIN && currentUser.sub !== id.value) {
      throw new ForbiddenException('Access denied');
    }

    await this.userService.softDelete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({ summary: 'List users with optional filters and pagination' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async findAll(
    @Query() query: QueryUsersDto,
    @Query('lastEvaluatedKey', PaginationTokenPipe) lastEvaluatedKey?: Record<string, unknown>,
  ): Promise<{ items: UserResponseDto[]; lastEvaluatedKey?: string }> {
    if (lastEvaluatedKey) {
      query.lastEvaluatedKey = lastEvaluatedKey;
    }

    const result = await this.userService.findAll(query);

    return {
      items: result.items.map(user => new UserResponseDto(user)),
      lastEvaluatedKey: result.lastEvaluatedKey,
    };
  }
}
