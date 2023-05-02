const { Sequelize, DataTypes } = require("sequelize");


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


const Book = sequelize.define("books", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATEONLY,
    },
    subject: {
        type: DataTypes.INTEGER,
    }
});

sequelize.sync().then(() => {
    console.log('Book table created successfully!');

    //INSERT BOOK
    // Book.create({
    //     title: "Clean Code 2",
    //     author: "Robert Cecil Martin 2",
    //     release_date: "2021-12-14",
    //     subject: 3
    // }).then(res => {
    //     console.log(res)
    // }).catch((error) => {
    //     console.error('Failed to create a new record : ', error);
    // });

    //UPDATE BOOK
    Book.update({
        title: "Clean Code UPDATE 4",
        author: "Robert Cecil Martin UPDATE 4",
        release_date: "2021-12-14",
        subject: 3
    }, {
        where: { id: [1, 4] } //update multiple records
    }).then(res => {
        console.log(`Successfully updated ${res} record/s`)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });

    //RETRIEVE ALL RECORDS
    // Book.findAll().then(res => {
    //     // console.log(res[0].dataValues)
    //     // console.log(res[1].dataValues)
    //     res.forEach(r => {
    //         console.log(r.dataValues);
    //     });
    // }).catch((error) => {
    //     console.error('Failed to retrieve data : ', error);
    // });

    //RETRIEVE WITH WHERE CAUSE
    // Book.findOne({
    //     where: {
    //         id: "1"
    //     }
    // }).then(res => {
    //     console.log(res.dataValues)
    // }).catch((error) => {
    //     console.error('Failed to retrieve data : ', error);
    // });

    //DELETE A RECORD
    // Book.destroy({
    //     where: {
    //         id: 2
    //     }
    // }).then(() => {
    //     console.log("Successfully deleted record.")
    // }).catch((error) => {
    //     console.error('Failed to delete record : ', error);
    // });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});

