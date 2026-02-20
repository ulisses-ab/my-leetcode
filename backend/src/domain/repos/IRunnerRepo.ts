import { Runner } from "../entities/Runner";

export interface IRunnerRepo {
  save(runner: Runner):  Promise<void>;

  findById(id: string): Promise<Runner | null>;
}