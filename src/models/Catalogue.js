const Product = require('./Product');
const productsData = require('../data/products.json');

class Catalogue {
  constructor() {
    this.products = productsData.map((item) => {
      const { productCode, productName, price } = item;
      return new Product(productCode, productName, price);
    });
  }

  findProduct(productCode) {
    return this.products.find(product => product.productCode === productCode);
  }
}

module.exports = new Catalogue();
