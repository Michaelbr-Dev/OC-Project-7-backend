/**
 * @file Manage app.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/Users
 */

const bcrypt = require('bcrypt');
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

  const avatarImg = req.file
    ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    : '../images/default_user.jpg';

  const user = new User({
    email: req.body.email,
    password: hash,
    username: req.body.username,
    avatar: avatarImg,
  });

  await user.save().catch((error) => res.status(500).json({ error }));
  return res.status(201).json({ message: 'Utilisateur créé !' });
};
