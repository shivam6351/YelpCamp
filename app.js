const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi=require('joi');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync =require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError');
const { stat } = require('fs');
const {campgroundSchema,reviewSchema}=require('./schemas.js');
const Review = require('./models/review');
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const reviewRoutes = require('./routes/reviews')
const flash = require('connect-flash');
const session  = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User  = require('./models/user');
const user = require('./models/user');




const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}


app.use(session(sessionConfig))
app.use(flash()); 

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',400))
})

app.use((err,req,res,next)=>{
    const{statusCode = 500} = err;
    if(!err.message)err.message='Oh No something went wrong'; 
    res.status(statusCode).render('error',{err})
    res.send("OH boy something went wrong");
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})