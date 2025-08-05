import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { RolesDecorator } from 'common/decorators/roles.decorator';
import { Roles } from 'common/enums/roles.enum';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { PaginationTokenPipe } from 'common/pipes/pagination-token.pipe';
import { ParseUuidToValueObjectPipe } from 'common/pipes/parse-uuid-to-vo.pipe';
import { Uuid } from 'common/value-objects';
import { JwtPayload } from 'modules/auth/interfaces/jwt-payload.interface';

import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { QuerySubscriptionsDto } from '../dtos/query-subscriptions.dto';
import { SubscriptionResponseDto } from '../dtos/subscription-response.dto';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @RolesDecorator(Roles.PARTICIPANT, Roles.ORGANIZER)
  @ApiOperation({ summary: 'Create a new subscription (user or organizer)' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created',
    type: SubscriptionResponseDto,
  })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionService.create({
      ...createSubscriptionDto,
      userId: currentUser.sub,
    });
    return new SubscriptionResponseDto(subscription);
  }

  @Delete(':id')
  @HttpCode(204)
  @RolesDecorator(Roles.PARTICIPANT, Roles.ORGANIZER)
  @ApiOperation({ summary: 'Soft delete subscription (own subscription)' })
  @ApiParam({ name: 'id', description: 'Subscription UUID', type: String })
  @ApiResponse({ status: 204, description: 'Subscription soft deleted' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async remove(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<void> {
    const subscription = await this.subscriptionService.findById(id);
    if (!subscription) throw new NotFoundException('Subscription not found');

    if (subscription.userId.value !== currentUser.sub) {
      throw new ForbiddenException('You do not have permission to delete this subscription');
    }

    await this.subscriptionService.softDelete(id);
  }

  @Get()
  @RolesDecorator(Roles.PARTICIPANT, Roles.ORGANIZER)
  @ApiOperation({ summary: 'List own subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions',
    type: [SubscriptionResponseDto],
  })
  async findAll(
    @Query() query: QuerySubscriptionsDto,
    @CurrentUser() currentUser: JwtPayload,
    @Query('lastEvaluatedKey', PaginationTokenPipe) lastEvaluatedKey?: Record<string, unknown>,
  ): Promise<{ items: SubscriptionResponseDto[]; lastEvaluatedKey?: string }> {
    if (lastEvaluatedKey) {
      query.lastEvaluatedKey = lastEvaluatedKey;
    }

    query.userId = currentUser.sub;

    const result = await this.subscriptionService.findAll(query);

    return {
      items: result.items.map(subscription => new SubscriptionResponseDto(subscription)),
      lastEvaluatedKey: result.lastEvaluatedKey,
    };
  }
}
