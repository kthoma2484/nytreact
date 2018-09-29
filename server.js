// Dependencies
var express = require("express");
//var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");
//var mongojs = require("mongojs");
//var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//var exphbs = require("express-handlebars");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));


// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articlesdb"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });

//Routes


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  // Make a request for the news section of `cnn health news`

  axios.get("http://www.echojs.com/").then(function (response) {
    
  // Load the html body from request into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class

    $("article h2").each(function (i, element) {
      var result = {};

      // Save the text and href of each link enclosed in the current element
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });


  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
  });

});

app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Listen on port 3000
app.listen(PORT, function () {
  console.log("App running on port 3000!");
});