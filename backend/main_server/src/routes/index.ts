import { Router, Request, Response } from 'express';
import axios from 'axios';

const dummyURL = "http://localhost:4001/health";
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(dummyURL);
    return res.status(200).json(response.data);  // Send only the data
  } catch (e) {
    console.error('Error fetching system health:', e);
    return res.status(500).json({ 
      error: 'Failed to fetch system health data', 
      details: (e as Error).message 
    });
  }
});

export default router;
