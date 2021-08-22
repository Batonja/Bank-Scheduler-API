import { Request, Response } from "express";
import TransactionRepo from "../repository/implementations/TransactionRepo";
import MainService from "../services/implementations/MainService";

class MainController {
  public async updateMyFetchingPeriod(req: Request, res: Response) {
    const { username, password, fetchingPeriondInHours } = req.body;

    const response = await MainService.updateMyFetchingPeriod(
      username,
      password,
      fetchingPeriondInHours
    );

    res.send(response);
  }

  public async getAll(req: Request, res: Response) {
    const data = await TransactionRepo.getAll();
    res.send(data);
  }

  public async sendAllScheduledRequests(req: Request, res: Response) {
    const response = await MainService.consumeFromQueue();

    res.send(response);
  }
}

export default new MainController();
