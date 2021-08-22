import SyncronizationDB, { ISynchronization } from "../../model/Syncronization";
import ISyncronizationRepo from "../interfaces/ISyncronizationRepo";

class SyncronizationRepo implements ISyncronizationRepo {
  public async create(syncronization: ISynchronization): Promise<boolean> {
    await SyncronizationDB.create(syncronization);
    return true;
  }
}

export default new SyncronizationRepo();
