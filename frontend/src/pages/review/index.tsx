import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import type { RepositoryInfo, RepositoryInfoParams } from '@/api/repository/types'
import type { ReviewFileParams, ReviewFileResult } from '@/api/review/types'
import { Icon } from '@iconify/react'
import { Alert, Button, Card, Col, Descriptions, Divider, Form, Input, Progress, Row, Spin, Tabs, Tag, Typography } from 'antd'
import { useState } from 'react'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { fetchRepositoryInfo } from '@/api/repository'
import { reviewFileApi } from '@/api/review'

const { TabPane } = Tabs
const { Title } = Typography

function ReviewPage() {
  const [loading, setLoading] = useState(false)
  const [repositoryInfo, setRepositoryInfo] = useState<null | RepositoryInfo>(null)
  const [reviewResult, setReviewResult] = useState<null | ReviewFileResult>(null)
  const [form] = Form.useForm()

  // TODO: debug
  setReviewResult({
    filepath: 'src/components/base/AppTable/index.vue',
    content: '<script setup lang="ts">\nimport type { ButtonProps, DataTableRowKey, PaginationProps } from \'naive-ui\'\nimport type { RowData } from \'naive-ui/es/data-table/src/interface\'\nimport type {\n  AppTableColumn,\n  AppTableColumns,\n  AppTableProps,\n  Operations,\n} from \'./types.ts\'\nimport { NDataTable, NFlex, NPopover } from \'naive-ui\'\nimport { resolveDirective, withDirectives } from \'vue\'\nimport { renderButton, renderIcon } from \'@/utils/tools\'\n\nconst props = withDefaults(defineProps<AppTableProps>(), {\n  checkedRowKeys: () => [],\n  showPagination: true,\n  loading: false,\n  operations: () => [],\n  rowKey: () => (row: RowData) => row.id,\n  maxHeight: undefined,\n})\n\n/** 表格列 */\nconst tableColumns = computed(() => {\n  const operationColumn = renderOperationColumn(props.operations)\n  return [...props.columns, ...operationColumn]\n})\n\n/** 分页 */\nconst paginationOptions = computed<PaginationProps>(() => {\n  const page = props.searchParams.page ?? 1\n  const pageSize = props.searchParams.pageSize ?? 10\n  const itemCount = props.searchParams.total ?? 0\n\n  return {\n    page,\n    pageSize,\n    itemCount,\n    pageSizes: [10, 30, 50, 100, 200],\n    showQuickJumper: true,\n    showSizePicker: true,\n    prefix: ({ itemCount }) => `共 ${itemCount} 条`,\n  }\n})\n\n/** 分页 */\nconst pagination = computed(\n  () => !!props.showPagination && paginationOptions.value,\n)\n\n/** 表格操作列宽度 */\nconst operationColumnWidth = computed(() => {\n  const length = props.operations.length\n  const width\n    = length < 3\n      ? props.operations.reduce((acc, cur) => {\n          const hanziLength = cur.text.length\n          return acc + hanziLength * 50\n        }, 0)\n      : 116\n\n  return width\n})\n\n/** 表格内容的横向宽度 */\nconst scrollX = computed(() => {\n  if (props.columns.length === 0)\n    return 0\n  const fixedLeftColumnsWidth = props.columns.reduce(\n    (acc, cur) =>\n      acc + (cur.fixed === \'left\' ? (cur.width ? Number(cur.width) : 0) : 0),\n    0,\n  )\n  const columnsWidth = props.columns.reduce(calculateTableWidth, 0)\n  const fixedRightColumnsWidth = operationColumnWidth.value\n\n  return fixedLeftColumnsWidth + columnsWidth + fixedRightColumnsWidth\n})\n\n/** update checked-row-keys */\nfunction handleUpdateCheckedRowKeys(keys: DataTableRowKey[]) {\n  props.onUpdateCheckedRowKeys?.(keys)\n  props[\'onUpdate:checkedRowKeys\']?.(keys)\n}\n\n/** update page */\nfunction handleUpdatePage(page: number) {\n  props.onUpdatePage?.(page)\n  props[\'onUpdate:page\']?.(page)\n}\n\n/** update page-size */\nfunction handleUpdatePageSize(size: number) {\n  props.onUpdatePageSize?.(size)\n  props[\'onUpdate:pageSize\']?.(size)\n}\n\n/** 计算表格宽度 */\nfunction calculateTableWidth(acc: number, cur: AppTableColumn): number {\n  const childrenColumnWidth = cur.children?.reduce(calculateTableWidth, 0) ?? 0\n  const columnWidth = !cur.children?.length && cur.width ? Number(cur.width) : 0\n\n  return acc + childrenColumnWidth + columnWidth\n}\n\n/** 渲染操作列按钮 */\nfunction renderOperationColumnButtons(\n  operations: Operations,\n  row: RowData,\n  index: number,\n) {\n  const { onAction } = props\n  return operations.map((operation) => {\n    const props: ButtonProps = {\n      size: \'small\',\n      type: operation?.type ?? \'default\',\n      disabled: operation?.disabled?.(row, index) ?? false,\n      renderIcon: operation.icon\n        ? () => renderIcon({ name: operation.icon as string })\n        : undefined,\n      onClick: () => onAction?.(operation.text, row, index),\n    }\n    const render = renderButton(props, () => operation.text)\n\n    if (operation?.auth) {\n      const authDirective = resolveDirective(\'auth\')\n      return withDirectives(render, [[authDirective, operation.text]])\n    }\n\n    return render\n  })\n}\n\n/** 渲染操作列 */\nfunction renderOperationColumn(operations: Operations): AppTableColumns {\n  const newOperationColumn: AppTableColumn = {\n    title: \'操作\',\n    align: \'center\',\n    key: \'operations\',\n    fixed: \'right\',\n    width: operationColumnWidth.value,\n  }\n  if (!operations || operations.length <= 0)\n    return []\n\n  newOperationColumn.render = (row, index) => {\n    if (operations.length > 2) {\n      return h(\n        NPopover,\n        { trigger: \'click\', placement: \'bottom\' },\n        {\n          trigger: () =>\n            renderButton(\n              {\n                type: \'info\',\n                size: \'small\',\n                iconPlacement: \'right\',\n                renderIcon: () => renderIcon({ name: \'ep:arrow-down\' }),\n              },\n              () => \'更多\',\n            ),\n          default: () =>\n            h(NFlex, { vertical: true, justify: \'center\' }, () =>\n              renderOperationColumnButtons(operations, row, index)),\n        },\n      )\n    }\n    return h(NFlex, { justify: \'center\' }, () =>\n      renderOperationColumnButtons(operations, row, index))\n  }\n\n  return [newOperationColumn]\n}\n</script>\n\n<template>\n  <NDataTable\n    flex="1"\n    class="flex-1"\n    :columns="tableColumns"\n    :checked-row-keys="checkedRowKeys"\n    :data="data"\n    :scroll-x="scrollX"\n    :pagination="pagination"\n    :single-line="false"\n    :loading="loading"\n    :max-height="maxHeight"\n    :flex-height="true"\n    remote\n    striped\n    :row-key="rowKey"\n    :on-update-checked-row-keys="handleUpdateCheckedRowKeys"\n    :on-update-page="handleUpdatePage"\n    :on-update-page-size="handleUpdatePageSize"\n  />\n</template>\n\n<style scoped></style>\n',
    review: '## 代码审查报告\n\n### 1. 代码质量评分（1-10分）\n**分数：7.5分**\n\n**理由：**\n- **优点**：\n  - 代码结构清晰，逻辑组织合理\n  - 使用了TypeScript，类型定义较为完善\n  - 组件化设计良好，职责分离明确\n  - 响应式处理使用computed，符合Vue3最佳实践\n- **扣分点**：\n  - 存在类型安全问题\n  - 部分计算逻辑复杂度较高\n  - 缺少错误处理机制\n  - 代码可读性在某些部分有待提高\n\n### 2. 发现的问题\n\n#### 问题1：[类型安全] 类型导入路径错误\n- **描述**：`AppTableProps`等类型从`./types.ts`导入，但Vue SFC通常使用`.ts`扩展名，而Vue文件中的导入应该使用`.ts`或省略扩展名。这里使用了`.ts`扩展名，可能导致构建工具解析问题。\n\n#### 问题2：[性能] 计算属性复杂度较高\n- **描述**：`scrollX`计算属性中嵌套了多个reduce操作，每次依赖变化都会重新计算所有列的宽度，对于大型表格可能影响性能。\n\n#### 问题3：[代码质量] 硬编码的魔法数字\n- **描述**：`operationColumnWidth`计算中使用了硬编码的`50`（每个汉字宽度）和`116`（最小宽度），这些值缺乏解释且难以维护。\n\n#### 问题4：[可维护性] 缺少错误边界\n- **描述**：组件没有处理可能的数据异常情况，如`props.columns`为null或undefined时会导致运行时错误。\n\n#### 问题5：[类型安全] 类型断言不安全\n- **描述**：`operation.icon as string`使用了类型断言，但没有验证icon是否存在或类型是否正确。\n\n#### 问题6：[最佳实践] 指令解析可能失败\n- **描述**：`resolveDirective(\'auth\')`可能返回undefined，但代码没有处理这种情况。\n\n### 3. 具体建议\n\n#### 建议1：[index.vue:4] 修正类型导入路径\n```typescript\n// 修改前\nimport type { AppTableColumn, AppTableColumns, AppTableProps, Operations } from \'./types.ts\'\n\n// 建议修改为\nimport type { AppTableColumn, AppTableColumns, AppTableProps, Operations } from \'./types\'\n```\n\n#### 建议2：[index.vue:30-45] 优化宽度计算逻辑\n- 考虑缓存列宽计算结果，避免重复计算\n- 将硬编码值提取为常量或配置项\n\n#### 建议3：[index.vue:95-115] 添加空值检查和错误处理\n- 在`renderOperationColumnButtons`中添加对`operations`参数的验证\n- 在`calculateTableWidth`中添加对`cur`参数的验证\n\n#### 建议4：[index.vue:105] 改进类型安全\n- 使用类型守卫而不是类型断言\n- 添加icon属性的验证\n\n#### 建议5：[index.vue:108-110] 添加指令存在性检查\n- 检查`authDirective`是否存在再使用\n\n### 4. 改进示例\n\n```typescript\n<script setup lang="ts">\nimport type { ButtonProps, DataTableRowKey, PaginationProps } from \'naive-ui\'\nimport type { RowData } from \'naive-ui/es/data-table/src/interface\'\nimport type {\n  AppTableColumn,\n  AppTableColumns,\n  AppTableProps,\n  Operations,\n} from \'./types\'\nimport { NDataTable, NFlex, NPopover } from \'naive-ui\'\nimport { resolveDirective, withDirectives } from \'vue\'\nimport { renderButton, renderIcon } from \'@/utils/tools\'\n\n// 常量定义\nconst OPERATION_BUTTON_CONFIG = {\n  MIN_WIDTH: 116,\n  CHARACTER_WIDTH: 50,\n  MAX_VISIBLE_BUTTONS: 2,\n} as const\n\nconst props = withDefaults(defineProps<AppTableProps>(), {\n  checkedRowKeys: () => [],\n  showPagination: true,\n  loading: false,\n  operations: () => [],\n  rowKey: () => (row: RowData) => row.id,\n  maxHeight: undefined,\n})\n\n/** 表格列 */\nconst tableColumns = computed(() => {\n  const operationColumn = renderOperationColumn(props.operations)\n  return [...props.columns, ...operationColumn]\n})\n\n/** 分页配置 */\nconst paginationOptions = computed<PaginationProps>(() => {\n  const page = props.searchParams.page ?? 1\n  const pageSize = props.searchParams.pageSize ?? 10\n  const itemCount = props.searchParams.total ?? 0\n\n  return {\n    page,\n    pageSize,\n    itemCount,\n    pageSizes: [10, 30, 50, 100, 200],\n    showQuickJumper: true,\n    showSizePicker: true,\n    prefix: ({ itemCount }: { itemCount: number }) => `共 ${itemCount} 条`,\n  }\n})\n\n/** 分页显示控制 */\nconst pagination = computed(\n  () => !!props.showPagination && paginationOptions.value,\n)\n\n/** 表格操作列宽度 - 优化版本 */\nconst operationColumnWidth = computed(() => {\n  const { operations } = props\n  if (!operations || operations.length === 0) return 0\n  \n  const length = operations.length\n  \n  if (length >= 3) {\n    return OPERATION_BUTTON_CONFIG.MIN_WIDTH\n  }\n  \n  return operations.reduce((acc, cur) => {\n    const textLength = cur.text?.length || 0\n    return acc + textLength * OPERATION_BUTTON_CONFIG.CHARACTER_WIDTH\n  }, 0)\n})\n\n/** 表格内容的横向宽度 - 添加缓存和错误处理 */\nconst scrollX = computed(() => {\n  const { columns } = props\n  if (!columns || columns.length === 0) return 0\n  \n  try {\n    const fixedLeftColumnsWidth = columns.reduce(\n      (acc, cur) => acc + (cur.fixed === \'left\' ? (Number(cur.width) || 0) : 0),\n      0,\n    )\n    \n    const columnsWidth = columns.reduce(calculateTableWidth, 0)\n    const fixedRightColumnsWidth = operationColumnWidth.value\n\n    return fixedLeftColumnsWidth + columnsWidth + fixedRightColumnsWidth\n  } catch (error) {\n    console.error(\'计算表格宽度时出错:\', error)\n    return 0\n  }\n})\n\n/** update checked-row-keys */\nfunction handleUpdateCheckedRowKeys(keys: DataTableRowKey[]) {\n  props.onUpdateCheckedRowKeys?.(keys)\n  props[\'onUpdate:checkedRowKeys\']?.(keys)\n}\n\n/** update page */\nfunction handleUpdatePage(page: number) {\n  props.onUpdatePage?.(page)\n  props[\'onUpdate:page\']?.(page)\n}\n\n/** update page-size */\nfunction handleUpdatePageSize(size: number) {\n  props.onUpdatePageSize?.(size)\n  props[\'onUpdate:pageSize\']?.(size)\n}\n\n/** 计算表格宽度 - 添加错误处理 */\nfunction calculateTableWidth(acc: number, cur: AppTableColumn): number {\n  if (!cur) return acc\n  \n  try {\n    const childrenColumnWidth = cur.children?.reduce(calculateTableWidth, 0) ?? 0\n    const columnWidth = !cur.children?.length && cur.width ? Number(cur.width) : 0\n    return acc + childrenColumnWidth + columnWidth\n  } catch (error) {\n    console.error(\'计算列宽度时出错:\', error, cur)\n    return acc\n  }\n}\n\n/** 渲染操作列按钮 - 改进版本 */\nfunction renderOperationColumnButtons(\n  operations: Operations,\n  row: RowData,\n  index: number,\n) {\n  if (!operations || operations.length === 0) return []\n  \n  const { onAction } = props\n  \n  return operations.map((operation) => {\n    if (!operation) return null\n    \n    const buttonProps: ButtonProps = {\n      size: \'small\',\n      type: operation?.type ?? \'default\',\n      disabled: operation?.disabled?.(row, index) ?? false,\n      renderIcon: operation.icon && typeof operation.icon === \'string\'\n        ? () => renderIcon({ name: operation.icon as string })\n        : undefined,\n      onClick: () => onAction?.(operation.text, row, index),\n    }\n    \n    const render = renderButton(buttonProps, () => operation.text)\n\n    if (operation?.auth) {\n      const authDirective = resolveDirective(\'auth\')\n      if (authDirective) {\n        return withDirectives(render, [[authDirective, operation.text]])\n      }\n    }\n\n    return render\n  }).filter(Boolean) // 过滤掉null值\n}\n\n/** 渲染操作列 - 改进版本 */\nfunction renderOperationColumn(operations: Operations): AppTableColumns {\n  if (!operations || operations.length <= 0) return []\n  \n  const newOperationColumn: AppTableColumn = {\n    title: \'操作\',\n    align: \'center\',\n    key: \'operations\',\n    fixed: \'right\',\n    width: operationColumnWidth.value,\n  }\n\n  newOperationColumn.render = (row, index) => {\n    if (operations.length > OPERATION_BUTTON_CONFIG.MAX_VISIBLE_BUTTONS) {\n      return h(\n        NPopover,\n        { \n          trigger: \'click\', \n          placement: \'bottom\',\n          showArrow: false \n        },\n        {\n          trigger: () =>\n            renderButton(\n              {\n                type: \'info\',\n                size: \'small\',\n                iconPlacement: \'right\',\n                renderIcon: () => renderIcon({ name: \'ep:arrow-down\' }),\n              },\n              () => \'更多\',\n            ),\n          default: () =>\n            h(\n              NFlex, \n              { \n                vertical: true, \n                justify: \'center\',\n                style: \'padding: 8px;\' \n              }, \n              () => renderOperationColumnButtons(operations, row, index)\n            ),\n        },\n      )\n    }\n    \n    return h(\n      NFlex, \n      { \n        justify: \'center\',\n        style: \'gap: 8px;\' \n      }, \n      () => renderOperationColumnButtons(operations, row, index)\n    )\n  }\n\n  return [newOperationColumn]\n}\n</script>\n\n<template>\n  <NDataTable\n    flex="1"\n    class="flex-1"\n    :columns="tableColumns"\n    :checked-row-keys="checkedRowKeys"\n    :data="data"\n    :scroll-x="scrollX"\n    :pagination="pagination"\n    :single-line="false"\n    :loading="loading"\n    :max-height="maxHeight"\n    :flex-height="true"\n    remote\n    striped\n    :row-key="rowKey"\n    :on-update-checked-row-keys="handleUpdateCheckedRowKeys"\n    :on-update-page="handleUpdatePage"\n    :on-update-page-size="handleUpdatePageSize"\n  />\n</template>\n\n<style scoped>\n/* 可以添加一些样式优化 */\n:deep(.n-data-table) {\n  --n-border-radius: 8px;\n}\n\n:deep(.n-data-table-th) {\n  font-weight: 600;\n}\n</style>\n```\n\n### 复杂度分析\n\n#### 时间复杂度：\n1. `operationColumnWidth`：O(n)，n为操作按钮数量\n2. `scrollX`：O(m)，m为列数量，但包含嵌套reduce，最坏情况O(m²)（当有深层嵌套列时）\n3. `renderOperationColumnButtons`：O(k)，k为操作按钮数量\n\n#### 空间复杂度：\n1. 主要存储列配置和操作按钮配置：O(m + k)\n2. 计算属性缓存：O(1) 到 O(m)（取决于Vue的响应式系统实现）\n\n#### 优化建议：\n1. 对于大型表格，考虑使用Memoization缓存列宽计算结果\n2. 对于深层嵌套列，考虑使用迭代代替递归计算宽度\n3. 考虑虚拟滚动支持超大型数据集',
    timestamp: '2026-01-02T08:47:38.165Z',
    language: 'javascript',
  })

  const getRepositoryInfo = async (params: RepositoryInfoParams) => {
    const data = await fetchRepositoryInfo(params)
    setRepositoryInfo(data)
  }

  const handleSingleFileReview = async (params: ReviewFileParams) => {
    const { code, owner, repo } = params
    try {
      setLoading(true)
      if (!code) {
        getRepositoryInfo({
          owner,
          repo,
        })
      }
      // const data = await reviewFileApi(params)
      // setReviewResult(data)
    }
    finally {
      setLoading(false)
    }
  }

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
                language="javascript"
                style={a11yDark}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <Card title="智能代码审查">
      <Tabs>
        <TabPane tab="单个文件审查" key="single">
          <Row gutter={24}>
            <Col span={12}>
              <Form labelCol={{ span: 6 }} form={form} onFinish={handleSingleFileReview}>
                <Form.Item label="仓库所有者" name="owner" rules={[{ required: true, message: '请输入仓库所有者' }]}>
                  <Input placeholder="owner" />
                </Form.Item>
                <Form.Item label="仓库名称" name="repo" rules={[{ required: true, message: '请输入仓库名称' }]}>
                  <Input placeholder="repository" />
                </Form.Item>
                <Form.Item label="文件路径" name="filepath" rules={[{ required: true, message: '请输入文件路径' }]}>
                  <Input placeholder="src/App.ts" />
                </Form.Item>
                <Form.Item label="分支" name="branch">
                  <Input placeholder="main" />
                </Form.Item>
                <Divider>或</Divider>
                <Form.Item label="代码内容" name="code">
                  <Input.TextArea className="font-mono" rows={8} placeholder="粘贴你要审查的代码内容到这里..." />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<Icon icon="ant-design:search-outlined" />}
                    loading={loading}
                  >
                    开始审查
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={12}>
              {
                repositoryInfo && (
                  <Card title="仓库信息">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="仓库">{repositoryInfo.name}</Descriptions.Item>
                      <Descriptions.Item label="描述">{repositoryInfo.description}</Descriptions.Item>
                      <Descriptions.Item label="语言">{repositoryInfo.language}</Descriptions.Item>
                      <Descriptions.Item label="星标">
                        <Tag color="gold">
                          ⭐
                          {repositoryInfo.stars}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="分支">
                        <Tag>{repositoryInfo.defaultBranch}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                )
              }
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="批量审查" key="batch">
          <Alert
            className="mb4"
            title="批量审查提示"
            description="选择多个文件进行批量审查，系统将自动分析每个文件的质量和潜在问题"
            type="info"
            showIcon
          />
          <Card title="选择审查文件" />
        </TabPane>
      </Tabs>
      {/* 审查结果 */}
      {loading
        ? (
            <div className="py10 text-center">
              <Spin size="large" tip="正在分析代码，请稍候..." />
              <Progress percent={70} status="active" className="mt5" />
            </div>
          )
        : renderReviewResult()}
    </Card>
  )
}

export default ReviewPage
