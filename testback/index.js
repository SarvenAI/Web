const express = require("express");

const app = express();

const port = 3000;

const admin = (req,res) => {
    return res.send("home dashboard ");
};

app.get('/signout', (req,res) => {
    return res.send("you are sign out"); 
});

app.get('/signup', (req,res) => {
    return res.send("signup"); 
});


const isLoggedin = (req,res, next) => {
    console.log("IsLogged");
    next();
};

const isAdmin = (req,res, next) => {
    console.log("isAdmin is running");
    next();
};

app.get('/admin',isLoggedin,isAdmin,admin);

app.get('/saran', (req,res) => {
    return res.send("saran"); 
});

app.get('/', (req,res) => {
    return res.send("Home Page"); 
});

app.get('/login', (req,res) => {
    return res.send("you are visiting login route"); 
});

app.listen(port,() => {
    console.log("server is up and running")
})