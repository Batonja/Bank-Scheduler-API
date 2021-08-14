import { Request, Response } from "express";
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
}

export default new MainController();
