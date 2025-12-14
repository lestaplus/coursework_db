import { Request, Response } from "express";
import { loanService } from "../services/loan.service";

class LoanController {
  async returnBook(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ status: "error", message: "Invalid loan ID" });
        return;
      }

      const result = await loanService.returnBook(id);

      res.json({ status: "success", data: result });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ status: "error", message: error.message });
      } else if (error.message.includes("already returned")) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
  }

  async deleteExpired(req: Request, res: Response) {
    try {
      const result = await loanService.deleteExpiredLoans();

      res.json({
        status: "success",
        message: `Successfully deleted ${result.count} expired loans`,
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export const loanController = new LoanController();
