import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

import { useCurrentUserQuery, useLoginMutation } from '../../../cms/storage/auth';

export const LoginScreen = () => {
  const userQuery = useCurrentUserQuery();
  const loginMutation = useLoginMutation();
  const router = useRouter();

  const loginHandler = useCallback(() => loginMutation.mutate(), [loginMutation]);

  useEffect(() => {
    if (userQuery.data) {
      const next = decodeURIComponent(router.query.next?.toString() || '/');
      if (next !== router.asPath) {
        void router.push(next);
      }
    }
  }, [userQuery.data, router]);

  return (
    <div>
      <button onClick={loginHandler}>Zaloguj się</button>
    </div>
  );
};
