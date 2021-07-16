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
    let user = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        password: hashedPassword,
        role: "user",
    });
    user.save()
        .then(() => {
            res.status(200).send({ message: "User registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR User register !" });
        });
});

app.post('/login', (req, res) => {
    let email = req.body._email;
    let password = req.body._password;
    User.findOne({ email: email }).then((user) => {
        if (!user)
            res.status(400).send({ message: "email incorrect !" });
        else {
            let compare = bcrypt.compareSync(password, user.password);
            if (!compare)
                res.status(404).send({ message: "password incorrect !" });
            else {
                //json web token 
                let objet = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                }
                let mytoken = jwt.sign(objet, "myKey");
                res.status(200).send({ token: mytoken });
            }
        }

    }).catch((e) => {
        res.status(400).send(e);
    })
})

//get : 
app.get('/all', async (req, res) => {
    try {
        let users = await User.find({ role: 'user' })
        res.status(200).send({ users });
    } catch (error) {
        res.status(400).send({ message: "error !" })
    }
})

app.get('/one/:idUser', async (req, res) => {
    try {
        let id = req.params.idUser;
        let user = await User.findOne({ role: "user", _id: id })
        if (!user)
            res.status(400).send({ message: "user not found !" })
        else
            res.status(200).send({ user })
    } catch (error) {
        res.status(400).send({ message: "error !" })
    }
})

//DELETE

//delete all
app.delete('/deleteAll', async (req, res) => {
    try {
        let users = await User.find({ role: 'user' })
        if (users.length != 0) {
            for (let i = 0; i < users.length; i++) {
                User.findOneAndRemove({ _id: users[i].id }).then((user) => {
                    if (!user)
                        res.status(400).send({ message: "user not found !" })
                    else {
                        res.status(200).send({ message: done });
                    }
                }).catch((e) => {
                    res.status(400).send(e);
                })
            }
        } else
            res.status(400).send({ message: "table already deleted" })
    } catch (error) {
        res.status(404).send(error);
    }

})

//delete one
app.delete('/deleOne/:idUser', (req, res) => {
    let id = req.params.idUser;
    User.findOneAndRemove({ role: "user", _id: id }).then((user) => {
        if (!user)
            res.status(400).send({ message: "user nexiste pas!" })
        else
            res.status(200).send(user)
    }).catch(e => {
        res.status(400).send(e)
    })

})

app.patch('/update/:idUser', (req, res) => {

    let id = req.params.idUser;
    let data = req.body;

    //2 - creation d'un object <= data
    let userUpdated = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        role: "user",
    });

    User.findOne({ role: "user", _id: id })
        .then((user) => {
            if (!user) {
                res.status(400).send({ message: "user not found !" })
            } else {
                user.firstname = userUpdated.firstname;
                user.lastname = userUpdated.lastname;
                user.email = userUpdated.email;
                user.phone = userUpdated.phone;
                user.save();
                res.status(200).send({ message: "User Info updated !" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "error !" })
        })
});

module.exports = app;