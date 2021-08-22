import { model, Schema } from "mongoose";

interface ISynchronization {
  performedAt: Date;
  successful: boolean;
  errorMessage?: string;
}

const syncronizationSchema = new Schema({
  performedAt: { type: Date },
  successful: { type: Boolean },
  errorMessage: { type: String },
});

const SyncronizationDB = model("Syncronization", syncronizationSchema);

export { ISynchronization };

export default SyncronizationDB;
