import Dynamic from 'next/dynamic';

const DataTypeList = Dynamic<{}>(
  () =>
    import(/* webpackChunkName: "DataTypeList" */ '../../components/organisms/DataTypeIdList/DataTypeList').then(
      (m) => m.DataTypeList,
    ),
  { ssr: false },
);

const DataTypeIdPage = () => {
  return <DataTypeList />;
};

export default DataTypeIdPage;
