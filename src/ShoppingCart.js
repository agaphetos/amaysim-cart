const promos = require('./data/promos.json');
const Catalogue = require('./models/Catalogue');
const Product = require('./models/Product');

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  new(pricingRules) {
    if (pricingRules) {
      this.pricingRules = pricingRules;
    }
    return this;
  }

  add(item, promoCode) {
    if (item) {
      this.items.push(item);
    }

    if (this.pricingRules) {
      this.applyPromotions();
    }

    if (promoCode) {
      this.applyPromoCode(promoCode);
    }

    this.computeTotal();
  }

  applyPromoCode(code) {
    const promo = promos.find(item => item.code === code);
    this.promo = promo;

    this.computeTotal();
  }

  clear() {
    this.items = [];
    this.total = 0;
    this.pricingRules = undefined;
  }

  computeTotal() {
    if (this.items.length > 0) {
      this.total = this.items.map(item => item.price).reduce((acc, cur) => acc + cur);
      this.total = Math.round(this.total * 100) / 100;
    }

    if (this.promo) {
      this.total -= Math.round((this.total * this.promo.discount) * 100) / 100;
      this.total = Math.round(this.total * 100) / 100;
    }
  }

  applyPromotions() {
    this.pricingRules.forEach((promotion) => {
      const { eligibility, reward } = promotion;
      const itemsEligible = this.items.filter(item => item.productCode === eligibility.productCode);

      if (itemsEligible.length > 0) {
        let rewards;
        switch (eligibility.condition) {
          case 'more_than':
            rewards = itemsEligible.length > eligibility.quantity ? reward : null;
            break;
          case 'equal':
            if (itemsEligible.length >= eligibility.quantity
              && itemsEligible.length % eligibility.quantity === 0) {
              rewards = {
                type: reward.type,
                productCode: reward.productCode,
                quantity: eligibility.quantity,
                target: Math.trunc(itemsEligible.length / eligibility.quantity) * reward.target,
                price: reward.price,
              };
            }
            break;
          default:
            break;
        }

        if (rewards) {
          switch (rewards.type) {
            case 'discount':
              if (rewards.target === 'all') {
                this.items = this.items.map((item) => {
                  if (item.productCode === rewards.productCode) {
                    const { productCode, productName } = item;
                    return new Product(
                      productCode,
                      productName,
                      rewards.price,
                    );
                  }
                  return item;
                });
              } else if (typeof rewards.target === 'number') {
                const notDiscounted = itemsEligible.filter(item => item.price !== rewards.price);
                if (notDiscounted.length >= eligibility.quantity) {
                  for (let i = 0; i < rewards.target; i += 1) {
                    const targetIndex = this.items
                      .findIndex(item => (
                        item.productCode === rewards.productCode
                        && item.price !== rewards.price
                      ));

                    if (targetIndex > -1) {
                      this.items[targetIndex] = {
                        productCode: this.items[targetIndex].productCode,
                        productName: this.items[targetIndex].productName,
                        price: rewards.price,
                      };
                    }
                  }
                }
              }
              break;
            case 'free':
              for (let i = 0; i < rewards.quantity; i += 1) {
                this.items.push(new Product(
                  rewards.productCode,
                  Catalogue.findProduct(rewards.productCode).productName,
                  rewards.price,
                ));
              }
              break;
            default:
              break;
          }
        }
      }
    });
  }
}

module.exports = ShoppingCart;
