import { Role } from "../types/Role"

export type User = {
  id: string,
  handle: string,
  role: Role,
  email: string,
  createdAt: Date,
  updatedAt: Date,
}