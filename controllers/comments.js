const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports = function(app) {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
      
        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
          .save()             //first save the model to db
          .then(comment => {  //then find the comment
            return Post.findById(req.params.postId);    //returns a post
          })
          .then( post => {   //reorganize comments by newest 
            post.comments.unshift(comment);
            return post.save();
          })
          .then(post => {   //redirect to home
            res.redirect(`/`);
          })
          .catch(err => {   //error catcher
            console.log(err);
          });
      });
};

//.then() promise funcitons
//first part of the arrow functions are the arguments taken from the returns of the previous callback functions
//arrow fucntions arent the techincally the same as annoymous functions
//arrow fucntions cant use this keyword from outside variables