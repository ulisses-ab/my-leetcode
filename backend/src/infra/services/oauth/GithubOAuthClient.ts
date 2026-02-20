import { IOAuthClient } from "./IOAuthClient";
import { OAuthUser } from "../../../application/services/interfaces/IOAuthService";
import { OAuthProvider } from "../../../domain/types/OAuthProvider";

export class GithubOAuthClient implements IOAuthClient {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string,
  ) {}

  public getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'read:user user:email',
      state,
      allow_signup: 'true',
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  public async getUserFromAuthCode(code: string): Promise<OAuthUser> {
    const accessToken = await this.exchangeCodeForAccessToken(code);

    return await this.fetchUserInfo(accessToken);
  }

  private async exchangeCodeForAccessToken(code: string): Promise<string> {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange auth code for access token");
    }

    const data = await response.json();
    return data.access_token;
  }

  private async fetchUserInfo(accessToken: string): Promise<OAuthUser> {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to fetch GitHub user emails");
    }

    const emails: { email: string; primary: boolean; verified: boolean }[] = await emailResponse.json();
    const primaryEmail = emails.find(e => e.primary && e.verified)?.email ?? emails[0]?.email;

    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch GitHub user info");
    }

    const data = await profileResponse.json();

    return {
      email: primaryEmail,
      name: data.name || data.login,
      provider: OAuthProvider.GITHUB,
      providerUserId: data.id.toString(),
    };
  }
}
