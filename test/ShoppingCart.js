const test = require('ava');

const promotions = require('../src/data/promotions.json');
const promos = require('../src/data/promos.json');

const ShoppingCart = require('../src/ShoppingCart');
const Catalogue = require('../src/models/Catalogue');

test('Initialize Shopping Cart', (t) => {
  const cart = new ShoppingCart();

  if (cart.items instanceof Array && cart.total === 0) {
    t.pass();
  } else {
    t.fail();
  }
});

test('ShoppingCart.new(pricingRules) - valid', (t) => {
  const shoppingCart = new ShoppingCart();
  const valid = shoppingCart.new(promotions);

  t.is(valid.pricingRules, promotions);
});

test('ShoppingCart.new(pricingRules) - invalid', (t) => {
  const shoppingCart = new ShoppingCart();
  const invalid = shoppingCart.new();

  t.is(invalid.pricingRules, undefined);
});

test('ShoppingCart.add(item) - valid item', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('ult_small');
  cart.add(item);

  t.is(cart.items.length, 1);
});

test('ShoppingCart.add(item) - invalid item', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('utc_small');
  cart.add(item);

  t.is(cart.items.length, 0);
});

test('ShoppingCart.applyPromoCode(code) - valid code', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('ult_small');
  cart.add(item);

  const code = 'I<3AMAYSIM';
  const validPromo = promos.find(promo => promo.code === code);
  cart.applyPromoCode('I<3AMAYSIM');

  t.is(validPromo.code, code);
});

test('ShoppingCart.applyPromoCode(code) - invalid code', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('ult_small');
  cart.add(item);

  const code = 'IHEARTAMAYSIM';
  const invalidPromo = promos.find(promo => promo.code === code);
  cart.applyPromoCode('IHEARTAMAYSIM');

  t.is(invalidPromo, undefined);
});

test('ShoppingCart.add(item) - valid item, valid code', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('ult_small');
  cart.add(item, 'I<3AMAYSIM');

  const discounted = Math.round((item.price - (item.price * 0.1)) * 100) / 100;

  t.is(cart.total, discounted);
});

test('ShoppingCart.clear() - execute', (t) => {
  const cart = new ShoppingCart();

  const item = Catalogue.findProduct('utc_small');
  cart.add(item);
  cart.clear();

  if (cart.items instanceof Array && cart.total === 0 && cart.pricingRules === undefined) {
    t.pass();
  } else {
    t.fail();
  }
});
