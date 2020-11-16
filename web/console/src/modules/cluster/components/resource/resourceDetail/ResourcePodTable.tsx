import React from 'react';
import { Card, Pagination, Table, TableProps } from '@tea/component';
import { getDeploymentsPods, PodItem } from '@/src/webApi/pods';
import { usePods } from '@/src/modules/common/hooks';
import { PagingQuery } from '@tencent/ff-redux';

export interface PodTableProps extends TableProps {
  namespace: string;
  deployments: string;
  clusterName: string;
  addons: any[];
}

export function PodTabel({ columns, namespace, deployments, clusterName, addons = [] }: PodTableProps) {
  const { pods, podCount, setPageIndex, setPageSize } = usePods({
    fetchPods: getDeploymentsPods({ namespace, deployments, clusterName })
  });

  function handlePagingChange({ pageIndex, pageSize }: PagingQuery) {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  }

  return (
    <Card>
      <Card.Body>
        <Table columns={columns} records={pods} recordKey={(pod: PodItem) => pod.metadata.uid} addons={addons} />
        <Pagination recordCount={podCount} onPagingChange={handlePagingChange} />
      </Card.Body>
    </Card>
  );
}
