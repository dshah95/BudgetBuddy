var express = require("express");
var router = express.Router(); //this allow us to use 'router' to create our routes for the app.
//requiring the DB model
var User = require("../models/userModel");

//this is the root route which will redirect to the Homepage
router.get('/', function(req, res){
	res.redirect('/budgetbuddy');
});

router.get('/budgetbuddy', function(req, res){
	// res.send("This is the Homepage");
	
	//this code searches through the DB and gives back all users info
	User.find({}, function(err, result){
		if(err){
			console.log("Failed to find all users.. ", err);
		}else{	//the first result can be named anything, the second is the one
			res.render('sample', {result: result});
		}
	});
});

router.get('/budgetbuddy/sign_in', function(req, res){
	res.render("login");
});

router.get('/budgetbuddy/sign_up', function(req, res){
	res.render("signup");
});

router.get('/budgetbuddy/home', function(req, res){
	res.render('home');
});

//all other pages end up here
router.get("*", function(req, res) {
	res.send("UNABLE TO FIND THIS ROUTE, SORRY :(");
});


router.post('/budgetbuddy/sign_in', function(req, res){
	//search if user exists in database
	User.find({$and: [{ email: req.body.email , password: req.body.password}]}, function (err, docs){
		if(err) console.log ("Error");
		else if (docs.length == 0) console.log("An account with this email does not exist");
		else{
			docs.isActive = true;
			res.render('home', {user: docs})
			//console.log(docs);
		}
	})
});

router.post('/budgetbuddy/sign_up', function(req, res){
		//search database for email
		User.find({email: req.body.email},function (err,docs){
			//if there is an account with this email output it already exists, else create new user and direct to login page
			if (docs.length != 0) console.log("An account with this email already exists, please sign in " + docs);
			else {
				User.create({
					firstName: req.body.firstname,
					lastName: req.body.lastname, 
					email: req.body.email,
					password: req.body.password
				});
				res.render('login');
			}
		});
});
/*
router.post('/budgetbuddy/home', function(req, res){
});
*/

//export file
module.exports = router;
