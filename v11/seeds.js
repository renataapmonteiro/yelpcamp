var mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment");

var Data = [
	{
		name: "Cloud Resty",
		image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"cute and warm"
	},
	{
		name: "Nomade",
		image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"cute and warm"
	},
	{
		name: "Mount Mounty",
		image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"cute and warm"
	}
];

function seedDB(){
// 	remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Removed Campgrounds!!!!");
		}
    });
// 	add a few campgrounds
	Data.forEach(function(seed){
		Campground.create(seed, function(err, campground){
			if(err){
			   console.log(err);
			} else {
				   console.log("Add Campground!!!");
				// 	add a few coments
				Comment.create(
					{
						text: "this place is great but smelly!",
						author: "Homer",
					}, function(err, comment){
						if(err){
							console.log(err);
						} else {
							campground.comments.push(comment);
							campground.save();
							console.log("create new comment");
						}
					}
				);
			}
		});
	});
}


module.exports = seedDB;