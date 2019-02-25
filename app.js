/* eslint-disable no-console */
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promotions = require('./src/data/promotions.json');
const promos = require('./src/data/promos.json');

const Catalogue = require('./src/models/Catalogue');
const ShoppingCart = require('./src/ShoppingCart');

const shoppingCart = new ShoppingCart();
const cart = shoppingCart.new(promotions);

function padText(str) {
  const pad = '               ';
  return (str + pad).substring(0, pad.length);
}

function printCatalogue() {
  console.log(`${padText('Product Code')} | ${padText('Product Name')} | ${padText('Price')}`);
  Catalogue.products.forEach((element) => {
    console.log(`${padText(element.productCode)} | ${padText(element.productName)} | $${padText(element.price.toFixed(2))}`);
  });
}

function viewCart() {
  if (cart.items.length > 0) {
    console.log('Your Cart Items: ');
    Catalogue.products.forEach((product) => {
      const quantity = cart.items.filter(item => item.productCode === product.productCode).length;
      if (quantity > 0) {
        console.log(`${quantity} x ${product.productName}`);
      }
    });
  } else {
    console.log('You have an empty cart. ');
  }
  console.log(`Total: ${cart.total.toFixed(2)}`);
}

function printMenu() {
  console.log('Welcome to Amaysim Shopping Cart');
  console.log('1 - View Catalogue');
  console.log('2 - View Cart');
  console.log('3 - Add Item to Cart');
  console.log('4 - Apply Promo Code');
  console.log('9 - Print Menu');
  console.log('');
  console.log('Press CTRL+C to exit.');
  console.log('');
}

function app() {
  printMenu();
  rl.on('line', (line) => {
    switch (line.trim()) {
      case '1':
        printCatalogue();
        break;
      case '2':
        viewCart();
        break;
      case '3':
        console.log('Enter product code:');
        break;
      case '4':
        console.log('Enter promo code:');
        break;
      case '9':
        printMenu();
        break;
      default: {
        const item = Catalogue.findProduct(line.trim());
        const validPromo = promos.find(promo => promo.code === line.trim());
        if (item) {
          cart.add(item);
          console.log(`1 x ${item.productName} Added!`);
        }
        if (validPromo) {
          cart.applyPromoCode(validPromo.code);
          console.log(`${validPromo.code} Promo Applied`);
        }
        break;
      }
    }
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });
}

app();
