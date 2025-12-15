import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import loanRoutes from "./routes/loan.routes";
import subscriptionRoutes from './routes/subscription.routes';
import paymentRoutes from './routes/payment.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Express server is running" });
});

export default app;
