//all the routes pertaining to posts

const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports = app => {
  //landing page
  app.get('/', (req, res) => {
    Post.find({}).lean()
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err.message);
      });
  })

  //get form to create new post 
  app.get('/posts/new', (req, res) => {
      res.render('posts-new');
  })

  //creating and submmitting(posting) a new post to db
  app.post('/posts/new', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);

    // SAVE INSTANCE OF POST MODEL TO DB
    post.save((err, post) => {
      Post.find({}).lean()
        .then(posts => {
          res.render("posts-index", { posts });
        })
        .catch(err => {
          console.log(err.message);
        });
    })
  });

  //get page to view a specific post
  app.get("/posts/:id", function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').then((post) => {
      res.render('posts-show', { post })
    }).catch((err) => {
      console.log(err.message)
    })
  });

  //Get all the posts in a SUBREDDIT
  app.get("/n/:subreddit", function(req, res) {
    Post.find({ subreddit: req.params.subreddit })
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err);
      });
  });

};