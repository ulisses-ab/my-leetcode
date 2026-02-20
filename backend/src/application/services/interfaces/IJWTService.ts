export interface IJWTService {
  sign(payload: object, expiresInSeconds?: number): string;
  verify(token: string): object | null;
}
