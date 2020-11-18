import React, { useCallback, useEffect } from 'react';
import { Card, Pagination, Table, TableProps } from '@tea/component';
import { getDeploymentsPods, PodItem } from '@/src/webApi/pods';
import { usePods } from '@/src/modules/common/hooks';
import { PagingQuery } from '@tencent/ff-redux';
import { RootProps } from '../../ClusterApp';
import { TagSearchBox } from '@tea/component';

export interface PodTableProps extends TableProps, RootProps {
  namespace: string;
  k8sApp: string;
  clusterName: string;
  addons: any[];
  setPods(pods: PodItem[]): void;
}

export function PodTabel({ columns, namespace, k8sApp, clusterName, addons = [], setPods }: PodTableProps) {
  const fetchPods = useCallback(getDeploymentsPods({ namespace, k8sApp, clusterName }), [
    namespace,
    k8sApp,
    clusterName
  ]);

  const { pods, changePageIndex, changePageSize, pageIndex, pageSize, podCount } = usePods({
    fetchPods,
    needPolling: true
  });

  function handlePagingChange({ pageIndex, pageSize }: PagingQuery) {
    changePageIndex(pageIndex);
    changePageSize(pageSize);
  }

  useEffect(() => {
    setPods(pods);
  }, [pods]);

  const tags = [
    {
      type: 'input',
      key: 'podName',
      name: '名称'
    },
    {
      type: 'input',
      key: 'podIp',
      name: 'ip'
    },
    {
      type: 'input',
      key: 'podStatus',
      name: '状态'
    }
  ];

  return (
    <Card>
      <Card.Body>
        <TagSearchBox attributes={tags} />
        <Table columns={columns} records={pods} recordKey="id" addons={addons} />
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          recordCount={podCount}
          onPagingChange={handlePagingChange}
          stateText={`第${pageIndex}页`}
          pageIndexVisible={false}
          endJumpVisible={false}
        />
      </Card.Body>
    </Card>
  );
}
