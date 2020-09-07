import React from 'react';
import { FormPanel } from '@tencent/ff-component';
import { Table, TableColumn } from '@tea/component';

export const ClusterPlugInfoPanel = () => {
  const columns: TableColumn[] = [
    { key: 'plug', header: '组件' },
    { key: 'des', header: '描述' },
    { key: 'status', header: '状态' },
    { key: 'action', header: '操作' }
  ];

  return (
    <FormPanel title="组件信息">
      <Table columns={columns} />
    </FormPanel>
  );
};
