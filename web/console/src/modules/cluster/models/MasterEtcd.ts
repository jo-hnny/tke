export interface IMasterNode {
  id: string;
  isEdit: boolean;
  ipList: string;
  port: number;
  certType: CertType;
  username: string;
  password: string;
  privateKey: string;
  privateKeyPassword: string;
  gpu: boolean;
}

export enum CertType {
  Password,
  Key
}

export interface IRequestMasterNode extends Omit<IMasterNode, 'ipList'> {
  ip: string;
}
