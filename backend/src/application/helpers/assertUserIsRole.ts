import { IUserRepo } from "../../domain/repos/IUserRepo";
import { AppError } from "../errors/AppError";
import { ErrorCode } from "../errors/ErrorCode";
import { Role } from "../../domain/types/Role";

export async function assertUserIsRole(userId: string, role: Role, userRepo: IUserRepo): Promise<void> {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
  }

  if (user.role != role) {
    throw new AppError(ErrorCode.UNAUTHORIZED, `User must be ${role}`);
  }
}