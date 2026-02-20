import { Role } from "../../domain/types/Role"

export type UserDTO = {
  id: string,
  handle: string,
  email: string,
  role: Role,
  createdAt: Date,
}