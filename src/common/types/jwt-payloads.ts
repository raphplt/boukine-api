export type AccessJwt = {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
};

export type RefreshJwt = {
  sub: string;
  jti: string;
  iat?: number;
  exp?: number;
};
