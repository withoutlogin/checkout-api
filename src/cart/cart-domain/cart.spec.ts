import Dinero from 'dinero.js';
import { Currency } from 'pricing/money';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from './cart';
import {
  ForbiddenDomainActionError,
  InvalidQuantityError,
  ProductNotFoundInCart,
} from './errors';
import { ProductAddedEvent } from './events/product-added-event';
import { CartProduct } from './valueobjects/cart-product';

const createEmptyCart = (currency: Currency = 'USD'): Cart => {
  const c = new Cart();
  c.initialize(uuidv4(), currency);
  c.commit();
  return c;
};

function createCartWithOneProductAdded() {
  const cart: Cart = createEmptyCart();
  const productToAdd = new CartProduct(
    uuidv4(),
    3,
    Dinero({
      amount: 200,
      precision: 2,
      currency: 'USD',
    }),
  );

  // when
  cart.addProduct(productToAdd);
  cart.commit();
  return {
    cart: cart,
    productAdded: productToAdd,
  };
}

describe('Cart.addProduct', () => {
  let cart: Cart;
  beforeEach(() => {
    cart = createEmptyCart();
  });
  it('should add product', () => {
    // given
    const productToAdd = new CartProduct(
      uuidv4(),
      3,
      Dinero({
        amount: 200,
        precision: 2,
        currency: 'USD',
      }),
    );

    // when
    cart.addProduct(productToAdd);
    cart.commit();

    // then
    expect(cart.getProduct(productToAdd.productId)?.quantity).toBe(3);
  });

  it('should throw ForbiddenDomainActionError when cart has been checked out', () => {
    const { cart } = createCartWithOneProductAdded();
    cart.markAsCheckedOut();
    cart.commit();

    expect(() =>
      cart.addProduct(
        new CartProduct(
          uuidv4(),
          3,
          Dinero({
            amount: 200,
            precision: 2,
            currency: 'USD',
          }),
        ),
      ),
    ).toThrow(ForbiddenDomainActionError);
  });
});

describe('Cart.removeProduct', () => {
  let cart: Cart;
  const firstProductId = uuidv4();
  const secondProductId = uuidv4();

  beforeEach(() => {
    cart = createEmptyCart();
    cart.addProduct(
      new CartProduct(
        firstProductId,
        3,
        Dinero({
          amount: 1500,
          precision: 2,
          currency: cart.getCurrency(),
        }),
      ),
    );
    cart.addProduct(
      new CartProduct(
        secondProductId,
        3,
        Dinero({
          amount: 3499,
          precision: 2,
          currency: cart.getCurrency(),
        }),
      ),
    );
    cart.commit();
  });

  it('should remove product', () => {
    // when
    cart.removeProduct(firstProductId);
    cart.commit();

    // then
    expect(cart.getProduct(firstProductId)).toBeUndefined();
    expect(cart.getProduct(secondProductId)).toBeInstanceOf(CartProduct);
  });

  it('should ignore when removing product that does not exist', () => {
    // given
    cart.removeProduct(firstProductId);
    cart.commit();

    // when
    cart.removeProduct(firstProductId);

    // then
    expect(cart.getUncommittedEvents()).toHaveLength(0);
  });

  it('should throw ForbiddenDomainActionError when cart has been checked out', () => {
    const { cart, productAdded } = createCartWithOneProductAdded();
    cart.markAsCheckedOut();
    cart.commit();

    expect(() => cart.removeProduct(productAdded.productId)).toThrow(
      ForbiddenDomainActionError,
    );
  });
});

describe('Cart.onProductAddedEvent', () => {
  it('should add product applying ProductAddedEvent', () => {
    // given
    const cart: Cart = createEmptyCart();
    const event = new ProductAddedEvent(cart.id, uuidv4(), 3, {
      amount: 200,
      precision: 2,
      currency: 'USD',
    });

    // when
    cart.apply(event, true);

    // then
    expect(cart.getProduct(event.productId)?.quantity).toBe(3);
  });

  it('should increment existing product applying ProductAddedEvent', () => {
    // given
    const cart: Cart = createEmptyCart();
    const existingProduct = new CartProduct(
      uuidv4(),
      3,
      Dinero({
        amount: 200,
        precision: 2,
        currency: 'USD',
      }),
    );
    cart.addProduct(existingProduct);
    cart.commit();

    const event = new ProductAddedEvent(cart.id, existingProduct.productId, 7, {
      amount: 200,
      precision: 2,
      currency: 'USD',
    });

    // when
    cart.apply(event, true);

    // then
    expect(cart.getProduct(event.productId)?.quantity).toBe(10);
  });
});

describe('Cart.changeProductQuantity', () => {
  let cart: Cart;
  const existingProductId = uuidv4();
  const existingProductInitialQuantity = 5;
  beforeEach(() => {
    cart = createEmptyCart();
    cart.addProduct(
      new CartProduct(
        existingProductId,
        existingProductInitialQuantity,
        Dinero({
          amount: 1500,
          precision: 2,
          currency: cart.getCurrency(),
        }),
      ),
    );
  });

  it('should increase existing product quantity to given level', () => {
    // when
    cart.changeProductQuantity(
      existingProductId,
      existingProductInitialQuantity + 2,
    );
    cart.commit();

    // then
    expect(cart.getProduct(existingProductId)?.quantity).toBe(
      existingProductInitialQuantity + 2,
    );
  });

  it('should decrease existing product quantity to given level', () => {
    // when
    cart.changeProductQuantity(
      existingProductId,
      existingProductInitialQuantity - 3,
    );
    cart.commit();

    // then
    expect(cart.getProduct(existingProductId)?.quantity).toBe(
      existingProductInitialQuantity - 3,
    );
  });

  it('should remove product if decreasing quantity to zero', () => {
    // when
    cart.changeProductQuantity(existingProductId, 0);
    cart.commit();

    // then
    expect(cart.getProduct(existingProductId)).toBeUndefined();
  });

  it('should throw InvalidQuantityError when decreasing quantity below zero', () => {
    // when
    expect(() =>
      cart.changeProductQuantity(existingProductId, -4),
    ).toThrowError(InvalidQuantityError);
  });

  it('should throw ProductNotFoundInCart when decreasing quantity of not existing product', () => {
    // given
    const nonExistingProductId = uuidv4();
    // when
    expect(() =>
      cart.changeProductQuantity(nonExistingProductId, 4),
    ).toThrowError(ProductNotFoundInCart);
  });

  it('should throw ForbiddenDomainActionError when cart has been checked out', () => {
    const { cart, productAdded } = createCartWithOneProductAdded();
    cart.markAsCheckedOut();
    cart.commit();

    expect(() =>
      cart.changeProductQuantity(productAdded.productId, 66),
    ).toThrow(ForbiddenDomainActionError);
  });
});

describe('Cart.changeCurrency', () => {
  let cart: Cart;
  const cartProductId = uuidv4();
  beforeEach(() => {
    cart = createEmptyCart('USD');
    cart.addProduct(
      new CartProduct(
        cartProductId,
        5,
        Dinero({
          amount: 1500,
          precision: 2,
          currency: 'USD',
        }),
      ),
    );
  });

  it('should change existing Cart currency', () => {
    // given
    const targetCurrency = 'EUR';
    const conversionRate = 0.92;
    const converted = cart.getProducts().map(
      (p) =>
        new CartProduct(
          p.productId,
          p.quantity,
          Dinero({
            currency: targetCurrency,
            amount: p.price.multiply(conversionRate).getAmount(),
            precision: p.price.getPrecision(),
          }),
        ),
    );

    // when
    cart.changeCurrency('EUR', converted);
    cart.commit();

    // then
    expect(cart.getCurrency()).toEqual(targetCurrency);
  });

  it('should use recalculated products', () => {
    // given
    const targetCurrency = 'PLN';
    const recalculatedProduct = new CartProduct(
      cartProductId,
      5,
      Dinero({
        amount: 2300,
        precision: 2,
        currency: targetCurrency,
      }),
    );

    // when
    cart.changeCurrency(targetCurrency, [recalculatedProduct]);
    cart.commit();

    // then
    expect(cart.getProduct(cartProductId)?.price.getCurrency()).toEqual(
      targetCurrency,
    );
    expect(
      cart.getProduct(cartProductId)?.price.equalsTo(recalculatedProduct.price),
    ).toBe(true);
  });

  it('should throw ForbiddenDomainActionError when cart has been checked out', () => {
    const { cart } = createCartWithOneProductAdded();
    cart.markAsCheckedOut();
    cart.commit();

    // when
    expect(() =>
      cart.changeCurrency(cart.getCurrency(), cart.getProducts()),
    ).toThrow(ForbiddenDomainActionError);
  });
});
