const express = require("express");
const { isAuthenticated, isSeller, isBuyer } = require("../middlewares/auth");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const upload = require("../utils/fileUpload");
const router = express.Router();

const { WebhookClient } = require("discord.js");

// take url from discord=>settings=> integrations=> webhook => https://discord.com/api/webhooks/1055480440363958332/Lq3fCCAwCo0UoCxRruHuMmOXw5B26-HeDOW9WrtAu9rdVFxSoumXo0FxRTv8oScfKf-S
const webhookClient = new WebhookClient({
  url: "https://discord.com/api/webhooks/1055480440363958332/Lq3fCCAwCo0UoCxRruHuMmOXw5B26-HeDOW9WrtAu9rdVFxSoumXo0FxRTv8oScfKf-S",
});

// stripe secret key - sk_test_51MHoEsSFkkhYozOdB0XAyM4u3SXMTnmNONPE0LyaS6cV0vSeAmxPSr9HUxb3iTvx9ZBrMHAK8DmRYXvu90mY56Ga00DffOYFyv
const stripe = require("stripe")(
  "sk_test_51MHoEsSFkkhYozOdB0XAyM4u3SXMTnmNONPE0LyaS6cV0vSeAmxPSr9HUxb3iTvx9ZBrMHAK8DmRYXvu90mY56Ga00DffOYFyv"
);

router.post("/create", isAuthenticated, isSeller, (req, res) => {
  try {
    // upload function to upload a file in local storage content
    upload(req, res, async (error) => {
      if (error) {
        console.log("error is", error);
        return res.status(500).send(error);
      }

      // name and price and content check fields
      const { name, price } = req.body;
      if (!name || !price || !req.file) {
        return res.status(400).json({
          error: "need all required fields to allow showing a product.",
        });
      }

      if (Number.isNaN(price)) {
        return res.status(400).json({
          error: " price has to be a numeric value",
        });
      }

      let productDetails = {
        name,
        price,
        content: req.file.path,
      };
      // save product details in databse if everything is good??
      const savedProduct = await Product.create(productDetails);
      // send ok response
      return res.status(200).json({
        status: "ok",
        productDetails: savedProduct,
      });
    });
  } catch (e) {
    console.log("error faced;", e);
    return res.status(500).send(e);
  }
});

// create a get request to display all the products for a buyer
router.get("/get/all", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      products,
    });
  } catch (e) {
    console.log("this is error:", e);
    return res.status(500).send(e);
  }
});

// create a post request for selection of product for user (like add to cart).. productid is saved in params
router.post("/buy/:productId", isAuthenticated, isBuyer, async (req, res) => {
  try {
    const productFind = await Product.findOne({
      where: { id: req.params.productId },
    });

    const product = productFind?.dataValues;
    console.log("consoling prdt:", product);
    if (!product) {
      return res.status(404).json({
        error: "product does not exist",
      });
    }

    // if product is found in databse which matches product id in params, create order OBJECT
    const orderDetails = {
      productId: req.params.productId,
      buyerId: req.user.id,
    };

    // get card details from post, hard code for now
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 6,
        exp_year: 2023,
        cvc: "314",
      },
    });

    // use paymethod id for Payment Intent, make actual payment using card
    // hardcoded amount: product.dataValues.price and api call worked
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      //   payment successful is true
      confirm: true,
    });

    // if payment intent is true, save order details in db and return it back to client
    if (paymentIntent) {
      const savedOrder = await Order.create(orderDetails);
      // sending a discord notification - https://discordjs.guide/popular-topics/webhooks.html#sending-messages
      webhookClient.send({
        content: `Order successfully created for order: ${savedOrder.id}`,
        username: "MyEcommApp",
        avatarURL: "https://i.imgur.com/AfFp7pu.png",
      });

      return res.status(200).json({
        savedOrder,
      });
    } else {
      return res.status(400).json({
        error: "payment failed",
      });
    }
    // else if payment is not paid, 400 code - payment failed
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
