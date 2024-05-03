
import express = require('express');

import bodyParser = require('body-parser');

import config from "./config";
import {UserController} from './controllers/userController';
import UserRepository from "./data/repositories/userRepository";

const userController: UserController = new UserController(new UserRepository());

const app = express();

app.use(bodyParser.json());

app.post('/users/login', userController.loginUser);

app.post('/users', userController.addUser);

app.listen(config.PORT, () => {
  console.log(`User service listening at http://localhost:${config.PORT}`);
});
