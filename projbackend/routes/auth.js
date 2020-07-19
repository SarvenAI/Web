const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { signout , signup, signin,isSignedIn  } = require("../controllers/auth.js")


router.post(
    "/signup",
    [
    check("name", "name should be atleast 3 character").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "atleast 3 char ").isLength({min: 3})
    ],
    signup
);

router.post(
    "/signin",
    [
    check("email", "email is required").isEmail(),
    check("password", "password field is required ").isLength({min: 3})
    ],
    signin
);


router.get("/signout",signout);

router.get("/testroute",isSignedIn,(req,res) => {
    res.json(req.auth);
});

module.exports = router;