import { OAuthUser } from "../../../application/services/interfaces/IOAuthService";

export interface IOAuthClient {
  getAuthUrl(state: string): string;

  getUserFromAuthCode(code: string): Promise<OAuthUser>;
}