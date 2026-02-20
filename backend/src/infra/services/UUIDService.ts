import { uuid } from "zod";
import { IUUIDService } from "../../application/services/interfaces/IUUIDService";
import { v4 as uuidv4 } from "uuid";

export class UUIDService implements IUUIDService {
  public generate(): string {
    return uuidv4();
  }
}