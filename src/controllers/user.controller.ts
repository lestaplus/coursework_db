import { Request, Response } from 'express';
import { userService } from '../services/user.service.js';

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, surname, email, password, birth_date } = req.body;
      
      const user = await userService.registerUserWithTrial({
        name,
        surname,
        email,
        password_hash: password,
        birth_date: new Date(birth_date)
      });

      res.status(201).json({ status: 'success', data: user });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await userService.softDeleteUser(id);
      res.status(200).json({ status: 'success', message: 'User soft deleted' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllActiveUsers();
      res.json({ status: 'success', data: users });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export const userController = new UserController();