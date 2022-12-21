const express = require("express");
const { isAuthenticated, isSeller } = require("../middlewares/auth");
const upload = require("../utils/fileUpload");
const router = express.Router();

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
      // send ok response
      return res.status(200).json({
        status: "ok",
        productDetails,
      });
    });
  } catch (e) {
    console.log("error faced;", e);
    return res.status(500).send(e);
  }
});

module.exports = router;
