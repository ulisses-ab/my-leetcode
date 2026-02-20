import { AppError } from "../../../application/errors/AppError";
import { ErrorCode } from "../../../application/errors/ErrorCode";
import { IOAuthService, OAuthUser } from "../../../application/services/interfaces/IOAuthService";
import { OAuthProvider } from "../../../domain/types/OAuthProvider";
import { IOAuthClient } from "./IOAuthClient";

export class OAuthService implements IOAuthService {
  constructor(
    private readonly oAuthClients: Record<OAuthProvider, IOAuthClient>
  ) {}

  async getUserFromAuthCode(provider: OAuthProvider, code: string): Promise<OAuthUser> {
    const client = this.oAuthClients[provider];

    if(!client) {
      throw new AppError(ErrorCode.NOT_IMPLEMENTED, "OAuth verification not implemented for this provider");
    }

    return client.getUserFromAuthCode(code);
  }
}