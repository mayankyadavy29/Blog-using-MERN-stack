const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: String,  
  authorId: String,
  authorName: String,
  postId: String,
  time: Date,
});

const ModelClass = mongoose.model('comment', commentSchema);

module.exports = ModelClass;