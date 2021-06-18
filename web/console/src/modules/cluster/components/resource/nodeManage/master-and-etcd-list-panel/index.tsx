import React from 'react';
import { Button, Space, Table, Typography } from 'antd';
import { useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import { masterAndEtcdListState, clusterNameState } from '@src/modules/cluster/recoil/atom/node';
import { ColumnType } from 'antd/lib/table';
import { IMasterAndEtcd } from '@src/modules/cluster/recoil/models/node';
import { router } from '@src/modules/cluster/router';

export const MasterAndEtcdListPanel: React.FC<{ clusterName: string }> = ({ clusterName }) => {
  const setClusterName = useSetRecoilState(clusterNameState);
  setClusterName(clusterName);
  const masterAndEtcdList = useRecoilValueLoadable(masterAndEtcdListState);

  const columns: ColumnType<IMasterAndEtcd>[] = [
    {
      title: '节点名',
      align: 'center',
      dataIndex: 'name'
    },

    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render(status) {
        return <Typography.Text type={status === 'Running' ? 'success' : 'danger'}>{status}</Typography.Text>;
      }
    },

    {
      title: '配置',
      align: 'center',
      dataIndex: 'hardware'
    },

    {
      title: 'IP地址',
      align: 'center',
      dataIndex: 'ip'
    },

    {
      title: 'POD CIDR',
      align: 'center',
      dataIndex: 'cidr'
    },

    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'creationTime'
    },

    {
      title: '操作',
      dataIndex: 'actions',
      align: 'center',
      render() {
        return (
          <Space>
            <Button type="link">移除</Button>
            <Button type="link">更多</Button>
          </Space>
        );
      }
    }
  ];

  return (
    <React.Fragment>
      <Space>
        <Button type="primary">监控</Button>
        <Button
          type="primary"
          onClick={() =>
            router.navigate({ sub: 'sub', mode: 'add-master', type: 'nodeManange', resourceName: 'master-etcd' })
          }
        >
          添加节点
        </Button>
      </Space>
      <Table
        columns={columns}
        loading={masterAndEtcdList.state !== 'hasValue'}
        dataSource={masterAndEtcdList.state === 'hasValue' ? masterAndEtcdList.contents : []}
        style={{ marginTop: 10 }}
        rowKey="id"
      />
    </React.Fragment>
  );
};
