const express =require('express');
const router = express.Router();
const auth=require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const axios =require('axios');

//@route  POST api/verifyemail
//@desc   verifyemail user
//@access Public

router.post("/",[
    check('email','Please enter valid email').isEmail()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    return res.status(400).json({ error: errors.array() });
try {
    const response = await axios.get(
      "https://emailvalidation.abstractapi.com/v1/?api_key=df971736b188480fba1e67464b7b2834&email="+req.body.email
    );
    

    res.json({deliverability:response.data.deliverability});
} catch (error) {
    return res.status(500).send('server error')
}
    
});


module.exports=router;