import React, { useEffect } from 'react';
import { Button, Space, Table, Typography, Popconfirm, Tooltip } from 'antd';
import { useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import {
  masterAndEtcdListState,
  clusterNameState,
  originNodeListRequestIdState
} from '@src/modules/cluster/recoil/atom/node';
import { ColumnType } from 'antd/lib/table';
import { IMasterAndEtcd } from '@src/modules/cluster/recoil/models/node';
import { router } from '@src/modules/cluster/router';
import { updateMasterNodes } from '@src/webApi/nodes';

export const MasterAndEtcdListPanel: React.FC<{ cluster: any }> = ({ cluster }) => {
  const clusterName = cluster?.metadata?.name ?? '';
  const setClusterName = useSetRecoilState(clusterNameState);
  setClusterName(clusterName);
  const refersh = useSetRecoilState(originNodeListRequestIdState(clusterName));

  useEffect(() => {
    refersh(id => id + 1);
  }, []);

  const master0Ip = cluster?.spec?.machines?.[0]?.ip ?? '';

  async function deleteNode(ip) {
    const machines = (cluster?.spec?.machines ?? []).filter(machine => machine?.ip !== ip);

    try {
      await updateMasterNodes(machines, clusterName);
    } catch (error) {}

    refersh(id => id + 1);
  }

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
      dataIndex: 'ip',
      align: 'center',
      render(ip) {
        return (
          <Popconfirm title="确定移除该节点吗？" onConfirm={() => deleteNode(ip)} disabled={ip === master0Ip}>
            <Tooltip title={ip === master0Ip ? 'master0节点不能被移除！' : ''}>
              <Button type="link" disabled={ip === master0Ip}>
                移除
              </Button>
            </Tooltip>
          </Popconfirm>
        );
      }
    }
  ];

  return (
    <React.Fragment>
      <Space>
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
