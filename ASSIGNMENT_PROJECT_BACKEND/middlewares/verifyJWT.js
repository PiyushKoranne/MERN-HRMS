const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next)=>{
        const auth = req.headers.authorization || req.headers.Authorization;
        if(!auth?.startsWith('Bearer ')){ res.sendStatus(403); return;}

        const token = auth.split(" ")[1];
        if(token){
            jwt.verify(token, process.env.JWTACCESSTOKENKEY, (err, decoded)=>{
                if(err){ res.sendStatus(403); return;}
                req.name = decoded.name;
                req.role = decoded.role;
                console.log(req.role)
                next();
            })

    }
}

module.exports = {verifyJWT};