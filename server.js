const express = require('express');
// const { insertUser, sequelize, deleteUser, checkPassword } = require('./user.controller')
const flash = require('connect-flash');
const cors = require('cors')

require('dotenv').config();


const app = express();

/* Router */
const userRouter = require('./user.controller')
const loginRouter = require('./login')
const dashboardRouter = require('./dashboard')


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(loginRouter);
app.use(dashboardRouter);
app.use('/user', userRouter);



app.listen(3000, () => console.log('server in ascolto sulla porta 3000...'));
