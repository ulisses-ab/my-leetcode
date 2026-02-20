import { PrismaClient } from "../../generated/prisma/client";
import { IUserRepo } from "../../domain/repos/IUserRepo";
import { User } from "../../domain/entities/User";

export class PrismaUserRepo implements IUserRepo {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapPrismaUser(user) : null;
  }

  async findByHandle(handle: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { handle },
    });

    return user ? this.mapPrismaUser(user) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        handle: user.handle,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      },
      create: {
        id: user.id,
        handle: user.handle,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  } 

  private mapPrismaUser(user: any): User {
    return {
      id: user.id,
      handle: user.handle,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
