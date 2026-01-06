import type { MenuProps } from 'antd'
import { Icon } from '@iconify/react'
import { Button, Layout, Menu, Space, Typography } from 'antd'
import { Outlet, useNavigate } from 'react-router'

const { Header, Sider, Content } = Layout
const { Title } = Typography

function BaseLayout() {
  const navigate = useNavigate()
  const menus = [
    { title: '代码审查', key: 'review', icon: 'ant-design:file-search-outlined' },
    { title: '审查历史', key: 'history', icon: 'ant-design:clock-circle-outlined' },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`)
  }

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
          <Menu className="h-full" mode="inline" defaultSelectedKeys={['review']} onClick={handleMenuClick}>
            {menus.map(menu => (
              <Menu.Item key={menu.key} icon={<Icon icon={menu.icon} />}>
                {menu.title}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="p4">
          <Content className="overflow-auto rounded-md bg-white p4 shadow-sm">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
