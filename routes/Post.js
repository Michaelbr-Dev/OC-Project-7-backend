/**
 * @file Manage posts routes.
 * @author Michael Briquet <contact@michaelbr-dev.fr>
 *
 * @module routes/post.js
 */

const express = require('express');
const auth = require('../middlewares/auth');
const multerAttachement = require('../middlewares/multer-config-attachement');
const postCtrl = require('../controllers/post');

const router = express.Router();

router.post('/', auth, multerAttachement, postCtrl.createPost);

module.exports = router;
