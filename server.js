// Require Libraries/middlewares
require('dotenv').config();
const express = require('express');
const app = express();
const Handlebars = require('handlebars');

const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
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
app.set('view engine', 'handlebars');                           //Use handlebars to render

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



module.exports = app;



