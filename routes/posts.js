const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/postsCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/posts', AuthHelper.VerifyToken, PostCtrl.getAllPosts);
router.get('/post/:id', AuthHelper.VerifyToken, PostCtrl.getPost);

router.post('/post/add-post', AuthHelper.VerifyToken, PostCtrl.addPost);
router.post('/post/add-like', AuthHelper.VerifyToken, PostCtrl.addLike);
router.post('/post/add-comment', AuthHelper.VerifyToken, PostCtrl.addComment);

router.put('/post/edit-post', AuthHelper.VerifyToken, PostCtrl.editPost);
router.delete(
  '/post/delete-post/:id',
  AuthHelper.VerifyToken,
  PostCtrl.deletePost
);

module.exports = router;