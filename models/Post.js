/**
 * @file Post collection schema.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, maxlenght: 1000, required: false },
    attachement: { type: String, required: false },
    likes: { type: Number, required: false },
    usersLiked: { type: Array, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
