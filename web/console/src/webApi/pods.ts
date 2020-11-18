import Request from './request';
import { v4 as uuidv4 } from 'uuid';

export interface PodItem {
  id: string;
  metadata: {
    creationTimestamp: string;
    generateName: string;
    labels: {
      'k8s-app': string;
      'pod-template-hash': string;
      'qcloud-app': string;
    };
    managedFields: {
      apiVersion: string;
      fieldsType: string;
      manager: string;
      operation: string;
      time: string;
    }[];
    name: string;
    namespace: string;
    ownerReferences: {
      apiVersion: string;
      blockOwnerDeletion: boolean;
      controller: boolean;
      kind: string;
      name: string;
      uid: string;
    }[];
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  spec: {
    containers: {
      image: string;
      imagePullPolicy: string;
      name: string;
      resources: {
        limits: {
          cpu: string;
          memory: string;
        };
        requests: {
          cpu: string;
          memory: string;
        };
      };
      terminationMessagePath: string;
      terminationMessagePolicy: string;
      volumeMounts: {
        mountPath: string;
        name: string;
        readOnly: boolean;
      }[];
    }[];
    dnsPolicy: string;
    enableServiceLinks: boolean;
    priority: number;
    restartPolicy: string;
    schedulerName: string;
    securityContext: Record<string, unknown>;
    serviceAccount: string;
    serviceAccountName: string;
    terminationGracePeriodSeconds: number;
    tolerations: {
      effect: string;
      key: string;
      operator: string;
      tolerationSeconds: number;
    }[];
    volumes: {
      name: string;
      secret: {
        defaultMode: number;
        secretName: string;
      };
    }[];
  };
  status: {
    conditions: {
      lastProbeTime: null | string;
      lastTransitionTime: null | string;
      message: string;
      reason: string;
      status: string;
      type: string;
    }[];
    phase: string;
    qosClass: string;
  };
}

export interface FetchPodsResponse {
  items: PodItem[];
  metadata: {
    continue?: string;
  };
}

export interface FetchPodsProps {
  limit: number;
  continueStr: string;
  fillters?: Record<string, string>;
}

export const getDeploymentsPods = ({
  namespace,
  k8sApp,
  clusterName
}: {
  namespace: string;
  clusterName: string;
  k8sApp: string;
}) => async ({ limit, continueStr, fillters = {} }: FetchPodsProps): Promise<FetchPodsResponse> => {
  const { items, metadata } = await Request.get<any, any>(`/api/v1/namespaces/${namespace}/pods`, {
    params: {
      ...fillters,

      limit,
      continue: continueStr,
      labelSelector: `k8s-app=${k8sApp}`,
      fieldSelector: ``
    },
    headers: {
      'X-TKE-ClusterName': clusterName
    }
  });

  return {
    items: items.map(pod => ({ ...pod, id: uuidv4() })),
    metadata
  };
};
