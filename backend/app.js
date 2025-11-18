const express = require('express');
const session = require('express-session');
/* Routers */
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const pantryRouter = require('./routes/pantryRouter');
const recipeRouter = require('./routes/recipeRouter')

const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const path = require('node:path');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-session')
    ({
        secret: process.env.SECRET || SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: [
        `http://localhost:5173`,
        `*`
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
}));

/* Routes */
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/pantry', pantryRouter);
app.use('/recipe', recipeRouter);

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
app.use(express.static('./public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(process.env.PORT || PORT, () => console.log(`Pantry is listening on port ${process.env.PORT || PORT}`))