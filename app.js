if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressError = require('./utils/expressError');
const User = require('./models/user');
const propertyRoutes = require('./routes/properties') ;
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const MongoDBStore =  require('connect-mongo') ;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/prop-dot'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
});
const db= mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app= express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true})); // to parce the req body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig ={
    store,
    name: 'session',
    secret,
    resave : false ,
    saveUninitialized: true,
    cookie : {
        httpOnly : true ,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser()); //add user to session
passport.deserializeUser(User.deserializeUser()); //remove user from session


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/' , userRoutes);
app.use('/properties' , propertyRoutes) ;
app.use('/properties/:id/reviews' , reviewRoutes) ;

app.get('/' , (req,res)=>{
    res.render('home');
})

app.all('*', (req,res,next) =>{
    next(new expressError('Page Not Found !!',404));
})
app.use((err, req, res, next) => {
    const { statusCode =500 , message ='Something Got Wrong!!'} = err;
    res.render('error',{err});
})
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}!!`);
})
