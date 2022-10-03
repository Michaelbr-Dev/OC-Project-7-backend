/**
 * @file Manage app.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multerAvatar = require('../middlewares/multer-config-avatar');

const inputValidator = require('../middlewares/input-validation');

const router = express.Router();

router.post('/signup', inputValidator.userValidation, multerAvatar, userCtrl.signup);
router.post('/login', inputValidator.userValidation, userCtrl.login);
router.get('/profile', auth, userCtrl.profile);

module.exports = router;
