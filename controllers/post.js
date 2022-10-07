/**
 * @file Manage posts.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/post
 */

const fs = require('fs/promises');
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
    attachement: req.file ? `/images/${req.file.filename}` : undefined,
    usersLiked: [],
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
  return res.status(200).json({ posts });
};

/**
 * @function getOnePost
 * @description Return one posts in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.getOnePost = async (req, res) => {
  const onePost = await Post.findOne({ _id: req.params.postId }).catch((error) => {
    return res.status(500).json({ error });
  });
  return res.status(200).json(onePost);
};

/**
 * @function updatePost
 * @description Update one posts in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.updatePost = async (req, res) => {
  try {
    const postObject = req.file
      ? {
          ...JSON.parse(req.body.post),
          attachement: `/images/posts/${req.file.filename}`,
        }
      : { ...req.body };

    /* eslint-disable no-underscore-dangle */
    delete postObject.userId;
    delete postObject._id;
    /* eslint-enable no-underscore-dangle */
    delete postObject.usersLiked;
    const post = await Post.findOne({ _id: req.params.postId });
    if (post.userId !== req.auth.userId && req.auth.isAdmin !== true) {
      return res.status(403).json({ error: 'Forbidden !' });
    }
    if (req.file && post.attachement) {
      const filename = post.attachement.split('/images/posts/')[1];
      await fs.unlink(`/images/posts/${filename}`);
    }
    await Post.updateOne({ _id: req.params.postId }, { ...postObject, _id: req.params.postId });
    return res.status(200).json({ message: 'Post updated!' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
