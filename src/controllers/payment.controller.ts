import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

class PaymentController {
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
