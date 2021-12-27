require('dotenv').config();

const express = require('express')
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.emit('Conectado');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
//const csrf = require('csurf')
const { middlewareGlobal } = require('./src/middlewares/middleware')

app.use(express.urlencoded({ extended: true }))
app.use(helmet());
app.use(express.json());
//PASTA STATICA CSS/IMG/...
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'asdfghjklç',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING})  
});
app.use(sessionOptions);
app.use(flash());

//VIEWS = HTML
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//app.use(csrf());

//ROTAS DO SITE
app.use(middlewareGlobal);
app.use(routes);



app.on('Conectado', () => {
    app.listen(process.env.PORT, () => {
        console.log('http://localhost:3000');
    })
});


