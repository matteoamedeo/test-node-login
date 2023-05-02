const { insertUser, sequelize, getUser, deleteUser, checkPassword } = require('./user.controller')

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


sequelize.sync().then(async () => {
    console.log('User table created successfully!');

    insertUser('test8@gmail.com', 'newTestPass22');
    // getUser('test7@gmail.com')
    // checkPassword(await getUser('test7@gmail.com'), 'newTestPass');




    //delete user
    // User.destroy({
    //     where: {
    //         id: [12]
    //     }
    // }).then((res) => {
    //     console.log(`Successfully deleted record: ${res}`)
    // }).catch((error) => {
    //     console.error('Failed to delete record : ', error);
    // });

    //get user and check password
    // User.findOne({
    //     where: {
    //         id: "17"
    //     }
    // }).then(async res => {
    //     // console.log(res.dataValues);
    //     const userFound = res.dataValues;
    //     console.log(userFound.password);
    //     if (await bcrypt.compare('testPassword2', userFound.password)) {
    //         console.log('UTENTE AUTENTICATO');
    //     } else {
    //         console.log('UTENTE NON AUTENTICATO');
    //     }

    // }).catch((error) => {
    //     console.error('Failed to retrieve data : ', error);
    // });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});