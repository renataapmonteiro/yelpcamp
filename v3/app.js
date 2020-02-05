var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	// Coment = require("./models/coment"),
	// User = require("./models/user"),
	seedDB = require("./seeds");
	
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//Schema set up;
// var campgroundSchema = new mongoose.Schema({
// 	name: String,
// 	image: String,
// 	description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 	name: "Starly Night", 
// 	image:"https://images.unsplash.com/photo-1494545261862-dadfb7e1c13d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	description: "this is a huge camp."
// 	}, function(err, campground){
// 	if(err){
// 		console.log("err");
// 	} else{
// 		console.log("Newly created campground!");
// 		console.log(campground);
// 	}
//     });


// var campgrounds = [
// 		{name: "Moon Creek", image:"https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Starly Night", image:"https://images.unsplash.com/photo-1494545261862-dadfb7e1c13d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Snow Queen", image:"https://images.unsplash.com/photo-1493810329807-db131c118da5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Dawns Break", image:"https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "ChanCamp", image:"https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "BlooBurb Camp", image:"https://images.unsplash.com/photo-1485343034225-9e5b5cb88c6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Mounty Mounty", image:"https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
// 	];
	

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
     //get camps from the db;
	Campground.find({} , function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			 res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new");
});

// SHOW route
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			// res.send("this will be the show page one day!");
			res.render("show", {campground: foundCampground});
		}
	});
}); 


app.listen(3000, process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp is on Now!!! - YelpCamp Server has started.");
});