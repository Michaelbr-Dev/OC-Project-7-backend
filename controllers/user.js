/**
 * @file Manage users.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/Users
 */

const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const User = require('../models/User');

/**
 * @function getUser
 * @description Return one user in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).catch((error) =>
    res.status(500).json({ error }),
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found !' });
  }
  return res.status(200).json({ user });
};

/**
 * @function updateUser
 * @description Return one user in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.updateUser = async (req, res) => {
  try {
    const userObject = req.file
      ? {
          ...JSON.parse(req.body.user),
          avatar: `/images/avatar/${req.file.filename}`,
        }
      : { ...req.body };
    userObject.password = userObject.password
      ? await bcrypt.hash(userObject.password, 15)
      : undefined;
    // eslint-disable-next-line no-underscore-dangle
    delete userObject._id;
    const user = await User.findOne({ _id: req.params.userId });
    // eslint-disable-next-line no-underscore-dangle
    if (!user._id.equals(req.auth.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const avatarFileName = user.avatar.split('/avatar/')[1];
    if (req.file && avatarFileName !== 'default_user.png') {
      await fs.unlink(`./images/avatar/${avatarFileName}`);
    }
    await User.updateOne({ _id: req.params.userId }, { ...userObject, _id: req.params.userId });
    return res.status(200).json({ message: 'User updated !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/**
 * @function deleteUser
 * @description Return one user in database with his ID.
 *
 * @param {object} req - Express request object.
 *
 * @param {object} res - Express response object.
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found !' });
    }

    // eslint-disable-next-line no-underscore-dangle
    if (user._id.toString() !== req.auth.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const avatarFileName = user.avatar.split('/avatar/')[1];
    if (avatarFileName !== 'default_user.jpg') {
      await fs.unlink(`../images/avatar/${avatarFileName}`);
    }

    await User.deleteOne({ _id: req.params.userId });
    return res.status(200).json({ message: 'User deleted !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
