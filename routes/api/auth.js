const express = require("express");
const router = express.Router();
const auth=require('../../middleware/auth');
const { check, validationResult } = require("express-validator");
const User=require('../../model/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route  GET api/user
//@desc   Get userdetails
//@access Private
router.get("/",auth, async (req, res) => {
  
  try {
    let user=await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});



//@route  POST api/auth
//@desc   Login user
//@access Public
router.post(
  "/",
  [
    
    check("email", "Please enter valid email address").isEmail(),
    check("password", "please enter the password").exists()
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //if  user not exist
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ error: [{ msg: "Invalid Credentials" }] });

      //if user  exist
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch)
        return res.status(400).json({ error: [{ msg: "Invalid Credentials" }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      //JWT
      jwt.sign(
        payload,
        config.get("jwtsecter"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: [{msg:"Server Error"} ]});
    }

    
  }
);

module.exports = router;
