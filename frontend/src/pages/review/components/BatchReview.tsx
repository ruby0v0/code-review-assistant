import { Alert, Card } from 'antd'

function BatchReview() {
  return (
    <>
      <Alert
        className="mb4"
        title="批量审查提示"
        description="选择多个文件进行批量审查，系统将自动分析每个文件的质量和潜在问题"
        type="info"
        showIcon
      />
      <Card title="选择审查文件" />
    </>
  )
}

export default BatchReview
