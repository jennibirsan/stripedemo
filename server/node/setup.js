/**
 * setup.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * This is a one-time setup script for your server. It creates a set of fixtures,
 * namely products and SKUs, that are used to create a random basket session.
 */

'use strict';

const fs = require('fs');
const config = require('./config');
const stripe = require('stripe')(config.stripe.secretKey);
stripe.setApiVersion(config.stripe.apiVersion);

// Replace this list with information about your store's products.
const products = [
  {
    id: '',
    name: 'Cropped Hoodie',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Small Standard', gender: 'Woman', color: 'Storm'},
  },
  {
    id: 'stormcropped',
    name: 'Cropped Hoodie',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Medium Standard', gender: 'Woman', color: 'Storm'},
  },
  {
    id: 'stormcropped',
    name: 'Cropped Hoodie',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Large Standard', gender: 'Woman', color: 'Storm'},
  },
  {
    id: 'stormcropped',
    name: 'Cropped Hoodie',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'X-Large Standard', gender: 'Woman', color: 'Storm'},
  },
  {
    id: 'prod_Fv5LZy8F2kVjXz',
    name: 'Cropped Hoodie: Heather Dust - Small',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Small Standard', gender: 'Woman', color: 'Heather Dust'},
  },
  {
    id: 'heatherdustcropped',
    name: 'Cropped Hoodie: Heather Dust - Medium',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Medium Standard', gender: 'Woman', color: 'Heather Dust'},
  },
  {
    id: 'heatherdustcropped',
    name: 'Cropped Hoodie: Heather Dust - Large',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Large Standard', gender: 'Woman', color: 'Heather Dust'},
  },
  {
    id: 'heatherdustcropped',
    name: 'Cropped Hoodie: Heather Dust - X-Large',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'X-Large Standard', gender: 'Woman', color: 'Heather Dust'},
  },
  {
    id: 'whitecrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Small Standard', gender: 'Unisex', color: 'White'},
  },
  {
    id: 'whitecrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Medium Standard', gender: 'Unisex', color: 'White'},
  },
  {
    id: 'whitecrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Large Standard', gender: 'Unisex', color: 'White'},
  },
  {
    id: 'whitecrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'X-Large Standard', gender: 'Unisex', color: 'White'},
  },
  {
    id: 'peachcrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Small Standard', gender: 'Unisex', color: 'Peach'},
  },
  {
    id: 'peachcrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Medium Standard', gender: 'Unisex', color: 'Peach'},
  },
  {
    id: 'peachcrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'Large Standard', gender: 'Unisex', color: 'Peach'},
  },
  {
    id: 'peachcrewneck',
    name: 'Crewneck Sweatshirt',
    price: 4000,
    currency: 'usd',
    attributes: {size: 'X-Large Standard', gender: 'Unisex', color: 'Peach'},
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
