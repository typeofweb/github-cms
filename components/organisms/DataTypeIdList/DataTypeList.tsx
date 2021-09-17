import { useRouter } from 'next/router';

import { useGetListOfDataType } from '../../../cms/storage/github';
import { config } from '../../../config';

export const DataTypeList = () => {
  const router = useRouter();
  const { dataTypeId } = router.query;

  const dataType = getDataTypeById(dataTypeId);

  const { data } = useGetListOfDataType({ dataType, owner: config.owner, repo: config.repo });

  return (
    <ul>
      {data?.map((d) => (
        <li key={d.sha}>{d.name}</li>
      ))}
    </ul>
  );
};

function getDataTypeById(dataTypeId: string | readonly string[] | undefined) {
  const dataType = config.dataTypes.find((dt) => dt.id === dataTypeId);

  if (!dataType) {
    throw new Error(`${dataTypeId} not found!`);
  }
  return dataType;
}
