import Request from './request';

export const queryNodes = async (clusterName: string) => {
  return Request.get<any, { items: Array<any> }>('/api/v1/nodes', {
    headers: {
      'X-TKE-ClusterName': clusterName
    }
  });
};

export const updateMasterNodes = async (machines: any[], clusterName: string) => {
  return Request.patch(`/apis/platform.tkestack.io/v1/clusters/${clusterName}`, {
    spec: {
      machines
    }
  });
};
