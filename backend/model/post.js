var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  name: String,
  text: String,
  imageURL: String,
  videoURL: String,
  branch: String,
  created: String
});

// create the model for stores and expose it to our app
module.exports = mongoose.model('Notes', postSchema);