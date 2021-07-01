import React, { useState } from 'react';
import { AntdLayout } from '@src/modules/common/layouts';
import { Button, Space, Form, Input, InputNumber, List, Radio, Checkbox, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { updateMasterNodes } from '@src/webApi/nodes';
import { IMasterNode, CertType } from '@src/modules/cluster/models/MasterEtcd';
import { router } from '@src/modules/cluster/router';

export const AddMasterPage: React.FC<any> = ({ cluster }) => {
  const [masterAddedList, setMasterAddedList] = useState<IMasterNode[]>([
    {
      id: uuidv4(),
      isEdit: true,
      ipList: '',
      port: 22,

      certType: CertType.Password,

      username: 'root',
      password: '',

      privateKey: '',
      privateKeyPassword: '',

      gpu: false
    }
  ]);

  function handleNodeChange(id, params) {
    setMasterAddedList(masterAddedList.map(item => (item.id === id ? { ...item, ...params } : item)));
  }

  function addEmptyItem() {
    setMasterAddedList([
      ...masterAddedList,
      {
        id: uuidv4(),
        isEdit: true,
        ipList: '',
        port: 22,

        certType: CertType.Password,

        username: 'root',
        password: '',

        privateKey: '',
        privateKeyPassword: '',

        gpu: false
      }
    ]);
  }

  function handleDel(id) {
    setMasterAddedList(list => list.filter(node => node.id !== id));
  }

  function somIsEdited() {
    return masterAddedList.some(({ isEdit }) => isEdit);
  }

  async function perform() {
    const machines = masterAddedList.reduce(
      (machines, { ipList, username, port, certType, password, privateKey, privateKeyPassword }) => [
        ...machines,
        ...ipList.split(';').map(ip => ({
          ip,
          port,
          username,
          ...(certType === CertType.Password
            ? { password: btoa(password) }
            : {
                privateKey: btoa(privateKey),
                privateKeyPassword: privateKeyPassword ? btoa(privateKeyPassword) : undefined
              })
        }))
      ],
      []
    );

    try {
      await updateMasterNodes([...(cluster?.spec?.machines ?? []), ...machines], cluster?.metadata?.name ?? '');
      router.navigate();
    } catch (error) {
      console.log('updateMasterNodes error:', error);
    }
  }

  return (
    <AntdLayout
      title="添加Master节点"
      goBack={() => router.navigate({ sub: 'sub', mode: 'list', type: 'nodeManange', resourceName: 'master-etcd' })}
      footer={
        <Space>
          <Tooltip title={masterAddedList.some(({ isEdit }) => isEdit) ? '请先完成编辑项' : ''}>
            <Button disabled={masterAddedList.some(({ isEdit }) => isEdit)} type="primary" onClick={perform}>
              确认
            </Button>
          </Tooltip>
          <Button onClick={() => history.back()}>取消</Button>
        </Space>
      }
    >
      <List
        dataSource={masterAddedList}
        footer={
          <Tooltip title={somIsEdited() ? '请先完成待编辑项' : ''}>
            <Button type="dashed" block onClick={addEmptyItem} disabled={somIsEdited()}>
              添加
            </Button>
          </Tooltip>
        }
        rowKey="id"
        renderItem={node => (
          <List.Item
            actions={
              node.isEdit
                ? undefined
                : [
                    <Tooltip title={somIsEdited() ? '请先完成待编辑项' : ''}>
                      <Button
                        type="link"
                        disabled={somIsEdited()}
                        onClick={() => handleNodeChange(node.id, { isEdit: true })}
                      >
                        编辑
                      </Button>
                    </Tooltip>,

                    <Tooltip title={masterAddedList.length <= 1 ? '至少添加一个master节点' : ''}>
                      <Button type="link" disabled={masterAddedList.length <= 1} onClick={() => handleDel(node.id)}>
                        删除
                      </Button>
                    </Tooltip>
                  ]
            }
          >
            {node.isEdit ? (
              <Form
                labelCol={{ span: 6 }}
                labelAlign="left"
                wrapperCol={{ span: 18 }}
                style={{ width: 500 }}
                initialValues={node}
                validateTrigger="onBlur"
                id={node.id}
                onFinish={values => handleNodeChange(node.id, { ...values, isEdit: false })}
              >
                <Form.Item
                  label="目标机器"
                  extra="可以输入多个机器IP,用“;”分隔"
                  name="ipList"
                  rules={[
                    {
                      required: true,
                      message: '目标机器必填！'
                    },
                    {
                      transform: (list: string) => list.split(';'),
                      validator: (_, ips: string[]) =>
                        ips.every(ip => validator.isIP(ip)) ? Promise.resolve() : Promise.reject(),
                      message: '格式不正确'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="SSH端口"
                  name="port"
                  rules={[
                    {
                      required: true,
                      message: 'SSH端口必填！'
                    }
                  ]}
                >
                  <InputNumber min={0} step={1} />
                </Form.Item>

                <Form.Item label="认证方式">
                  <Radio.Group
                    value={node.certType}
                    onChange={({ target }) => handleNodeChange(node.id, { certType: target.value })}
                  >
                    <Radio.Button value={CertType.Password}>密码认证</Radio.Button>
                    <Radio.Button value={CertType.Key}>密匙认证</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="用户名" name="username">
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="密码"
                  hidden={node.certType === CertType.Key}
                  name="password"
                  rules={[
                    {
                      required: node.certType === CertType.Password,
                      message: '密码必填！'
                    }
                  ]}
                >
                  <Input type="password" />
                </Form.Item>

                <Form.Item
                  label="私钥"
                  hidden={node.certType === CertType.Password}
                  name="privateKey"
                  rules={[
                    {
                      required: node.certType === CertType.Key,
                      message: '私匙必填！'
                    }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item label="私钥密码" hidden={node.certType === CertType.Password} name="privateKeyPassword">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item label="GPU" name="gpu" valuePropName="checked">
                  <Checkbox />
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <Space>
                    <Button type="primary" htmlType="submit" form={node.id}>
                      保存
                    </Button>
                    <Tooltip title={masterAddedList.length <= 1 ? '至少添加一个master节点' : ''}>
                      <Button disabled={masterAddedList.length <= 1} onClick={() => handleDel(node.id)}>
                        取消
                      </Button>
                    </Tooltip>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              node.ipList
            )}
          </List.Item>
        )}
      />
    </AntdLayout>
  );
};
