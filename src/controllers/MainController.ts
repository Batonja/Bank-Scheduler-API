import { Request, Response } from "express";
import MainService from "../services/implementations/MainService";

class MainController {
  public async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const response = await MainService.login(username, password);

    res.send(response);
  }
}

export default new MainController();
