const express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const router = express.Router();

//check password
async function checkPassword(userPassword, passwordFromReq) {
    // if (await bcrypt.compare(passwordFromReq, userPassword)) {
    //     console.log('USER AUTHENTICATED');
    //     return true;
    // } else {
    //     console.log('AUTHENTICATION FAILED');
    // }
    if (!await bcrypt.compare(passwordFromReq, userPassword)) return false;
    console.log('USER AUTHENTICATED');
    return true;
}
async function hashPass(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

module.exports = { checkPassword, hashPass };