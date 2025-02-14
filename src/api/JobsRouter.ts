import express from 'express';
import { addJobToFavorites, getFavoriteJobs, getJobs, removeJobFromFavorites, markJobAsNotInterested, markJobAsInterested } from '../controllers/JobsController';
import { bodyValidation } from '../middlewares/Validation';
import { JobSearchSchema } from '../schemas/JobSearch';

const router = express.Router();

router.post('/', bodyValidation(JobSearchSchema), getJobs);
router.get('/favorites', getFavoriteJobs);
router.put('/fav/:id', addJobToFavorites);
router.put('/unfav/:id', removeJobFromFavorites);
router.put('/not-interested/:id', markJobAsNotInterested);
router.put('/interested/:id', markJobAsInterested);

export default router;