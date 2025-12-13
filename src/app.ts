import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRoutes from './routes/user.routes.js';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Express server is running" });
});

export default app;
