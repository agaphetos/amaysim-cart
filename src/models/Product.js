class Product {
  constructor(productCode, productName, price) {
    if (productCode || productName || price) {
      this.productCode = productCode;
      this.productName = productName;
      this.price = price;
    }
  }
}

module.exports = Product;
