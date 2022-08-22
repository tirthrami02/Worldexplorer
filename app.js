/*if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}*/

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const {placeSchema, reviewSchema} = require('./schemas');
// const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// const Place = require('./models/place');
// const Review = require('./models/review');

const userRoutes = require('./routes/users');
const places = require('./routes/places');
const reviews = require('./routes/reviews');

const { findById } = require('./models/place');

//const dburl = process.env.DB_URL;

mongoose.connect('mongodb://localhost:27017/worldex', {
    useNewUrlParser: true,
  //  useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'Thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('Error');
    next();
})

app.get('/fakeUser', async(req,res) => {
    const user = await User({email: 'jac@gmail.com', username: 'tirthtt'});
    const newUser = await User.register(user,'ola');
    res.send(newUser);
})

app.use('/',userRoutes);
app.use('/places', places);
app.use('/places/:id/reviews', reviews);

app.get('/',(req,res)=> {
    res.render('home')
});


app.all('*',(req,res,next) => {
    next(new ExpressError('Page is not found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500, message = 'Something is wrong'} = err;
    if(!err.message)err.message = 'Oh No! Something went wrong !'
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
    console.log('Port 3000 is active !!!')
})