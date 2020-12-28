import express from 'express';
import { getAllPosts } from '../controllers/post';

const router = express.Router();

router.get('/all', (req, res) => {
    const posts = getAllPosts();
    res.status(200).json({ posts });
});

export default router;
