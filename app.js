var express = require("express");
	app = express();
	methodOverride= require("method-override");
	bodyParser = require("body-parser");
	morgan = require("morgan");
	db = require("./models");

app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));



app.get("/", function(req, res){
	res.redirect("/countries");
});

app.get("/countries", function(req,res){
	db.Country.find({}, function(err, countries){
		if (err) {
			// res.status(500).send(err);
			console.log(err);
		} else {
			res.render("countries/index", {countries: countries});
		}	
	})
});

app.get("/countries/new", function(req, res){
	res.render("countries/new");
});

app.post("/countries", function(req, res){
	db.Country.create(req.body.country, function(err){
		if(err){
			res.redirect("/countries/new");
			console.log(err);
		} else {
			res.redirect("/countries");
		}
	})
});

app.put("/countries/:id", function(req, res){
	db.Country.findByIdAndUpdate(req.params.id, req.body.country, function(err){
		if(err){
        res.render("errors/404");
    	} else{
        res.redirect('/countries');
    	}
	})
});

app.get("/countries/:id", function(req,res){
	db.Country.find(req.params.id, function(err, foundCountry){
		if(err){
			res.render("errors/404");
		} else {
			res.render("countries/show", {country:foundCountry});
		}
	})
});

app.get("/countries/:id/edit", function(req, res){
	db.Country.findById(req.params.id, function(err, foundCountry){
		if(err){
			res.render("errors/404");
		} else {
			res.render("countries/edit", {country:foundCountry});
		}
	})
});


app.delete('/countries/:id', function(req,res){
  db.Country.findByIdAndRemove(req.params.id, function(err, foundCountry){
      if(err){
        res.render("error/404");
    } else{
        res.redirect('/countries');
    }
  })
});

app.get("*", function(req, res){
	res.render("errors/404");
});

app.listen(3000, function(){
	console.log("Server is listening on port 3000");
});