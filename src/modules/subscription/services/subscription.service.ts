import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from 'common/enums/status.enum';
import { Uuid } from 'common/value-objects';
import { EventRepository } from 'modules/event/repositories/event.repository';
import { UserRepository } from 'modules/user/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { QuerySubscriptionsDto } from '../dtos/query-subscriptions.dto';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const now = new Date();

    await this.getValidUserById(new Uuid(createSubscriptionDto.userId));

    await this.getValidEventById(new Uuid(createSubscriptionDto.eventId));

    const existingSubscription = await this.subscriptionRepository.findByUserAndEvent(
      new Uuid(createSubscriptionDto.userId),
      new Uuid(createSubscriptionDto.eventId),
    );
    if (existingSubscription && existingSubscription.status === Status.ACTIVE) {
      throw new BadRequestException('User is already subscribed to this event');
    }

    const subscription = new Subscription({
      id: new Uuid(uuidv4()),
      userId: new Uuid(createSubscriptionDto.userId),
      eventId: new Uuid(createSubscriptionDto.eventId),
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    await this.subscriptionRepository.create(subscription);
    return subscription;
  }

  async findById(id: Uuid): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async softDelete(id: Uuid): Promise<void> {
    const subscription = await this.findById(id);

    if (subscription.status === Status.INACTIVE) {
      throw new BadRequestException('Subscription is already inactive');
    }

    const deletedSubscription = new Subscription({
      ...subscription,
      status: Status.INACTIVE,
      updatedAt: new Date(),
    });

    await this.subscriptionRepository.update(deletedSubscription);
  }

  async findAll(
    query: QuerySubscriptionsDto,
  ): Promise<{ items: Subscription[]; lastEvaluatedKey?: string }> {
    return this.subscriptionRepository.findAll(query);
  }

  async getValidUserById(id: Uuid): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== Status.ACTIVE) {
      throw new BadRequestException('User must be active');
    }
  }

  async getValidEventById(id: Uuid): Promise<void> {
    const event = await this.eventRepository.findById(id);
    const now = new Date();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== Status.ACTIVE) {
      throw new BadRequestException('Event must be active');
    }

    if (event.date.value < now) {
      throw new BadRequestException('Event date has already passed');
    }
  }
}
