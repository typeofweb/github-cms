import Ms from 'ms';
import { Octokit } from 'octokit';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { tryJsonParse } from '../../utils';

type TokenPayload = {
  readonly token: string;
};

const TOKEN_QUERY_KEY = ['auth'] as const;
const CURRENT_USER_QUERY_KEY = ['login', 'github'] as const;

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    // cancel and clear all
    await queryClient.cancelQueries({ predicate: () => true });
    queryClient.clear();
  }, [queryClient]);
};

export const useCurrentUserQuery = () => {
  const { data: token } = useTokenQuery();

  return useQuery(
    CURRENT_USER_QUERY_KEY,
    async () => {
      const octokit = new Octokit({ auth: token?.token });
      const res = await octokit.rest.users.getAuthenticated();
      return res.data;
    },
    {
      staleTime: Ms('1 hour'),
      retry: false,
    },
  );
};

export const useTokenQuery = () => {
  const queryClient = useQueryClient();
  return { data: queryClient.getQueryData<TokenPayload>(TOKEN_QUERY_KEY) };
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const logout = useLogoutMutation();

  return useMutation(openLoginPopup, {
    onSuccess(data) {
      if (!data) {
        return logout();
      }

      const { token } = data;
      queryClient.setQueryData<TokenPayload>(TOKEN_QUERY_KEY, { token });
    },
  });
};

export const useOctokit = () => {
  const { data: token } = useTokenQuery();
  return useMemo(() => new Octokit({ auth: token?.token }), [token?.token]);
};

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
    window?.addEventListener('message', onAuthorization);

    function onAuthorization(e: MessageEvent<string>) {
      if (e.origin !== 'http://localhost:4444') {
        return;
      }
      const match = /^authorization:github:(success|error):(.+)$/.exec(e.data);
      if (!match) {
        return;
      }

      authWindow?.removeEventListener('message', onAuthorization);
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
