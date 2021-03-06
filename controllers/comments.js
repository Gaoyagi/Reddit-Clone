const Post = require('../models/posts');
const Comment = require('../models/comments');


module.exports = function(app) {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
      //   // INSTANTIATE INSTANCE OF MODEL
      //   const comment = new Comment(req.body);
      //   console.log(req)
      //   comment.author = req.user._id;

      //   // SAVE INSTANCE OF Comment MODEL TO DB
      //   comment
      //     .save()             //first save the model to db
      //     .then(comment => {  //then find the comment
      //       return Post.findById(req.params.postId);    //returns a post
      //     })
      //     .then( post => {   //rfind the post the comment was saved to and sort them by newest and the resave the post
      //       post.comments.unshift(comment);
      //       return post.save();
      //     })
      //     .then(post => {   //redirect to home
      //       res.redirect(`/`);
      //     })
      //     .catch(err => {   //error catcher
      //       console.log(err);
      //     });

      // });
    const comment = new Comment(req.body);          //create new comment object? document?
    comment.author = req.user._id;                  //populate author field with the uder whor equested the link
    comment 
        .save()                     //save the comment to db
        .then(comment => {
            return Promise.all([    //take the 
                Post.findById(req.params.postId)
            ]);
        })
        .then(([post, user]) => {
            post.comments.unshift(comment);
            return Promise.all([
                post.save()
            ]);
        })
        .then(post => {
            res.redirect(`/posts/${req.params.postId}`);
        })
        .catch(err => {
            console.log(err);
        });
    });
};

//.then() promise funcitons
//first part of the arrow functions are the arguments taken from the returns of the previous callback functions
//arrow fucntions arent the techincally the same as annoymous functions
//arrow fucntions cant use this keyword from outside variables