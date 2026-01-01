import { Icon } from '@iconify/react'
import { Breadcrumb, Button, Card, Col, Form, Input, Layout, Menu, Row, Space, Tabs, Typography } from 'antd'

const { Header, Sider, Content } = Layout
const { Title } = Typography
const { TabPane } = Tabs

function App() {
  const menus = [
    { title: '代码审查', key: 'review', icon: 'ant-design:file-search-outlined' },
    { title: '仓库管理', key: 'repos', icon: 'ant-design:github-outlined' },
    { title: '审查历史', key: 'history', icon: 'ant-design:clock-circle-outlined' },
    { title: 'API 文档', key: 'api', icon: 'ant-design:api-outlined' },
  ]

  return (
    <Layout className="h-screen">
      <Header className="border border-#f0f0f0 border-b-dashed bg-white px5 py0">
        <div className="h-full flex items-center gap3">
          <Icon icon="ant-design:code-outlined" color="#1890ff" height={24} />
          <Title level={3} className="!m0">
            🤖 智能代码审查助手
          </Title>
          <div>
            <Space>
              <Button type="text">仪表盘</Button>
            </Space>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider>
          <Menu className="h-full" mode="inline" defaultSelectedKeys={['review']}>
            {menus.map(menu => (
              <Menu.Item key={menu.key} icon={<Icon icon={menu.icon} />}>
                {menu.title}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="px6 pb6">
          <Breadcrumb className="my4">
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>代码审查</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="rounded-md bg-white p6 shadow-sm">
            <Card title="智能代码审查">
              <Tabs>
                <TabPane tab="单个文件审查" key="single">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form>
                        <Form.Item label="GitHub 仓库 URL" name="repoUrl" tooltip="格式: https://github.com/owner/repo">
                          <Input placeholder="请输入 GitHub 仓库 URL" />
                        </Form.Item>
                      </Form>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
