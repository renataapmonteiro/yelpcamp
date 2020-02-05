var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");
	

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT configuration
app.use(require("express-session")({
	secret: "i was in love with taemin",
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});
	

app.get("/", function(req, res){
	res.render("campgrounds/landing");
});

app.get("/campgrounds", function(req, res){
     //get camps from the db;
	Campground.find({} , function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			 res.render("campgrounds/index", {campgrounds: allCampgrounds , currentUser: req.user});
		}
	});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	// campgrounds.push(newCampground);
	// create a new camp e coloca-lo na base de dados:
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			cosole.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW route
app.get("/campgrounds/:id", function(req, res){
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

// ==============================================
// COMMENTS Routes

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
			
		}
	});
});

app.post("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// ==============================================
// AUTH Routes

// show the register form
app.get("/register", function(req, res){
	res.render("register");
});

// handle sing up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// show login form
app.get("/login", function(req, res){
	res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// log out logic
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(3000, process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp is on Now!!! - YelpCamp Server has started.");
});