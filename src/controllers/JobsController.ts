import { Request, Response } from 'express';
import { getAll, getFavorites, addFavorite, removeFavorite, markAsNotInterested, markAsInterested } from '../services/JobsServices';

const getJobs = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const search = req.query.search || "";
        const interested: boolean = req.query.interested == "false" ? false : true;

        // to add authorization
        // if(!req.user) {
        //     res.status(401).send('Unauthorized');
        //     return;
        // }

        const jobs = await getAll(page, limit, search as string, interested);
        res.send(jobs);
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};

const getFavoriteJobs = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const search = req.query.search || "";

        // to add authorization
        // if(!req.user) {
        //     res.status(401).send('Unauthorized');
        //     return;
        // }

        const jobs = await getFavorites(page, limit, search as string);
        res.send(jobs);
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};

const addJobToFavorites = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id;
        if(!jobId) {
            res.status(400).send('Job ID is required');
            return; 
        }
        await addFavorite(parseInt(jobId));
        res.status(200).send('Job added to favorites');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const removeJobFromFavorites = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id;
        if(!jobId) {    
            res.status(400).send('Job ID is required'); 
            return;
        }
        await removeFavorite(parseInt(jobId));
        res.status(200).send('Job removed from favorites');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const markJobAsNotInterested = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            res.status(400).send('Job ID is required');
            return;
        }
        await markAsNotInterested(parseInt(jobId));
        res.status(200).send('Job marked as not interested');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const markJobAsInterested = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            res.status(400).send('Job ID is required');
            return;
        }
        await markAsInterested(parseInt(jobId));
        res.status(200).send('Job marked as interested');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export { getJobs, getFavoriteJobs, addJobToFavorites, removeJobFromFavorites, markJobAsNotInterested, markJobAsInterested };