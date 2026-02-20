import { OAuthCallbackUseCase } from '../../application/usecases/auth/OAuthCallbackUseCase';
import { Request, Response } from 'express';
import { handleError } from '../errors/handleError';
import { OAuthProvider } from '../../domain/types/OAuthProvider';
import { IOAuthClient } from '../../infra/services/oauth/IOAuthClient';

export class AuthController {
  constructor(
    private readonly oAuthCallbackUseCase: OAuthCallbackUseCase,
    private readonly googleOAuthClient: IOAuthClient,
    private readonly githubOAuthClient: IOAuthClient,
    private readonly frontendOAuthRedirect: string,
  ) {}

  public async google(req: Request, res: Response) {
    const state = (req.query.state ?? "") as string;


    res.redirect(this.googleOAuthClient.getAuthUrl(state));
  }

  public async googleCallback(req: Request, res: Response) {
    this.callback(req, res, OAuthProvider.GOOGLE);
  }


  public async github(req: Request, res: Response) {
    const state = (req.query.state ?? "") as string;


    res.redirect(this.githubOAuthClient.getAuthUrl(state));
  }

  public async githubCallback(req: Request, res: Response) {
    this.callback(req, res, OAuthProvider.GITHUB);
  }

  private async callback(req: Request, res: Response, provider: OAuthProvider) {
    const state = req.query.state ?? "";
    const code = req.query.code as string;

    try {
      const output = await this.oAuthCallbackUseCase.execute({
        provider,
        code
      });

      return res.redirect(`${this.frontendOAuthRedirect}?token=${output.token}&state=${state}`);
    } catch (error) {
      handleError(error, res);
    }
  }
}
