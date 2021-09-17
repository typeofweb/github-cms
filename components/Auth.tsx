import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCurrentUserQuery } from '../cms/storage/auth';

import type { PropsWithChildren } from 'react';

export const Auth = ({ children }: PropsWithChildren<{}>) => {
  const { data: currentUser } = useCurrentUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (currentUser || router.route === '/login') {
      return;
    }

    void router.replace(`/login?next=` + encodeURIComponent(router.asPath));
  }, [currentUser, router]);

  if (currentUser || router.route === '/login') {
    return <>{children}</>;
  } else {
    return null;
  }
};
