const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./config/passport')(passport)

const db = require('./config/keys').MongoURI
mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log('mongoose db connected'))
    .catch(err => console.log(err))

app.use(expresslayouts)
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log('server starting on http://localhost:5001')
});

