import Crypto from 'crypto';

import Invariant from 'invariant';
import { AuthorizationCode } from 'simple-oauth2';

import type { NextApiHandler } from 'next';
import type { ModuleOptions } from 'simple-oauth2';

const isNotEmptyString = (value: any): value is string => typeof value === 'string' && value.length > 0;
const getRandomState = () => Crypto.randomBytes(16).toString('hex');

const OAUTH_HOST = 'https://github.com';
const OAUTH_TOKEN_PATH = '/login/oauth/access_token';
const OAUTH_AUTHORIZE_PATH = '/login/oauth/authorize';

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_SCOPE, OAUTH_REDIRECT_URI } = process.env;
Invariant(isNotEmptyString(OAUTH_CLIENT_ID), 'OAUTH_CLIENT_ID must be provided!');
Invariant(isNotEmptyString(OAUTH_CLIENT_SECRET), 'OAUTH_CLIENT_SECRET must be provided!');

const oauthConfig: ModuleOptions = {
  client: {
    id: OAUTH_CLIENT_ID,
    secret: OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: OAUTH_HOST,
    tokenPath: OAUTH_TOKEN_PATH,
    authorizePath: OAUTH_AUTHORIZE_PATH,
  },
};

function getAuthUrl() {
  Invariant(isNotEmptyString(OAUTH_SCOPE), 'OAUTH_SCOPE must be provided!');
  Invariant(isNotEmptyString(OAUTH_REDIRECT_URI), 'OAUTH_REDIRECT_URI must be provided!');

  const client = new AuthorizationCode(oauthConfig);

  const authorizationUrl = client.authorizeURL({
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE.split(','),
    state: getRandomState(),
  });

  return authorizationUrl;
}

const getAuthResult = async (code: string) => {
  Invariant(isNotEmptyString(OAUTH_SCOPE), 'OAUTH_SCOPE must be provided!');
  Invariant(isNotEmptyString(OAUTH_REDIRECT_URI), 'OAUTH_REDIRECT_URI must be provided!');

  const client = new AuthorizationCode(oauthConfig);

  const accessToken = await client.getToken({
    code,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE.split(','),
  });

  if (isGitHubError(accessToken.token)) {
    throw accessToken.token;
  }

  const { token } = client.createToken(accessToken);

  if (isGitHubError(token)) {
    throw token;
  }

  return token;
};

export const apiAuth: NextApiHandler = (_req, res) => {
  const url = getAuthUrl();
  res.writeHead(302, { Location: url });
  res.end();
};

export const apiCallback: NextApiHandler = async (req, res) => {
  try {
    if (isGitHubError(req.query)) {
      throw req.query;
    }

    const code = req.query.code;

    if (typeof code !== 'string') {
      throw new Error('Invalid code');
    }

    const token = await getAuthResult(code);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(
      renderResponse('success', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ok
        token: token.token.access_token,
        provider: 'github',
      }),
    );
  } catch (e) {
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(renderResponse('error', e));
  }
};

const renderResponse = (type: 'success' | 'error', data: unknown) => {
  return /* html */ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Authorizing…</title>
  </head>
  <body>
    <p id="message"></p>
    <script>
      window.opener.postMessage(
        'authorization:github:${type}:${JSON.stringify(data)}',
        window.opener.location.origin
      );
    </script>
  </body>
</html>
    `.trim();
};

interface GitHubError {
  readonly error: string;
  readonly error_description?: string;
  readonly error_uri?: string;
}

const isGitHubError = (data: unknown): data is GitHubError => !!(typeof data === 'object' && data && 'error' in data);
