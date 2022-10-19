/**
 * @file Manage app.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  posts: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
