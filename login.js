const express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const router = express.Router();
const { checkPassword, hashPass } = require('./userInterface')


const sequelize = new Sequelize(
    'test_node',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const User = sequelize.define("users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// async function hashPass(password) {
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
// }

router.get('/login', (req, res) => {
    console.log(req.body);
    res.render('login');
    // res.render('login', { message: req.flash('loginFallito') })
})
router.post('/login', (req, res) => {
    sequelize.sync().then(async () => {
        console.log('Login - User table created successfully!');

        User.findOne({
            where: {
                username: req.body.username,
            }
        }).then(async (user) => {
            const userFound = user.dataValues;
            console.log('User found: ', userFound.password);

            // if password is correct render Dashboard, else redirect to login
            if (!await checkPassword(userFound.password, req.body.password)) res.redirect('/login');
            res.render('dashboard');

        }).catch((error) => {
            console.error('Login - Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
})

module.exports = router;