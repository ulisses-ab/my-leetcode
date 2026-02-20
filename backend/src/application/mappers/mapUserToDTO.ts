import { User } from "../../domain/entities/User";
import { UserDTO } from "../dtos/UserDTO";

export function mapUserToDTO(user: User): UserDTO {
  return {
    id: user.id,
    handle: user.handle,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}