import 'bcrypt';
import { IHashingService } from '../../application/services/interfaces/IHashingService';
import bcrypt from 'bcrypt';

export class BcryptHashingService implements IHashingService {
  constructor(
    private readonly saltRounds: number = 10,
  ) {}

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  } 
}