import { Request, Response } from "express";
import { subscriptionService } from "../services/subscription.service";

class SubscriptionController {
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status, version } = req.body;

      if (!status || version === undefined) {
        res.status(400).json({ error: "Status and version required" });
        return;
      }

      const result = await subscriptionService.updateStatus(
        id,
        status,
        Number(version)
      );
      res.json({ status: "success", data: result });
    } catch (error: any) {
      if (error.message.includes("CONFLICT")) {
        res
          .status(409)
          .json({ status: "error", message: "Optimistic Locking Conflict" });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
  }
}

export const subscriptionController = new SubscriptionController();