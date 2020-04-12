import { DomainError } from 'common/ddd/errors';

export class ProductNotFoundInCart extends DomainError {}

export class CartNotFound extends DomainError {}
