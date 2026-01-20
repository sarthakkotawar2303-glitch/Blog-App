const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');
const { 
  createPostController, 
  GetAllPost, 
  DeletePost, 
  UpdatePost, 
  SinglePost, 
  getMyPosts 
} = require('../controllers/postController');

const postRouter = express.Router();

// Post routes
postRouter.post('/create', auth, upload.single('coverImage'), createPostController);
postRouter.get('/allPosts', auth, GetAllPost);
postRouter.put('/:id/updatePost', auth, upload.single('coverImage'), UpdatePost);
postRouter.delete('/deletePost/:id', auth, DeletePost);
postRouter.get('/getPost/:id', auth, SinglePost);
postRouter.get('/getMyPosts', auth, getMyPosts);

module.exports = postRouter;
