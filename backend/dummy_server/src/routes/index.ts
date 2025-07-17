import { Router, Request, Response } from 'express';
import { getSystemHealth } from '../services';
const router = Router();



router.get('/',async(req,res)=>{
    try {
        const data = await getSystemHealth();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch system health data', details: err });
    }
})

export default router;