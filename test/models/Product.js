const test = require('ava');

const Product = require('../../src/models/Product');

test('Initialize Product - valid', (t) => {
  const valid = new Product('sample_product_code', 'Sample Product Name', 10.5);

  if (valid.productCode === 'sample_product_code'
    && valid.productName === 'Sample Product Name'
    && valid.price === 10.5) {
    t.pass();
  } else {
    t.fail();
  }
});

test('Initialize Product - empty', async (t) => {
  const valid = new Product();

  if (valid.productCode === undefined
    && valid.productName === undefined
    && valid.price === undefined) {
    t.pass();
  } else {
    t.fail();
  }
});
