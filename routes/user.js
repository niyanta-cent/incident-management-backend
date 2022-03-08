var express = require('express');
var router = express.Router();

let userController = require('../controllers/user');

router.get('/get-user-data',userController.getUserData);

router.post('/create-user',userController.createNewUser)

router.post('/login', userController.userLogin);

router.post('/findbyemail',userController.findByEmail);

router.post('/findbyusername',userController.findbyUsername);

router.post('/update/:id',userController.processUpdateUser);

module.exports = router;
