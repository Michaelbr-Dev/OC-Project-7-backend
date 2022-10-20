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
  const postObject = JSON.parse(req.body.post || '{}');
  // eslint-disable-next-line no-underscore-dangle
  delete postObject._id;
  const post = new Post({
    ...postObject,
    user: req.auth.userId,
    attachement: req.file ? `/images/posts/${req.file.filename}` : undefined,
    likes: 0,
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
  const posts = await Post.find()
    .populate('user')
    .catch((error) => {
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
      await fs.unlink(`./images/posts/${filename}`);
    }
    await Post.updateOne({ _id: req.params.postId }, { ...postObject, _id: req.params.postId });
    return res.status(200).json({ message: 'Post updated!' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/**
 * @function deletePost
 * @description Update one posts in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    if (!post.user.equals(req.auth.userId) && req.auth.isAdmin !== true) {
      return res.status(403).json({ error: 'Forbidden!' });
    }
    if (post.attachement) {
      const filename = post.attachement.split('/images/posts/')[1];
      await fs.unlink(`./images/posts/${filename}`);
    }
    await Post.deleteOne({ _id: req.params.postId });
    return res.status(200).json({ message: 'Post deleted!' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/**
 * @function likePost
 * @description Checks if the user has already liked the post, if not, it adds the user to the
 * list of users who liked the post, and updates the number of likes.
 *
 * @param   {object} post   - The post object that we want to update.
 *
 * @param   {string} userId - The id of the user who liked the post.
 *
 * @param   {object} res    - Express response object.
 *
 * @returns {object}        - The return object.
 */
async function likePost(post, userId, res) {
  if (post.usersLiked.includes(userId)) {
    return res.status(400).json({ error: 'You have already liked this post!' });
  }
  post.usersLiked.push(userId);

  // eslint-disable-next-line no-param-reassign
  post.likes = post.usersLiked.length;

  await post.save().catch((error) => res.status(500).json({ error }));
  return res.status(201).json({ message: 'Post liked!' });
}

/**
 * @function resetLike
 * @description It deletes the user's reaction to a post, and updates the number of likes.
 *
 * @param   {object} post   - The post object that we want to update.
 *
 * @param   {string} userId - The id of the user who liked the post.
 *
 * @param   {object} res    - Express response object.
 *
 * @returns {object}        - The return object.
 */
async function resetLike(post, userId, res) {
  if (post.usersLiked.includes(userId)) {
    const index = post.usersLiked.indexOf(userId);
    post.usersLiked.splice(index, 1);

    // eslint-disable-next-line no-param-reassign
    post.likes = post.usersLiked.length;

    await post.save().catch((error) => res.status(500).json({ error }));
    return res.status(200).json({ message: 'Post unliked!' });
  }
  return res.status(404).json({ error: 'Nothing to suppress !' });
}

/**
 * @function likeDislike
 * @description A function that is called when a user likes or dislikes a post.
 *
 * @param {object} req             - Express request object.
 * @param {object} req.params      - Request parameters.
 * @param {object} req.params.id   - Post Id in URL.
 * @param {object} req.auth        - Authenticated user's token informations.
 * @param {object} req.auth.userId - Authenticated user's Id.
 *
 * @param {object} res             - Express response object.
 */
exports.likeDislike = async (req, res) => {
  const { userId } = req.auth;
  const { postId } = req.params;

  const post = await Post.findOne({ _id: postId }).catch((error) =>
    res.status(500).json({ error }),
  );
  switch (req.body.like) {
    case 1:
      likePost(post, userId, res);
      break;

    case 0:
      resetLike(post, userId, res);
      break;

    default:
      res.status(400).json({ message: 'Unknow reaction type' });
      break;
  }
};
