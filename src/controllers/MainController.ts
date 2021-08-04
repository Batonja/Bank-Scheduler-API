import { Request, Response } from "express";

class MainController {
  public async home(req: Request, res: Response) {
    res.send("hey");
  }
}

export default new MainController();
