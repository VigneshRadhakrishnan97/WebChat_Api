const jwt =require('jsonwebtoken');
const config=require('config')

module.exports=function(req,res,next){
try {
    //if token not exist
    let token=req.header('jwt');
    if(!token){
        return res.status(401).json({errors:[{msg:'No token'}]});
    }

    //if token eexist
    let decoded = jwt.verify(token, config.get("jwtsecter"));
    
    req.user = decoded.user;
    next();

} catch (error) {
    console.log(error);
    return res.status(401).json({ errors: [{ msg: "Token is not valid" }] });
}
    
}