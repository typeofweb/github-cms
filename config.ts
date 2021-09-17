import { polishPlurals } from 'polish-plurals';

export const config: Config = {
  repo: 'typeofweb.com',
  owner: 'typeofweb',
  dataTypes: [
    {
      id: 'posts',
      label: 'Artykuły',
      i18n: {
        quantity: (n: number) => polishPlurals('artykuł', 'artykuły', 'artykułów', n),
      },
      path: '/_posts',
    },
  ],
};

export interface Config {
  readonly repo: string;
  readonly owner: string;
  readonly dataTypes: readonly DataType[];
}

export interface DataType {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly i18n?: {
    readonly quantity: (n: number) => string;
  };
}
