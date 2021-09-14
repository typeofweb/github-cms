import { Octokit } from 'octokit';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { authState } from '../../../state/authState';

export const LoginScreen = () => {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    if (auth) {
      return;
    }

    openLoginPopup()
      .then((data) => {
        if (!data) {
          // @todo
          return;
        }
        const { token } = data;
        const octokit = new Octokit({ auth: token });
        return octokit.rest.users.getAuthenticated();
      })
      .then((data) => {
        setAuth(data?.data ?? null);
      })
      .catch((_err) => {
        // @todo
      });
  }, [auth, setAuth]);

  return (
    <div>
      <h1>Login Screen</h1>
    </div>
  );
};

function tryJsonParse<T>(input: string): T | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function openLoginPopup(): Promise<{
  readonly token: string;
  readonly provider: string;
} | null> {
  const width = 960;
  const height = 600;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;

  const url = `http://localhost:4444/api/auth/github`;

  return new Promise((resolve, reject) => {
    const authWindow = window.open(
      url,
      'Type of Web Auth',
      `width=${width}, height=${height}, top=${top}, left=${left}`,
    );
    authWindow?.focus();
    window?.addEventListener('message', onAuthorizing);

    function onAuthorizing(e: MessageEvent<string>) {
      if (e.origin !== 'http://localhost:4444') {
        return;
      }
      const match = /^authorization:github:(success|error):(.+)$/.exec(e.data);
      if (!match) {
        return;
      }

      authWindow?.removeEventListener('message', onAuthorizing);
      authWindow?.close();

      const [_, status, payload] = match;
      if (status === 'error') {
        const data = tryJsonParse<{}>(payload);
        return reject(data);
      } else {
        const data = tryJsonParse<{
          readonly token: string;
          readonly provider: string;
        }>(payload);
        return resolve(data);
      }
    }
  });
}
