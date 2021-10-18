const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User =require('../../model/User');
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const config=require('config');

//@route  POST api/user
//@desc   Register user
//@access Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email address").isEmail(),
    check("password", "Password should be greater than 6 digit").isLength({
      min: 6,
    }),
    check("role", "Please enter an user role").not().isEmpty(),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { name, email, password, role,profile } = req.body;
    try {

        //if user exist
        let user=await User.findOne({email});
        if(user)
        return res.status(400).json({error:[{msg:'User already exist'}]});

        //if user not exist
        const avatar=profile;

        user=new User({
            name,
            email,
            password,
            avatar,
            role
        });

        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);

        await user.save();

        const payload={
            user:{
            id:user.id}
        }

        //JWT
        jwt.sign(payload, config.get("jwtsecter"),{expiresIn:3600},(err,token)=>{
            if(err) throw err
            res.json({token});
        });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: [{msg:"Server Error"} ]});
    }

    
  }
);

module.exports = router;
