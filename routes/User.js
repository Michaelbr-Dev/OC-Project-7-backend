/**
 * @file Manage users routes.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module Controller/Users
 */

const express = require('express');
const auth = require('../middlewares/auth');
const multerAvatar = require('../middlewares/multer-config-avatar');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.get('/:userId', auth, userCtrl.getUser);
router.put('/:userId', auth, multerAvatar, userCtrl.updateUser);
router.delete('/:userId', auth, userCtrl.deleteUser);

module.exports = router;
