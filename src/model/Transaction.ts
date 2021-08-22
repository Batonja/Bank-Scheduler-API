import { Document, model, Schema } from "mongoose";

interface ITransaction extends Document {
  username: string;
  dateOfCreation: Date;
  balance: number;
}

const transactionSchema = new Schema({
  username: { type: String },
  dateOfCreation: { type: Date },
  balance: { type: Number },
});

const TransactionDB = model("Transaction", transactionSchema);

export { ITransaction };
export default TransactionDB;
