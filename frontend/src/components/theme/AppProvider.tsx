import type { ThemeConfig } from 'antd'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

function AppProvider({ children }: { children: React.ReactNode }) {
  const theme: ThemeConfig = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      colorLink: '#1890ff',
    },
    components: {
      Button: {
        borderRadius: 6,
      },
      Card: {
        borderRadius: 8,
      },
      Input: {
        borderRadius: 6,
      },
    },
  }

  return <ConfigProvider locale={zhCN} theme={theme}>{children}</ConfigProvider>
}

export default AppProvider
