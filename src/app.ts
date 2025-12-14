import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";
import loanRoutes from "./routes/loan.routes.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Express server is running" });
});

export default app;
