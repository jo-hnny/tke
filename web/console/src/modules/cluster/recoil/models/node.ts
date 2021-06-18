export interface INodeOrigin {
  metadata: {
    name: string;
    creationTimestamp: string;
    uid: string;
    labels: { [key: string]: string };
  };
  spec: {
    podCIDR: string;
  };
  status: {
    conditions: Array<{
      type: 'Ready' | string;
      status: 'False' | 'True';
    }>;
    capacity: {
      cpu: string;
      memory: string;
    };
  };
}

export interface IMasterAndEtcd {
  id: string;
  name: string;
  status: string;
  hardware: string;
  ip: string;
  cidr: string;
  creationTime: string;
}
