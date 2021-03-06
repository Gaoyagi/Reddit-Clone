//all the routes pertaining to posts

const Post = require('../models/posts');
const Comment = require('../models/comments');
const User = require('../models/user');

module.exports = app => {
  //landing page
  app.get('/', (req, res) => {
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
      //instantiate new post model
    var post = new Post(req.body);
    //fill the models fields
    post.author = req.user._id;
    post.upVotes = [];
    post.downVotes = [];
    post.voteScore = 0;
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

  //get page to show a specific post
  app.get("/posts/:id", function(req, res) {
    var currentUser = req.user;     //get the user who published it? or get the user who wants to 
    Post.findById(req.params.id).populate('comments').lean()    //find post by?
        .then(post => {
            res.render("posts-show", { post, currentUser });    //take the found post and then return it to the posts-show page
        })
        .catch(err => {                                         //if you cant find the post throw an error
            console.log(err.message);
        });
  });

  //Get all the posts in a SUBREDDIT
  app.get("/n/:subreddit", function(req, res) {
    var currentUser = req.user;     //get the user who published via?
    Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
            res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
  });

  //upvote
  app.put("/posts/:id/vote-up", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.upVotes.push(req.user._id);
      post.voteScore = post.voteScore + 1;
      post.save();
  
      res.status(200);
    });
  });
  
  //downvote
  app.put("/posts/:id/vote-down", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.downVotes.push(req.user._id);
      post.voteScore = post.voteScore - 1;
      post.save();
  
      res.status(200);
    });
  });

};