import express, { Request, Response } from 'express';
import router from './routes';
import cors from "cors";

const app = express();
const PORT = 4001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World this is dummy server!');
});

app.use('/health',router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
