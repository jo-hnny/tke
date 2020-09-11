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

  const records = [
    {
      plug: '监控告警',
      des: '监控告警，prometheus',
      status: 'running',
      action: '开启'
    },

    {
      plug: '日志采集',
      des: '日志采集，loagent',
      status: 'running',
      action: '开启'
    }
  ];

  return (
    <FormPanel title="组件信息">
      <Table columns={columns} records={records} recordKey="plug" />
    </FormPanel>
  );
};
