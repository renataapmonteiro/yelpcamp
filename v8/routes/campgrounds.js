var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campground");
	

router.get("/", function(req, res){
     //get camps from the db;
	Campground.find({} , function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			 res.render("campgrounds/index", {campgrounds: allCampgrounds , currentUser: req.user});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description,
		author = {
			id: req.user._id,
			username: req.user.username,
		};	
	var newCampground = {name: name, image: image, description: desc, author: author};
	// create a new camp e coloca-lo na base de dados:
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			cosole.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new",isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW route
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			// res.send("this will be the show page one day!");
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
}); 

// midleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;