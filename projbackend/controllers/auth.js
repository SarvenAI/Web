const User = require("../models/user");
const { unset, reduce } = require("lodash");
const { body, validationResult, check } = require('express-validator');
const { use } = require("../routes/auth");

const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");



exports.signup = (req, res ) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            Param: errors.array()[0].param
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT ABLE TO SAVE USER IN DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    } )
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
   const {email,password} = req.body;

   if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            Param: errors.array()[0].param
        })
    }

    User.findOne({email},(err,user) => {
        if(err){
            return res.status(400).json({
                error: "User email does not exists"
            })
        }
        if(!user){
            return res.status(400).json({
                error: "User not found"
            })
        }
 
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password not match"
            })
        }

        // CREATE TOKEN
        const token = jwt.sign({_id: user._id},process.env.SECRET)
        //PUT TOKEN IN COOKIE
        res.cookie("token",token,{expire: new Date() + 9999})
        //SEND RESPONSE TO FRON END
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}})

    })

};

exports.signout = (req, res ) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};

//PRODECTED ROUTES
exports.isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
})



//CUSTOM MIDDLEWARES

exports.isAuthenticated = (req,res,next) =>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) =>{
    if(req.profile.role === 0 ){
        return res.status(403).json({
            error:"U r not Admin Access denied"
        })
    }
    next();
}