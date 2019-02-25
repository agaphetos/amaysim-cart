const test = require('ava');

const Catalogue = require('../../src/models/Catalogue');
const productsData = require('../../src/data/products.json');

test('Initialize Catalogue', (t) => {
  if (productsData.length === Catalogue.products.length) {
    t.pass();
  } else {
    t.fail();
  }
});

test('Catalogue.findProduct(productCode) - valid Product', (t) => {
  const product = Catalogue.findProduct('ult_medium');

  t.is(product.productCode, 'ult_medium');
});

test('Catalogue.findProduct(productCode) - invalid Product', (t) => {
  const product = Catalogue.findProduct('ult_extra');

  t.is(product, undefined);
});
