import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOctokit } from './auth';

import type { DataType } from '../../config';
import type { Octokit } from 'octokit';

export const getListOfDataType =
  (octokit: Octokit) =>
  async ({ owner, repo, dataType }: { readonly owner: string; readonly repo: string; readonly dataType: DataType }) => {
    const data = await octokit.rest.repos.getContent({ owner, repo, path: dataType.path });
    if (Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  };

export const useGetListOfDataType = ({
  owner,
  repo,
  dataType,
}: {
  readonly owner: string;
  readonly repo: string;
  readonly dataType: DataType;
}) => {
  const octokit = useOctokit();
  const fn = useMemo(() => getListOfDataType(octokit), [octokit]);
  return useQuery(['useGetListOfDataType', { owner, repo, dataType }], () => fn({ owner, repo, dataType }));
};
