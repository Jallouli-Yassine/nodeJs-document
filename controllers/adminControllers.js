const express = require("express");
const bcrypt = require('bcrypt');
const mongoose = require('./../db/connect');
const User = require('./../models/user');
const app = express();
const jwt = require('jsonwebtoken')

//post : 
app.post('/register', (req, res) => {
    //1 - nekhou les données
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let admin = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        password: hashedPassword,
        role: "admin",
    });
    admin.save()
        .then(() => {
            res.status(200).send({ message: "admin registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR admin register !" });
        });
});

module.exports = app;
