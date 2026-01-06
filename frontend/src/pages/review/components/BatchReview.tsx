import type { TableColumnsType } from 'antd'
import type { RepositoryFiles, RepositoryFilesParams, RepositoryFilesResult } from '@/api/repository/types'
import { Alert, Button, Card, Form, Input, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchRepositoryFiles } from '@/api/repository/index'

const { Text } = Typography

function BatchReview() {
  const [fileResult, setFileResult] = useState<RepositoryFilesResult[]>()
  const [files, setFiles] = useState<RepositoryFiles[]>()
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()
  const columns: TableColumnsType<RepositoryFiles> = [
    {
      key: 'path',
      title: '文件路径',
      dataIndex: 'path',
    },
    {
      key: 'size',
      title: '文件大小',
      dataIndex: 'size',
      render: (size?: number) => (
        <Text>
          {Math.ceil((size || 0) / 1024)}
          {' '}
          KB
        </Text>
      ),
    },
    {
      key: 'type',
      title: '文件类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => <Tag>{type}</Tag>,
    },
  ]

  useEffect(() => {
    console.log('selectedRowKeys:', selectedRowKeys)
  }, [selectedRowKeys])

  const handleSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const handleGetRepositoryFiles = async (params: RepositoryFilesParams) => {
    try {
      setLoading(true)
      const result = await fetchRepositoryFiles(params)
      setFileResult(prev => prev ? [...prev, result] : [result])
      setFiles(result.files)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Alert
        className="mb4"
        title="批量审查提示"
        description="选择多个文件进行批量审查，系统将自动分析每个文件的质量和潜在问题"
        type="info"
        showIcon
      />
      <Card title="选择审查文件">
        <Form labelCol={{ span: 6 }} form={form} onFinish={handleGetRepositoryFiles}>
          <Form.Item label="仓库所有者" name="owner" rules={[{ required: true, message: '请输入仓库所有者' }]}>
            <Input placeholder="owner" />
          </Form.Item>
          <Form.Item label="仓库名称" name="repo" rules={[{ required: true, message: '请输入仓库名称' }]}>
            <Input placeholder="repository" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              获取文件列表
            </Button>
          </Form.Item>
        </Form>
        <Table<RepositoryFiles>
          rowKey="path"
          dataSource={files}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelectChange,
          }}
        />
      </Card>
    </>
  )
}

export default BatchReview
