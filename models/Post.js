/**
 * @file Post collection schema.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, maxlenght: 500 },
  attachement: { type: String, required: false },
  usersLiked: { type: Array, required: true },
});

module.exports = mongoose.model('Post', postSchema);
