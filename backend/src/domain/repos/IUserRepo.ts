import { User } from "../entities/User"

export interface IUserRepo {
  findById(id: string): Promise<User | null>;
  findByHandle(handle: string): Promise<User | null>;

  save(user: User): Promise<void>;

  deleteById(id: string): Promise<void>;
}