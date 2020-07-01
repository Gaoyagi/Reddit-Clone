//all the routes pertaining to posts

const Post = require('../models/posts');
const Comment = require('../models/comments');
const User = require('../models/user');

module.exports = app => {
  //landing page
  app.get('/', (req, res) => {
    // var currentUser = req.user;

    // Post.find({})
    // .then(posts => {
    //   res.render("posts-index", { posts, currentUser });
    // })
    // .catch(err => {
    //   console.log(err.message);
    // });
    var currentUser = req.user;
    // res.render('home', {});
    console.log(req.cookies);
    Post.find().populate('author')
    .then(posts => {
        res.render('posts-index', { posts, currentUser });
    }).catch(err => {
        console.log(err.message);
    })
  })

  //get form to create new post 
  app.get('/posts/new', (req, res) => {
      res.render('posts-new');
  })

  //creating and submmitting(posting) a new post to db
  app.post('/posts/new', (req, res) => {
    //check if user is logged in
    if (req.user) {
      //instantiate new post 
      var post = new Post(req.body);
      post.author = req.user._id;
      post
          .save()   //save post to db
          .then(post => {       //find the newly saved post
              return User.findById(req.user._id);
          })
          .then(user => {       //rearrange the posts in the db to go by newest
              user.posts.unshift(post);
              user.save();      //resave the posts
              // REDIRECT TO THE NEW POST
              res.redirect(`/posts/${post._id}`);
          })
          .catch(err => {
              console.log(err.message);
          });
      } else { //elese throw an error
          return res.status(401); // UNAUTHORIZED
      }
  });

  //get page to view a specific post
  app.get("/posts/:id", function(req, res) {
    //look up the user?
    var currentUser = req.user;
    Post.findById(req.params.id).populate({path:'comments', populate: {path: 'author'}}).populate('author')
       .then(post => {
           res.render("posts-show", { post, currentUser });  
       })
       .catch(err => {
           console.log(err.message);
       });
  });

  //Get all the posts in a SUBREDDIT
  app.get("/n/:subreddit", function(req, res) {
    var currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit }).populate('author')
      .then(posts => {
          res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
          console.log(err);
      });
  });

};