const express = require('express');
const router = express.Router();
const {campgroundSchema,reviewSchema}=require('../schemas.js');

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})



router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground data',400);
    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','successfully made a new campground') 
    res.redirect(`/campgrounds/${campground._id}`)

}))
router.get('/:id', catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            
            path:'reviews',
            populate :{
                path:'author',
            }
    
        }).populate('author');
        console.log(campground);
        if(!campground){
            req.flash('error','cannot fint the campground')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground })
    }
    catch (e) {
        next(e);
    }
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','cannot fint the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','successfully updated the campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','deleted campground')
    res.redirect('/campgrounds');
}))

module.exports = router;