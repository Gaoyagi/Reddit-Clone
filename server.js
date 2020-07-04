// Require outside Libraries and middlewares
require('dotenv').config();
const express = require('express');
const Handlebars = require('handlebars');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//create express app
const app = express();      

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use express validator
app.use(expressValidator());

//use cookie parser
app.use(cookieParser()); // Add this after you initialize express.

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'); //old handlebars
//handlebar formats for the html pages
//app.engine('handlebars', exphbs({ defaultLayout: 'main' }));    //Use "main.handlebars" as our default page layout
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    // ...implement newly added insecure prototype access
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set('view engine', 'handlebars');                             //Use handlebars to render

//custom middle ware to check token for auth/logged in user
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
    console.log("invalid auth")
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

//includestyling
app.use(express.static('public'));

// Tell the app what port to listen on
const port = 3000
app.listen(process.env.PORT ||port, () => console.log(`Example app listening on port ${port}!`))

//Setup and link db to code
require('./data/reddit-db');

//Controller routes
//pass the express app you made so the routes can use them 
require('./controllers/posts.js')(app);     //routes for posts
require('./controllers/comments.js')(app);  //routes for comments
require('./controllers/auth.js')(app);      //routes for auth
require('./controllers/replies.js')(app);



module.exports = app;



