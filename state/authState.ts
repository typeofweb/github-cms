import { atom } from 'recoil';

import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface AuthState {
  readonly token: string;
}

export const authState = atom<RestEndpointMethodTypes['users']['getAuthenticated']['response']['data'] | null>({
  key: 'authState',
  default: null,
});
