/**
 * @file Manage app.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Middleware/Validator
 */

const validator = require('validator');

/**
 * @function validPassword
 * @description Checks if the password is strong enough.
 *
 * @param   {string}  password - Password from req.body.
 *
 * @returns {boolean}          - True if the password is strong enough.
 */
const validPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};

/**
 * @function validMail
 * @description Checks if the email is valid.
 *
 * @param   {string}  email - Email to validate.
 *
 * @returns {boolean}       - True if the email is valid.
 */
const validMail = (email) => {
  return validator.isEmail(email);
};

/**
 * @function validName
 * @description Checks if the first and last name is valid.
 *
 * @param   {string}  name - The name of the user.
 *
 * @returns {boolean}      -    True if the name is valid.
 */
const validName = (name) => {
  const regexInput =
    /^[A-ZÀÈÌÒÙÁÉÍÓÚÝÂÊÎÔÛÃÑÕÄËÏÖÜŸÇßØÅÆ]{1}[a-zàèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ]{2,15}$/i;
  return regexInput.test(name);
};

/**
 * @function userValidation
 * @description Validate all user informations.
 *
 * @param   {object}   req               - Express request object.
 * @param   {object}   req.body          - Request Object.
 * @param   {object}   req.body.password - Password.
 *
 * @param   {object}   res               - Express response object.
 *
 * @param   {Function} next              - Express next function.
 *
 * @returns {boolean}                    - True if the user informations are valid.
 */
exports.userValidation = (req, res, next) => {
  if (!validPassword(req.body.password)) {
    return res.status(400).json({
      message:
        'Password required: 8 characters minimum, at least 1 uppercase, 1 lowercase, 1 special character, no spaces.',
    });
  }
  if (!validMail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (!validName(req.body.firstName)) {
    return res.status(400).json({ message: 'Invalid firstName' });
  }
  if (!validName(req.body.lastName)) {
    return res.status(400).json({ message: 'Invalid lastName' });
  }
  return next();
};
