const Post = require('../models/posts');

module.exports = app => {
  //go to the create new post form
  app.get('/posts/new', (req, res) => {
      res.render('posts-new');
  })

  //creating and submmitting a new post to db
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

  //page to view a specific post
  app.get("/posts/:id", function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id)
      .then(post => {
        res.render("posts-show", { post });
      })
      .catch(err => {
        console.log(err.message);
      });
  });
};