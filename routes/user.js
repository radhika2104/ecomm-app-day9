const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
// console.log("does code enter this file? ");
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - isSeller
 *      properties:
 *        id:
 *          type: INTEGER
 *          description: auto-generated id
 *        name:
 *          type: STRING
 *          description: name of user
 *        email:
 *          type: STRING
 *          description: email of user
 *        password:
 *          type: STRING
 *          description: password of user
 *        isSeller:
 *          type: BOOLEAN
 *          description: whether user is a seller
 *      example:
 *        name: Radhika
 *        email: radhika@gmail.com
 *        password: asdf@123
 *        isSeller: false
 *
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *  post:
 *    summary: creating a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *         description: The user was successfully created
 *      403:
 *         description: There was already an existing user with the same email
 *      400:
 *         description: Validation failed for the name, email or password
 *      500:
 *         description: Some server error
 */
router.post("/signup", async (req, res) => {
  //   console.log("check error level 0");
  try {
    // taking inputs from user for signup
    console.log("consoling res.body as it is coming undefined", res.body);
    const { name, email, password, isSeller } = req.body;
    // checking if user already exists
    // console.log("check error level 0.5");
    console.log("consoling email as it is coming undefined", email);
    console.log("consoling name,pass,seller:", name, password, isSeller);
    const existingUser = await User.findOne({ where: { email: email } });
    // console.log("check error level 0.8");
    if (existingUser) {
      return res
        .status(403)
        .json({ error: "User already exists. Please try logging in." });
    }
    // check if inputs are valid
    // console.log("check error level 1");
    if (!validateName) {
      return res
        .status(400)
        .json({ error: "Please enter a valid Name with alphabets only" });
    }
    if (!validateEmail) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email with @ and ." });
    }
    if (!validatePassword) {
      return res.status(400).json({
        error:
          "Please enter a valid password with atleast 1 uppercase, 1 smallcase, 1 special char.",
      });
    }
    // console.log("check error level 2");
    // if inputs are valid - hash the password
    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

    // enter the object user into model User as a field entry and return a 200 message code to browser
    const user = {
      name,
      email,
      isSeller,
      password: hashedPassword,
    };
    console.log("consoling pass & user:: ", hashedPassword, user);
    const createdUser = await User.create(user);
    // console.log("check error level 3");
    return res.status(200).send({
      message: "User successfully signed up!",
    });
  } catch (e) {
    console.log(">>>>", e);
    return res.status(500).send(e);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // check email and password lengths
    if (email.length === 0) {
      return res.status(400).json({ error: "Please enter a email" });
    }

    if (password.length === 0) {
      return res.status(400).json({ error: "Please enter a password" });
    }
    // check if user exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (!existingUser) {
      return res.status(404).json({
        error: "User does not exist.",
      });
    }
    // if user exists then match the password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        error: "Email or password does not match",
      });
    }
    // create JWT token to check user credentails for authentication and save it in cookie
    // backend can access cookie for cals to any further apis while user is signed in
    //  remove this cookie on sign out
    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, "HAHA", {
      expiresIn: 360000,
    });
    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    return res.status(200).json({ bearerToken });
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/signout", async (req, res) => {
  try {
    // delete the cookie

    res.clearCookie("t");
    return res.status(200).json({ message: "cookie deleted" });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
