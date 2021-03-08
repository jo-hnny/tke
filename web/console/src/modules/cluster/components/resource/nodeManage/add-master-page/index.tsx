import React, { useState } from 'react';
import { AntdLayout } from '@src/modules/common/layouts';
import { Button, Space, Form, Input, InputNumber, List, Radio, Checkbox, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export const AddMasterPage: React.FC = () => {
  const [masterAddedList, setMasterAddedList] = useState([
    {
      id: uuidv4(),
      isEdit: true,
      ipList: '',
      port: 22,

      certType: 'password',

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

        certType: 'password',

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

  function addIsDisabled() {
    return masterAddedList.some(({ isEdit }) => isEdit);
  }

  return (
    <AntdLayout
      title="添加Master节点"
      footer={
        <Space>
          <Button type="primary">确认</Button>
          <Button>取消</Button>
        </Space>
      }
    >
      <List
        dataSource={masterAddedList}
        footer={
          <Tooltip title={addIsDisabled() ? '请先完成待编辑项' : ''}>
            <Button type="dashed" block onClick={addEmptyItem} disabled={addIsDisabled()}>
              添加
            </Button>
          </Tooltip>
        }
        rowKey="id"
        renderItem={node => (
          <List.Item
            actions={node.isEdit ? undefined : [<Button type="link">编辑</Button>, <Button type="link">删除</Button>]}
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
                    <Radio.Button value="password">密码认证</Radio.Button>
                    <Radio.Button value="key">密匙认证</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="用户名" name="username">
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="密码"
                  hidden={node.certType === 'key'}
                  name="password"
                  rules={[
                    {
                      required: node.certType === 'password',
                      message: '密码必填！'
                    }
                  ]}
                >
                  <Input type="password" />
                </Form.Item>

                <Form.Item
                  label="私钥"
                  hidden={node.certType === 'password'}
                  name="privateKey"
                  rules={[
                    {
                      required: node.certType === 'key',
                      message: '私匙必填！'
                    }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label="私钥密码"
                  hidden={node.certType === 'password'}
                  name="privateKeyPassword"
                  rules={[
                    {
                      required: node.certType === 'key',
                      message: '私匙密码必填！'
                    }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item label="GPU" name="gpu">
                  <Checkbox />
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <Space>
                    <Button type="primary" htmlType="submit" form={node.id}>
                      保存
                    </Button>
                    <Button onClick={() => handleDel(node.id)}>取消</Button>
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
