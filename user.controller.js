const express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const router = express.Router();
const fs = require('fs');


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

async function hashPass(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

//insert user
async function insertUser(username, password) {
    User.create({
        username: username,
        password: await hashPass(password)
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('This Username already exists');
        }
    });
}

//delete user
function deleteUser(username) {
    User.destroy({
        where: {
            username: username
        }
    }).then((res) => {
        console.log(`Successfully deleted record: ${res}`)
    }).catch((error) => {
        console.error('Failed to delete record : ', error);
    });
}

//get user
router.get('/getUser', (req, res) => {
    sequelize.sync().then(async () => {
        console.log('User table created successfully!');

        User.findOne({
            where: {
                username: 'test9@gmail.com'
            }
        }).then((user) => {
            const userFound = user.dataValues;
            // console.log('User found: ', userFound);
            res.send(userFound);
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
})

async function getAllUsers() {
    await sequelize.sync().then(async () => {
        console.log('User table created successfully!');
        await User.findAll().then((res) => {
            let html = `<div class="usersContainer"><ul>`
            res.forEach(r => {
                // console.log(r.dataValues);
                html += `<li>${r.dataValues.username}</li>`
            });
            html += `</ul></div>`;
            console.log(html);
            return html;
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}
//get all users
router.get('/getUsers', (req, res) => {
    sequelize.sync().then(async () => {
        console.log('User table created successfully!');

        User.findAll().then((users) => {
            let html = `<form action="*/deleteUser" method="POST"><div class="usersContainer"><ul>`
            users.forEach(user => {
                // console.log(r.dataValues);
                html += `<li><a href='/user/deleteUser'>${user.dataValues.username}</a></li>`
            });
            html += `</ul></div></form>`;
            console.log(html);
            res.send(html)
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

})

//insert user
router.get('/insertUser', (req, res) => {
    res.render('insertUser');
})
router.post('/insertUser', (req, res) => {
    sequelize.sync().then(async () => {
        console.log('User table created successfully!');
        insertUser(req.body.username, req.body.password);
        res.send('User Saved')
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

})

//delete user
router.get('/deleteUser', (req, res) => {
    console.log('GET DELETE USER');
    // deleteUserEJS = deleteUserEJS.replace('[users]', 'coao')
    sequelize.sync().then(async () => {
        console.log('User table created successfully!');

        User.findAll().then((users) => {
            let html = ''
            let usersArr = [];
            users.forEach(user => {
                // console.log(user.dataValues);
                usersArr.push(user.dataValues);
                html += `<li>${user.dataValues.username}</li>`
            });
            // deleteUserEJS = deleteUserEJS.replace('[users]', html)
            console.log(usersArr);
            res.render('deleteUser', { usersEjs: usersArr })
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

})
router.post('/deleteUser', (req, res) => {

    sequelize.sync().then(() => {
        console.log('POST delete request - User table created successfully!');
        // deleteUser(req.body.username);
        User.destroy({
            where: {
                username: req.body.username
            }
        }).then((user) => {
            console.log(`POST delete request - Successfully deleted record: ${user}`)
            res.send('userDeleted');
        }).catch((error) => {
            console.error('Failed to delete record : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

})
router.get('/userDeleted', (req, res) => {
    res.render('userDeleted')
})

//check password
async function checkPassword(username, passwordFromReq) {
    const userPassword = getUser(username);
    if (await bcrypt.compare(passwordFromReq, userPassword)) {
        console.log('USER AUTHENTICATED');
    } else {
        console.log('AUTHENTICATION FAILED');
    }
}

module.exports = router;