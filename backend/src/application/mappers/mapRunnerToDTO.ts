import { Runner } from "../../domain/entities/Runner";
import { RunnerDTO } from "../dtos/RunnerDTO";

export function mapRunnerToDTO(runner: Runner): RunnerDTO {
  return {
    id: runner.id,
    name: runner.name,
    description: runner.description,
    createdAt: runner.createdAt, 
  };
}