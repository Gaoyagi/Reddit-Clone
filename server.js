// Require Libraries
const express = require('express');
const app = express();
const Handlebars = require('handlebars');

// Middleware
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

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

// Set db
require('./data/reddit-db');

//Controller routes
require('./controllers/posts.js')(app);     //routes for posts
require('./controllers/comments.js')(app);  //routes for comments



module.exports = app;



