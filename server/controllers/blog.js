let _ = require('lodash');

const Post = require('../models/post');
const Comment = require('../models/comment');

\

/**
 * Get a list of posts
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPosts = function(req, res, next) {
  Post
    .find({})
    .select({})
    .limit(100)
    .sort({
      time: -1
    })
    .exec(function(err, posts) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: 'Error! Could not retrieve posts.'
        });
      }
      res.json(posts);
    });
};

/**
 * Create a new post
 *
 * @param req
 * @param res
 * @param next
 */
exports.createPost = function(req, res, next) {

  const user = req.user;

  const title = req.body.title;
  const categories = req.body.categories;
  const content = req.body.content;
  const authorId = user._id;
  const authorName = user.firstName + ' ' + user.lastName;
  const time = Date.now();  
  if (!title || !categories || !content) {
    return res.status(422).json({
      message: 'Title, categories and content are all required.'
    });
  }

  const post = new Post({
    title: title,
    categories: _.uniq(categories.split(',').map((item) => item.trim())),  
    content: content,
    authorId: authorId,
    authorName: authorName,
    time: time,
  });

  post.save(function(err, post) { 
    if (err) {
      return next(err);
    }
    res.json(post);  
  });
};

/**
 * Fetch a single post by post ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPost = function(req, res, next) {
  Post.findById({
    _id: req.params.id
  }, function(err, post) {
    if (err) {
      console.log(err);
      return res.status(422).json({
        message: 'Error! Could not retrieve the post with the given post ID.'
      });
    }
    if (!post) {
      return res.status(404).json({
        message: 'Error! The post with the given ID is not exist.'
      });
    }
    res.json(post);  
  });
};

/**
 * Update
 *
 * @param req
 * @param res
 * @param next
 */
exports.allowUpdateOrDelete = function(req, res, next) {

  const user = req.user;

  Post.findById({
    _id: req.params.id
  }, function(err, post) {

    if (err) {
      console.log(err);
      return res.status(422).json({
        message: 'Error! Could not retrieve the post with the given post ID.'
      });
    }

    if (!post) {
      return res.status(404).json({
        message: 'Error! The post with the given ID is not exist.'
      });
    }

    console.log(user._id);
    console.log(post.authorId);

    if (!user._id.equals(post.authorId)) {
      return res.send({allowChange: false});
    }
    res.send({allowChange: true});
  });
};

/**
 * Edit/Update a post
 *
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = function(req, res, next) {

  const user = req.user;

  Post.findById({
    _id: req.params.id
  }, function(err, post) {

    if (err) {
      console.log(err);
      return res.status(422).json({
        message: 'Error! Could not retrieve the post with the given post ID.'
      });
    }

    if (!post) {
      return res.status(404).json({
        message: 'Error! The post with the given ID is not exist.'
      });
    }

    if (!user._id.equals(post.authorId)) {
      return res.status(422).json({
        message: 'Error! You have no authority to modify this post.'
      });
    }

    const title = req.body.title;
    const categories = req.body.categories;
    const content = req.body.content;

    if (!title || !categories || !content) {
      return res.status(422).json({
        message: 'Title, categories and content are all required.'
      });
    }

    post.title = title;
    post.categories = _.uniq(categories.split(',').map((item) => item.trim())), 
    post.content = content;

    post.save(function(err, post) {  
      if (err) {
        return next(err);
      }
      res.json(post); 
    });
  });
};

/**
 * Delete a post by post ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = function(req, res, next) {


  Post.findByIdAndRemove(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res.status(422).json({
        message: 'Error! The post with the given ID is not exist.'
      });
    }

    Comment.remove({ postId: post._id }, function(err) {
      if (err) {
        return next(err);
      }
    });

    res.json({
      message: 'The post has been deleted successfully!'
    });
  });
};

/**
 * Fetch posts by author ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPostsByAuthorId = function(req, res, next) {

  const user = req.user;

  Post
    .find({
      authorId: user._id
    })
    .select({})
    .limit(100)
    .sort({
      time: -1
    })
    .exec(function(err, posts) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: 'Error! Could not retrieve posts.'
        });
      }
      res.json(posts);
    });
};

/**
 * ------- Comment APIs -------
 */

/**
 * Create a new comment (post ID and user ID are both needed)
 *
 * @param req
 * @param res
 * @param next
 */
exports.createComment = function(req, res, next) {

  const user = req.user;

  if (!user) {
    return res.status(422).json({
      message: 'You must sign in before you can post new comment.'
    });
  }

  const postId = req.params.postId;

  const content = req.body.content;
  if (!content) {
    return res.status(422).json({
      message: 'Comment cannot be empty.'
    });
  }

  const comment = new Comment({
    content: content,
    authorId: user._id,
    authorName: user.firstName + ' ' + user.lastName,
    postId: postId,
    time: Date.now(),
  });

  comment.save(function(err, comment) { 
    if (err) {
      return next(err);
    }
    res.json(comment);  
  });
};

/**
 * Fetch comments for a specific blog post (post ID is needed)
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchCommentsByPostId = function(req, res, next) {
  Comment
    .find({
      postId: req.params.postId
    })
    .select({})
    .limit(100)
    .sort({
      time: 1
    })
    .exec(function(err, comments) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: 'Error! Could not retrieve comments.'
        });
      }
      res.json(comments);
    });
};