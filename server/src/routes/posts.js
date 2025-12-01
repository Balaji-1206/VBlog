import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createPost, getPublishedPosts, getSinglePost, updatePost, deletePost, getMyPosts } from '../controllers/postController.js';

const router = Router();

// Authenticated dashboard route should come BEFORE dynamic slug
router.get('/dashboard/mine', authenticate, getMyPosts);

// Public routes
router.get('/', getPublishedPosts);
router.get('/:slug', optionalAuth, getSinglePost);

// CRUD (auth)
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
