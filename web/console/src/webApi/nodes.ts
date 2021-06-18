import Request from './request';

export const queryNodes = async (clusterName: string) => {
  return Request.get<any, { items: Array<any> }>('/api/v1/nodes', {
    headers: {
      'X-TKE-ClusterName': clusterName
    }
  });
};

export const addMasterNodes = async (
  nodes: Array<{ ip: string; password: string; port: number; username: string }>
) => {
  return Request.patch('/apis/platform.tkestack.io/v1/clusters/global?fieldManager=kubectl-patch', [
    {
      op: 'add',
      path: '/spec/machines/3',
      value: { ip: '10.206.16.53', password: 'am9obm55end1OTQu', port: 22, username: 'root' }
    }
  ]);
};
