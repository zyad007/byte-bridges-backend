import express from 'express';
import { addJobToFavorites, getFavoriteJobs, getJobs, removeJobFromFavorites, markJobAsNotInterested, markJobAsInterested } from '../controllers/JobsController';

const router = express.Router();

router.get('/', getJobs);
router.get('/favorites', getFavoriteJobs);
router.put('/fav/:id', addJobToFavorites);
router.put('/unfav/:id', removeJobFromFavorites);
router.put('/not-interested/:id', markJobAsNotInterested);
router.put('/interested/:id', markJobAsInterested);

export default router;