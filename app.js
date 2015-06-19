var express = require("express");
	app = express();
	methodOverride= require("method-override");
	bodyParser = require("body-parser");
	morgan = require("morgan");
	db = require("./models");
    session = require("cookie-session");
    loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");



app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(session({
  maxAge: 3600000,
  secret: 'somthingsomthingdarkside',
  name: "somethingsomthingcomplete"
}));

//login/signup
app.use(loginMiddleware);

app.get("/", routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('users/index.ejs');
});

app.get("/signup", routeMiddleware.preventLoginSignup ,function(req,res){
  res.render('users/signup.ejs');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/countries");
    } else {
      console.log(err);
      res.render("users/signup.ejs");
    }
  });
});


app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login.ejs");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/countries");
    } else {
      res.render("users/login.ejs");
    }
  });
});

app.get("/countries", routeMiddleware.ensureLoggedIn, function(req,res){
	db.Country.find({}, function(err, countries){
		if (err) {
			console.log(err);
		} else {
			res.render("countries/index", {countries: countries});
		}	
	})
});

app.post("/countries", routeMiddleware.ensureLoggedIn, function(req, res){
	var country = new db.Country(req.body.country);
		country.UserId = req.session.id;
		country.save(function(err,country){
			res.redirect("/countries");
		})
});

app.get("/countries/new", function(req, res){
	res.render("countries/new.ejs");
});

app.get("/countries/:id", routeMiddleware.ensureLoggedIn, function(req,res){
	db.Country.findById(req.params.id, function(err, foundCountry){
		if(err){
			res.render("errors/404");
		} else {
			res.render("countries/show", {country:foundCountry});
		}
	})
});

app.get("/countries/:id/edit", routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function(req, res){
	db.Country.findById(req.params.id, function(err, foundCountry){
		if(err){
			res.render("errors/404");
		} else {
			res.render("countries/edit", {country:foundCountry});
		}
	});
});

app.put("/countries/:id", routeMiddleware.ensureLoggedIn, function(req, res){
	db.Country.findByIdAndUpdate(req.params.id, req.body.country, function(err){
		if(err){
        res.render("errors/404");
    	} else{
        res.redirect('/countries');
    	}
	})
});

app.delete('/countries/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Country.findByIdAndRemove(req.params.id, function(err, foundCountry){
      if(err){
        res.render("error/404");
    } else{
        res.redirect('/countries');
    }
  })
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("*", function(req, res){
	res.render("errors/404");
});

app.listen(3000, function(){
	console.log("Server is listening on port 3000");
});
