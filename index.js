const express = require("express");
const bodyParser = require('body-parser');
const app = express();

//controllers : 
const userController = require('./controllers/userControllers');
const adminController = require('./controllers/adminControllers');
app.use(bodyParser.json());
app.use('/user', userController);
app.use('/admin', adminController);

app.listen(3000, () => console.log("serveur activer!!"));
