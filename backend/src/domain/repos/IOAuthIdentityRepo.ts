import { OAuthIdentity } from "../entities/OAuthIdentity";
import { OAuthProvider } from "../types/OAuthProvider";

export interface IOAuthIdentityRepo {
  save(identity: OAuthIdentity): Promise<null>;
  findById(id: string): Promise<OAuthIdentity | null>;
  findAllByUser(userId: string): Promise<OAuthIdentity[]>;
  findByProviderUserId(provider: OAuthProvider, providerUserId: string): Promise<OAuthIdentity | null>;
}