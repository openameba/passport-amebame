import passport = require('passport');
import express = require('express');

interface Profile extends passport.Profile {
  id: string;
  displayName: string;
  imageUrl: string;
  gender?: string;
  birthday?: string;

  _raw: string;
  _json: any;
}

interface IStrategyOption {
  clientID: string;
  clientSecret: string;
  scope?: string;
  authOrigin?: string;
  profileOrigin?: string;
}

interface IAuthorizationParams {
  frm_id?: string;
  ameba_frmId?: string;
  provider_id?: string;
  state?: string;
  redirect_uri?: string;
  force_provide?: string;
  response_type?: string;
  display?: string;
}

export class Strategy extends passport.Strategy {
  constructor(options: IStrategyOption,
      verify: (accessToken: string, refreshToken: string, profile: Profile, done: (error: Error | null, user?: Express.User) => void) => void);

  name: string;
  authenticate(req: express.Request, options?: Object): void;
  authorizationParams(options: express.Request): IAuthorizationParams;
  userProfile(accessToken: string, done: (error: Error | null, user?: { provider: 'amebame' } & Profile) => void): void;
}
