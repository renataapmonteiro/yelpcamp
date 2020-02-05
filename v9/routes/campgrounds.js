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

// Edit Campground
router.get("/:id/edit",checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update route
router.put("/:id",checkCampgroundOwnership, function(req,res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Destroy route
router.delete("/:id",checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				res.redirect('/campgrounds');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;