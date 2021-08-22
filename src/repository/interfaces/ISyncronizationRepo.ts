import { ISynchronization } from "../../model/Syncronization";

interface ISyncronizationRepo {
  create(syncronization: ISynchronization): Promise<boolean>;
}

export default ISyncronizationRepo;
