import TransactionDB, { ITransaction } from "../../model/Transaction";
import ITransactionRepo from "../interfaces/ITransactionRepo";

class TransactionRepo implements ITransactionRepo {
  public async getAll(): Promise<ITransaction[]> {
    return await TransactionDB.find();
  }
  public async create(transaction: ITransaction): Promise<boolean> {
    await TransactionDB.create(transaction);

    return true;
  }
}

export default new TransactionRepo();
