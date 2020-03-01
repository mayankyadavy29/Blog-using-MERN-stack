const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  categories: [String],
  content: String, 
  authorId: String,
  authorName: String,
  time: Date,
});

const ModelClass = mongoose.model('post', postSchema);

module.exports = ModelClass;