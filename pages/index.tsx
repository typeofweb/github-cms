import Link from 'next/link';

import { config } from '../config';

const Home = () => {
  return (
    <ul>
      {config.dataTypes.map((dataType) => {
        return (
          <li key={dataType.id}>
            <Link href={`/d/${dataType.id}`}>{dataType.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Home;
