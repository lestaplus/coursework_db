import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

class PaymentController {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const userId = req.query.user_id ? Number(req.query.user_id) : undefined;

      const result = await paymentService.getAllPayments(page, limit, userId);
      res.json({ status: "success", ...result });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const data = await paymentService.getRevenueAnalytics();
      res.json({ status: "success", data });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export const paymentController = new PaymentController();
