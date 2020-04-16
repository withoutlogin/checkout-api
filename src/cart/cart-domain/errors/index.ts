import { DomainError } from 'common/ddd/errors';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

export class ProductNotFoundInCart extends DomainError {}

export class CartNotFound extends NotFoundException {}

export class ForbiddenDomainActionError extends ForbiddenException {}

export class CannotCheckoutEmptyCart extends DomainError {}

export class InvalidQuantityError extends DomainError {}

export class PriceForProductUnknownError extends DomainError {}
