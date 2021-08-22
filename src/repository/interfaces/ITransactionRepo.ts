import { ITransaction } from "../../model/Transaction";

interface ITransactionRepo {
  create(transaction: ITransaction): Promise<boolean>;
  getAll(): Promise<ITransaction[]>;
}

export default ITransactionRepo;
