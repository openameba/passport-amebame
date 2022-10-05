import passport = require('passport');
import express = require('express');

type ProfilePrivacy = 'anonymous' | 'everyone' | 'onlyMe';

type ProfileJson = {
  id: {
    amebaId: string,
    asId: string,
  },
  time: {
    create: string,
    update: string,
  },
  nickname: {
    value: string,
    censored: boolean,
  },
  gender: {
    value: string,
    privacy: ProfilePrivacy
  },
  birthday: {
    value: string,
    privacy: ProfilePrivacy,
    changed: boolean,
  },
  profileImage: {
    originUrl: string,
    thumbnailUrl: string,
    censored: boolean,
    exists: boolean,
    meta: {
      amebaOriginWidth: number,
      amebaOriginHeight: number,
      amebaThumbnailWidth: number,
      amebaThumbnailHeight: number,
    },
  }
};

interface Profile extends passport.Profile {
  id: string;
  displayName: string;
  imageUrl: string;
  gender?: string;
  birthday?: string;

  _raw: string;
  _json: ProfileJson;
}

interface IStrategyOption {
  clientID: string;
  clientSecret: string;
  scope?: string;
  authOrigin?: string;
  profileOrigin?: string;
}

interface IVerifyParams {
  access_token: string;
  as_id: string;
  expires_in: string;
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
      verify: (accessToken: string, refreshToken: string, params: IVerifyParams, profile: Profile, done: (error: Error | null, user?: Express.User) => void) => void);

  name: string;
  authenticate(req: express.Request, options?: Object): void;
  authorizationParams(options: express.Request): IAuthorizationParams;
  userProfile(accessToken: string, done: (error: Error | null, user?: { provider: 'amebame' } & Profile) => void): void;
}
