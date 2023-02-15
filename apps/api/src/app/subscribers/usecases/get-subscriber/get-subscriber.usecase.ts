import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriberEntity, SubscriberRepository } from '@novu/dal';
import { GetSubscriberCommand } from './get-subscriber.command';
import { CachedEntity } from '../../../shared/interceptors/cached-entity.interceptor';
import { KeyGenerator } from '../../../shared/services/cache/keys';

@Injectable()
export class GetSubscriber {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async execute(command: GetSubscriberCommand): Promise<SubscriberEntity> {
    const { environmentId, subscriberId } = command;
    const subscriber = await this.fetchSubscriber({ _environmentId: environmentId, subscriberId });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber not found for id ${subscriberId}`);
    }

    return subscriber;
  }

  @CachedEntity({
    builder: KeyGenerator.entity().subscriber,
  })
  private async fetchSubscriber({
    subscriberId,
    _environmentId,
  }: {
    subscriberId: string;
    _environmentId: string;
  }): Promise<SubscriberEntity | null> {
    return await this.subscriberRepository.findBySubscriberId(_environmentId, subscriberId);
  }
}
