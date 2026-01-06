import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import type { ReviewFileResult } from '@/api/review/types'
import { Alert, Card, Col, Descriptions, Progress, Row, Spin, Tag, Typography } from 'antd'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const { Title } = Typography

interface ReviewResultProps {
  reviewResult?: ReviewFileResult
}

function ReviewResult(props: ReviewResultProps) {
  const { reviewResult } = props

  const renderReviewResult = () => {
    if (!reviewResult) {
      return null
    }

    return (
      <div className="mt5">
        <Title level={4}>📝 审查报告</Title>
        <Alert
          className="mb4"
          title="审查完成"
          description={`文件：${reviewResult.filepath}`}
          type="success"
          showIcon
        />

        <Row gutter={16}>
          <Col span={16}>
            <Card title="审查建议" size="small">
              <Markdown
                children={reviewResult.review}
                components={{
                  code(props) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match
                      ? (
                          <SyntaxHighlighter
                            {...rest as SyntaxHighlighterProps}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={a11yDark}
                          />
                        )
                      : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        )
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="文件信息" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="文件大小">
                  {reviewResult.content?.length || 0}
                  {' '}
                  字符
                </Descriptions.Item>
                <Descriptions.Item label="审查时间">
                  {new Date(reviewResult.timestamp).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color="green">已完成</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Card className="mt4" title="原始代码" size="small">
              <SyntaxHighlighter
                className="max-h-50"
                PreTag="div"
                children={String(reviewResult.content).replace(/\n$/, '')}
                language={reviewResult.language}
                style={a11yDark}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  return !reviewResult
    ? (
        <div className="py10 text-center">
          <Spin size="large" tip="正在分析代码，请稍候..." />
          <Progress percent={70} status="active" className="mt5" />
        </div>
      )
    : renderReviewResult()
}

export default ReviewResult
