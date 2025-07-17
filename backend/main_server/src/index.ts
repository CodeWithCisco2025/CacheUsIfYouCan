import express, { Request, Response } from 'express';
import cors from "cors";
import router from './routes';
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World this is main_server !');
});

app.use('/healthcheck',router);
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
