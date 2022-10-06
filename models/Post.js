/**
 * @file Post collection schema.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  attachement: { type: String, required: false },
});

module.exports = mongoose.model('Post', postSchema);
