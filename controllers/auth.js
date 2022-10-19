/**
 * @file Manage user authentication.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/Auth
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');

/**
 * @function signup
 * @description Creating a new user.
 *
 * @param {object} req               - Express request object.
 * @param {object} req.body          - Request body.
 * @param {string} req.body.email    - Email of the new user.
 * @param {string} req.body.password - Password of the new user.
 *
 * @param {object} res               - Express response object.
 */
exports.signup = async (req, res) => {
  if (
    !validator.isStrongPassword(req.body.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        'Mot de passe requis : 8 caractères minimum, au moins 1 Majuscule, 1 minuscule, 1 caractère spécial, sans espace.',
    });
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }

  const userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    return res.status(409).json({ message: "L'adresse email est déjà utilisée" });
  }

  const hash = await bcrypt.hash(req.body.password, 15);

  const avatarImg = req.file ? `/images/${req.file.filename}` : `/images/avatar/default_user.png`;

  const user = new User({
    email: req.body.email,
    password: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: avatarImg,
    isAdmin: false,
  });

  await user.save().catch((error) => res.status(500).json({ error }));
  return res.status(201).json({ message: 'Utilisateur créé !' });
};

/**
 * @function login
 * @description The code is checking if the user exists in the database
 * and if the password is correct. If the user exists and the password is correct, it returns the
 * userId and a token.
 *
 * @param {object} req               - Express request object.
 * @param {object} req.body          - Request body.
 * @param {string} req.body.email    - Email of the user.
 * @param {string} req.body.password - Password of the user.
 *
 * @param {object} res               - Express response object.
 */
exports.login = async (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }

  if (
    !validator.isStrongPassword(req.body.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        'Mot de passe requis : 8 caractères minimum, au moins 1 Majuscule, 1 minuscule, 1 caractère spécial, sans espace.',
    });
  }

  const userEmail = await User.findOne({ email: req.body.email });
  if (!userEmail) {
    return res.status(404).json({ message: "L'adresse email n'existe pas" });
  }

  const user = await User.findOne({ email: req.body.email }).catch((error) =>
    res.status(500).json({ error }),
  );
  if (!user) {
    return res.status(401).json({ message: 'Login/Mot de passe incorrecte' });
  }
  const valid = await bcrypt
    .compare(req.body.password, user.password)
    .catch((error) => res.status(500).json({ error }));
  if (!valid) {
    return res.status(401).json({ message: 'Login/Mot de passe incorrecte' });
  }
  /* eslint-disable no-underscore-dangle */
  return res.status(200).json({
    userId: user._id,
    isAdmin: user.isAdmin,
    token: jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.SEC_TOK, {
      expiresIn: '2h',
    }),
  });
  /* eslint-enable no-underscore-dangle */
};

/**
 * @function profile
 * @description The code is checking if the user exists in the database.
 * If the user exists, it returns the user properties.
 *
 * @param {object} req      - Express request object.
 * @param {object} req.user - Request user.
 *
 * @param {object} res      - Express response object.
 */
exports.profile = async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findOne({ _id: req.auth.userId }).catch((error) =>
    res.status(500).json({ error }),
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found !' });
  }
  return res.status(200).json({ user });
};
