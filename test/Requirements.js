const test = require('ava');

const promotions = require('../src/data/promotions.json');

const ShoppingCart = require('../src/ShoppingCart');
const Catalogue = require('../src/models/Catalogue');

test('Test Case - Scenario 1', (t) => {
  const cart = new ShoppingCart();
  cart.new(promotions);

  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_large'));

  const unli1gb = cart.items.filter(item => item.productCode === 'ult_small').length;
  const unli5gb = cart.items.filter(item => item.productCode === 'ult_large').length;

  if (unli1gb === 3 && unli5gb === 1 && cart.total === 94.70) {
    t.pass();
  } else {
    t.fail();
  }
});

test('Test Case - Scenario 2', (t) => {
  const cart = new ShoppingCart();
  cart.new(promotions);

  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_large'));
  cart.add(Catalogue.findProduct('ult_large'));
  cart.add(Catalogue.findProduct('ult_large'));
  cart.add(Catalogue.findProduct('ult_large'));

  const unli1gb = cart.items.filter(item => item.productCode === 'ult_small').length;
  const unli5gb = cart.items.filter(item => item.productCode === 'ult_large').length;

  if (unli1gb === 2 && unli5gb === 4 && cart.total === 209.40) {
    t.pass();
  } else {
    t.fail();
  }
});

test('Test Case - Scenario 3', (t) => {
  const cart = new ShoppingCart();
  cart.new(promotions);

  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('ult_medium'));
  cart.add(Catalogue.findProduct('ult_medium'));

  const unli1gb = cart.items.filter(item => item.productCode === 'ult_small').length;
  const unli2gb = cart.items.filter(item => item.productCode === 'ult_medium').length;
  const data1gb = cart.items.filter(item => item.productCode === '1gb').length;

  if (unli1gb === 1 && unli2gb === 2 && data1gb === 2 && cart.total === 84.70) {
    t.pass();
  } else {
    t.fail();
  }
});

test('Test Case - Scenario 4', (t) => {
  const cart = new ShoppingCart();
  cart.new(promotions);

  cart.add(Catalogue.findProduct('ult_small'));
  cart.add(Catalogue.findProduct('1gb'), 'I<3AMAYSIM');

  const unli1gb = cart.items.filter(item => item.productCode === 'ult_small').length;
  const data1gb = cart.items.filter(item => item.productCode === '1gb').length;

  if (unli1gb === 1 && data1gb === 1 && cart.total === 31.32) {
    t.pass();
  } else {
    t.fail();
  }
});
