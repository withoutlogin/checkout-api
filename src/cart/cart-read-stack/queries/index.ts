import { CartByIdQueryHandler } from './handlers/cart-by-id-query.handler';
import { CartProductsQuery } from './cart-products.query';
import { CartByIdQuery } from './cart-by-id.query';
import { CartProductsQueryHandler } from './handlers/cart-products-query.handler';

export const Queries = [CartByIdQuery, CartProductsQuery];
export const QueryHandlers = [CartByIdQueryHandler, CartProductsQueryHandler];
