import { OAuthProvider } from "../types/OAuthProvider"

export type OAuthIdentity = {
  id: string,
  userId: string,

  provider: OAuthProvider,
  providerUserId: string,

  createdAt: Date,
}