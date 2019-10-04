/**
 * setup.js
 * This is a one-time setup script for your server. It creates a set of fixtures,
 * namely products and SKUs, that are used to create a random basket session.
 */

'use strict';

const fs = require('fs');
const config = require('./config');
// const stripe = require('stripe');
const stripe = require('stripe')(config.stripe.secretKey);
// const stripe = require("stripe")("rk_test_fCG7ylYDJhcq9K7OL1wIlaLT00Llox0zyJ");
stripe.setApiVersion(config.stripe.apiVersion);

// this list of information matches our store's products on Stripe's backend.
const products = [
  {
    id: 'prod_FvZr8YZyO8zdxe',
    name: 'Cropped Hoodie: Storm - Small',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Small Standard', gender: 'Woman', color: 'Storm'},
  },
  // {
  //   id: 'prod_FvRAoznlX8LaIp',
  //   name: 'Cropped Hoodie: Storm - Medium',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Medium Standard', gender: 'Woman', color: 'Storm'},
  // },
  // {
  //   id: 'prod_FvRBN1XgItpT9Q',
  //   name: 'Cropped Hoodie: Storm - Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Large Standard', gender: 'Woman', color: 'Storm'},
  // },
  // {
  //   id: 'prod_FvRBiMCUvBVJaU',
  //   name: 'Cropped Hoodie: Storm - X-Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'X-Large Standard', gender: 'Woman', color: 'Storm'},
  // },
  // {
  //   id: 'prod_Fv5LZy8F2kVjXz',
  //   name: 'Cropped Hoodie: Heather Dust - Small',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Small Standard', gender: 'Woman', color: 'Heather Dust'},
  // },
  // {
  //   id: 'prod_FvR8VH1ZFbmCIm',
  //   name: 'Cropped Hoodie: Heather Dust - Medium',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Medium Standard', gender: 'Woman', color: 'Heather Dust'},
  // },
  // {
  //   id: 'prod_FvR9vYXL9lqjys',
  //   name: 'Cropped Hoodie: Heather Dust - Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Large Standard', gender: 'Woman', color: 'Heather Dust'},
  // },
  // {
  //   id: 'prod_FvR9bfTCVfT0MC',
  //   name: 'Cropped Hoodie: Heather Dust - X-Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'X-Large Standard', gender: 'Woman', color: 'Heather Dust'},
  // },
  // {
  //   id: 'prod_FvRCXAX9oHeBeS',
  //   name: 'Crewneck Sweatshirt: White - Small',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Small Standard', gender: 'Unisex', color: 'White'},
  // },
  // {
  //   id: 'prod_FvRDlRND1kcTvp',
  //   name: 'Crewneck Sweatshirt: White - Medium',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Medium Standard', gender: 'Unisex', color: 'White'},
  // },
  // {
  //   id: 'prod_FvRD1UgaxJCsga',
  //   name: 'Crewneck Sweatshirt: White - Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Large Standard', gender: 'Unisex', color: 'White'},
  // },
  // {
  //   id: 'prod_FvREggY6FIgr2X',
  //   name: 'Crewneck Sweatshirt: White - X-Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'X-Large Standard', gender: 'Unisex', color: 'White'},
  // },
  // {
  //   id: 'prod_FvRE6lOo6MYncj',
  //   name: 'Crewneck Sweatshirt: Peach - Small',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Small Standard', gender: 'Unisex', color: 'Peach'},
  // },
  // {
  //   id: 'prod_FvRFHXrUC61STL',
  //   name: 'Crewneck Sweatshirt: Peach - Medium',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'Medium Standard', gender: 'Unisex', color: 'Peach'},
  // },
  {
    id: 'prod_FvZsIrqJRdYWfL',
    name: 'Crewneck Sweatshirt: Peach - Large',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Large Standard', gender: 'Unisex', color: 'Peach'},
  },
  // {
  //   id: 'prod_FvRFSa5FJE4ZdX',
  //   name: 'Crewneck Sweatshirt: Peach - X-Large',
  //   price: 4000,
  //   currency: 'usd',
  //   attributes: {size: 'X-Large Standard', gender: 'Unisex', color: 'Peach'},
  // },
  {
    id: 'prod_FvZkL7s3aiYp5L',
    name: 'Donation - $100',
    price: 10000,
    currency: 'usd',
    attributes: {amount: '$100'},
  },
];

// Creates a collection of Stripe Products and SKUs to use in your storefront
const createStoreProducts = async () => {
  try {
    const stripeProducts = await Promise.all(
      products.map(async product => {
        const stripeProduct = await stripe.products.create({
          id: product.id,
          name: product.name,
          type: 'good',
          attributes: Object.keys(product.attributes),
          metadata: product.metadata,
        });

        const stripeSku = await stripe.skus.create({
          product: stripeProduct.id,
          price: product.price,
          currency: config.currency,
          attributes: product.attributes,
          inventory: {type: 'infinite'},
        });

        return {stripeProduct, stripeSku};
      })
    );

    console.log(
      `🛍️  Successfully created ${
        stripeProducts.length
      } products on your Stripe account.`
    );
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
    return;
  }
};

// Set up the Stripe CLI.
// https://github.com/stripe/stripe-cli
const writeCLIConfig = async () => {
  const configFilePath = `${process.env.HOME}/.config/stripe`;
  const stripeCLIConfig = `
[stripe-payments-demo]
  device_name = "stripe-payments-demo"
  secret_key = "${config.stripe.secretKey}"
`;

  if (!fs.existsSync(configFilePath)) {
    fs.mkdirSync(configFilePath);
  }

  fs.readFile(`${configFilePath}/config.toml`, function(err, data) {
    if (err || !data.includes('stripe-payments-demo')) {
      fs.appendFileSync(`${configFilePath}/config.toml`, stripeCLIConfig);
      console.log(`Stripe CLI configuration set up.`);
    }
  });
};

writeCLIConfig();
createStoreProducts();
