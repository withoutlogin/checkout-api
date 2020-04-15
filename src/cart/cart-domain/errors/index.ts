import { DomainError } from 'common/ddd/errors';
import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundInCart extends DomainError {}

export class CartNotFound extends NotFoundException {}
