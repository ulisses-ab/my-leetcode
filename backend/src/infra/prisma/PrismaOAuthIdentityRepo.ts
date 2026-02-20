import { PrismaClient } from "../../generated/prisma/client";
import { IOAuthIdentityRepo } from "../../domain/repos/IOAuthIdentityRepo";
import { OAuthIdentity } from "../../domain/entities/OAuthIdentity";
import { OAuthProvider } from "../../domain/types/OAuthProvider";

export class PrismaOAuthIdentityRepo implements IOAuthIdentityRepo {
  constructor(private prisma: PrismaClient) {}

  async save(identity: OAuthIdentity): Promise<null> {
    await this.prisma.oAuthIdentity.upsert({
      where: { id: identity.id },
      update: {
        userId: identity.userId,
        provider: identity.provider,
        providerUserId: identity.providerUserId,
        createdAt: identity.createdAt,
      },
      create: {
        id: identity.id,
        userId: identity.userId,
        provider: identity.provider,
        providerUserId: identity.providerUserId,
        createdAt: identity.createdAt,
      },
    });

    return null;
  }

  async findById(id: string): Promise<OAuthIdentity | null> {
    const identity = await this.prisma.oAuthIdentity.findUnique({
      where: { id },
    });

    return identity ? this.map(identity) : null;
  }

  async findAllByUser(userId: string): Promise<OAuthIdentity[]> {
    const identities = await this.prisma.oAuthIdentity.findMany({
      where: { userId },
    });

    return identities.map(this.map);
  }

  async findByProviderUserId(
    provider: OAuthProvider,
    providerUserId: string
  ): Promise<OAuthIdentity | null> {
    const identity = await this.prisma.oAuthIdentity.findFirst({
      where: {
        provider,
        providerUserId,
      },
    });

    return identity ? this.map(identity) : null;
  }

  private map = (i: any): OAuthIdentity => ({
    id: i.id,
    userId: i.userId,
    provider: i.provider,
    providerUserId: i.providerUserId,
    createdAt: i.createdAt,
  });
}
