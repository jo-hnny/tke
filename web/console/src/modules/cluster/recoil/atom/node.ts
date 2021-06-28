import { atom, selector, atomFamily } from 'recoil';
import { IMasterAndEtcd, INodeOrigin } from '../models/node';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { queryNodes } from '@src/webApi/nodes';

export const originNodeListRequestIdState = atomFamily({
  key: uuidv4(),
  default: 0
});

export const pageState = atom({
  key: uuidv4(),
  default: {
    size: 20,
    index: 1
  }
});

export const clusterNameState = atom({
  key: uuidv4(),
  default: ''
});

export const originNodeListState = selector<INodeOrigin[]>({
  key: uuidv4(),
  get: async ({ get }) => {
    const page = get(pageState);
    const clusterName = get(clusterNameState);
    get(originNodeListRequestIdState(clusterName));

    if (!clusterName) return [];

    const { items } = await queryNodes(clusterName);

    console.log('send--->');

    return items;
  }
});

export const masterAndEtcdListState = selector<IMasterAndEtcd[]>({
  key: uuidv4(),
  get: ({ get }) => {
    const originNodeList = get(originNodeListState);

    return originNodeList
      .filter(node => Object.keys(node?.metadata?.labels ?? {}).includes('node-role.kubernetes.io/master'))
      .map(node => ({
        id: node.metadata.uid,
        name: node.metadata.name,
        status: node.status.conditions.find(({ type }) => type === 'Ready')?.status === 'True' ? 'Running' : 'Failed',
        hardware: `${node.status?.capacity?.cpu ?? '0'}核，${(
          parseInt(node.status?.capacity?.memory ?? '0') /
          (1024 * 1024)
        ).toFixed(2)}GB`,
        ip: node.metadata.name,
        cidr: node.spec.podCIDR,
        creationTime: dayjs(node.metadata.creationTimestamp).format('YYYY-MM-DD HH:mm:ss')
      }));
  }
});

export const masterNodesCountState = selector({
  key: uuidv4(),
  get: ({ get }) => {
    const masterAndEtcdList = get(masterAndEtcdListState);

    return masterAndEtcdList.length;
  }
});
