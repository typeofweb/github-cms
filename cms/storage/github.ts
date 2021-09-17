import GrayMatter from 'gray-matter';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOctokit } from './auth';

import type { DataType } from '../../config';
import type { components } from '@octokit/openapi-types';
import type { Octokit } from 'octokit';

const ALLOWED_EXTENSIONS: readonly (string | undefined)[] = ['md', 'mdx'];

export const getListOfDataType =
  (octokit: Octokit) =>
  async ({ owner, repo, dataType }: { readonly owner: string; readonly repo: string; readonly dataType: DataType }) => {
    const data = await octokit.rest.repos.getContent({ owner, repo, path: dataType.path });
    if (Array.isArray(data.data)) {
      const result = await Promise.all(
        data.data
          .filter((f) => f.type === 'file' && ALLOWED_EXTENSIONS.includes(f.name.split('.').pop()))
          .map(async (f) => {
            const data = await octokit.rest.repos.getContent({ owner, repo, path: f.path });
            return data.data;
          }),
      );
      return result.filter((f): f is components['schemas']['content-file'] => !Array.isArray(f) && f.type === 'file');
    }
    return [];
  };

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
}

export const parseDataTypeFileContent = (f: components['schemas']['content-file']) => {
  const input = b64DecodeUnicode(f.content);
  const { content, data } = GrayMatter(input);
  return { content: content.trim(), data };
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
