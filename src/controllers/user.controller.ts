import { Request, Response } from "express";
import { userService } from "../services/user.service.js";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, surname, email, password, birth_date } = req.body;

      const user = await userService.registerUserWithTrial({
        name,
        surname,
        email,
        password_hash: password,
        birth_date: new Date(birth_date),
      });

      res.status(201).json({ status: "success", data: user });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await userService.softDeleteUser(id);
      res.status(200).json({ status: "success", message: "User soft deleted" });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllActiveUsers();
      res.json({ status: "success", data: users });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      const subId = Number(req.params.id);
      const { status, version } = req.body;

      if (!status || version === undefined) {
        res.status(400).json({ error: "Status and version are required" });
        return;
      }

      await userService.updateSubscriptionStatus(
        subId,
        status,
        Number(version)
      );
      res.json({ status: "success" });
    } catch (error: any) {
      if (error.message.includes("CONFLICT")) {
        res.status(409).json({
          status: "error",
          message: "Optimistic Locking Conflict: Reload data",
        });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const data = await userService.getRevenueAnalytics();
      res.json({ status: "success", data });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const email = req.query.email as string;
      if (!email) {
        res
          .status(400)
          .json({ status: "error", message: "Email parameter is required" });
        return;
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        res.status(404).json({ status: "error", message: "User not found" });
        return;
      }

      res.json({ status: "success", data: user });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export const userController = new UserController();
