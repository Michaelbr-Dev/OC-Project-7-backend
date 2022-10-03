/**
 * @file Manage app.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 */

const express = require('express');
const authCtrl = require('../controllers/auth');
const auth = require('../middlewares/auth');
const multerAvatar = require('../middlewares/multer-config-avatar');

const inputValidator = require('../middlewares/input-validation');

const router = express.Router();

router.post('/signup', inputValidator.userValidation, multerAvatar, authCtrl.signup);
router.post('/login', inputValidator.userValidation, authCtrl.login);
router.get('/profile', auth, authCtrl.profile);

module.exports = router;
