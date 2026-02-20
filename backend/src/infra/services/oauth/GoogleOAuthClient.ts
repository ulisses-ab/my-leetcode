import { IOAuthClient } from "./IOAuthClient";
import { OAuthUser } from "../../../application/services/interfaces/IOAuthService";
import { OAuthProvider } from "../../../domain/types/OAuthProvider";

export class GoogleOAuthClient implements IOAuthClient {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string,
  ) {}

  public getAuthUrl(state: string): string {    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'email profile',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  public async getUserFromAuthCode(code: string): Promise<OAuthUser> {
    const accessToken = await this.exchangeCodeForAccessToken(code);

    return await this.fetchUserInfo(accessToken);
  }

  private async exchangeCodeForAccessToken(code: string): Promise<string> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange auth code for access token");
    }

    const data = await response.json();

    return data.access_token;
  }

  private async fetchUserInfo(accessToken: string): Promise<OAuthUser> {
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Google user info");
    }

    const data = await response.json();

    return {
      email: data.email,
      name: data.name,
      provider: OAuthProvider.GOOGLE,
      providerUserId: data.sub,
    }
  }
}
