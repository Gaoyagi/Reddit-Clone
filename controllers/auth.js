const User = require("../models/user");
const jwt = require('jsonwebtoken');



module.exports = (app) => {
  //post signup form to data base
  app.post("/sign-up", (req, res) => {
    // Create User (and JWT?)
  const user = new User(req.body);

  user
    .save()       //saves new user to db
    .then(user => {
      var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });    //crates JW token
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });     //creates cookie out of JW token called 'nToken'
      res.redirect('/');    //redirect to home after youre done
    })
    .catch(err => {     //error catcher
      console.log(err.message);
      return res.status(400).send({ err: err });
    });
  });

  //get form to create new user 
  app.get('/sign-up', (req, res) => {
    res.render('sign-up');
  })

  //gets Logout, clears your cookie and then redirects you to home
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
  });


// LOGIN FORM
app.get('/login', (req, res) => {
  res.render('login');
});

  // LOGIN
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, "username password")
    .then(user => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: "Wrong Username or password" });
        }
        // Create a token
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
          expiresIn: "60 days"
        });
        // Set a cookie and redirect to root
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
});
}