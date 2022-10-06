/**
 * @file Manage posts.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/post
 */

const Post = require('../models/Post');

/**
 * @function createPost
 * @description Create a new post in database.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.createPost = async (req, res) => {
  const postObject = JSON.parse(req.body.post);
  // eslint-disable-next-line no-underscore-dangle
  delete postObject._id;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    attachement: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : undefined,
  });
  await post.save().catch((error) => res.status(500).json({ error }));
  res.status(201).json({ message: 'Post registered ! ' });
};

/**
 * @function getAllPosts
 * @description Return all posts in database.
 *
 * @param {object} _req - Express request object.
 *
 * @param {object} res  - Express response object.
 */
exports.getAllPost = async (_req, res) => {
  const posts = await Post.find().catch((error) => {
    return res.status(500).json({ error });
  });
  return res.status(200).json(posts);
};
