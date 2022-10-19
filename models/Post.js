/**
 * @file Post collection schema.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = mongoose.Schema(
  {
    content: { type: String, maxlenght: 1000, required: false },
    attachement: { type: String, required: false },
    likes: { type: Number, required: false },
    usersLiked: { type: Array, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
