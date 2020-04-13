import { IEvent } from '@nestjs/cqrs';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface DomainEvent extends IEvent {}

export interface DomainEntity {}
