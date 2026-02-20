import { mapUserToDTO } from "../../mappers/mapUserToDTO";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { UserDTO } from "../../dtos/UserDTO";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";

export type GetUserInput = {
  userId: string,
}

export type GetUserOutput = {
  user: UserDTO,
}

export class GetUserUseCase {
  constructor(
    private readonly userRepo: IUserRepo,
  ) {}

  public async execute(input: GetUserInput): Promise<GetUserOutput> {
    const { userId } = input;

    const user = await this.userRepo.findById(userId);
    if(!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    return {
      user: mapUserToDTO(user),
    };
  }
}